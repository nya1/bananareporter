import {Command, Flags} from '@oclif/core'
import * as yaml from 'js-yaml'
import {readFileSync, writeFileSync} from 'node:fs'
import path = require('node:path');
import dayjs = require('dayjs');
import {BananaOutputFileFormat, loadAndValidateConfig} from '../../core'
import {CommonBananaReporterObj, SourceType} from '../../integrations/base'
import {GitlabIntegration} from '../../integrations/gitlab'
import {unparse as jsonToCsv} from 'papaparse'
import {omit} from 'lodash'
import {logger} from '../../util/logger'
import {GithubIntegration} from '../../integrations/github'
import {TodoTxtIntegration} from '../../integrations/todotxt'

export default class Run extends Command {
  static description = 'Run report'

  static dateStringValidation(input: string): string {
    if (!dayjs(input).isValid()) {
      throw new Error(`provided date "${input}" is not valid, make sure it's valid ISO8601 string`)
    }

    return input
  }

  static examples = [
    `$ banana-reporter run --from 2023-01-01 --to 2023-01-31
report with 138 entries saved to ./bananareporter.json
`,
  ]

  static flags = {
    config: Flags.string({
      char: 'c',
      description: 'config file location, by default ~/.config/bananareporter/config.yaml',
      required: false,
      env: 'BANANAREPORTER_CONFIG_PATH',
    }),
    from: Flags.string({
      description: 'from date (ISO8601)',
      helpValue: `${dayjs().startOf('month').format('YYYY-MM-DD')}`,
      required: false,
    }),
    to: Flags.string({
      description: 'to date (ISO8601)',
      helpValue: `${dayjs().endOf('month').format('YYYY-MM-DD')}`,
      required: false,
      dependsOn: ['from'],
    }),
    out: Flags.file({
      char: 'o',
      aliases: ['output'],
      description: 'file path to save the output',
      required: true,
      default: './bananareporter_$FROM__$TO.json',
    }),
    format: Flags.string({
      description: 'output file format',
      options: Object.values(BananaOutputFileFormat.Values),
      required: true,
      default: BananaOutputFileFormat.Enum.json,
    }),
    delay: Flags.integer({
      description: 'global delay in millisecons between http requests',
      default: 300,
    }),
    'include-raw-object': Flags.boolean({
      description: 'include raw object in json/jsonl reporter output',
      default: false,
    }),
    'disable-welcome-emoji': Flags.boolean({
      description: 'disable banana welcome emoji',
      default: false,
      hidden: true,
    }),
  }

  async run(): Promise<void> {
    // this.log('🍌 Banana Reporter')
    const {flags} = await this.parse(Run)

    logger.debug('run CLI flags', flags)

    const configFileLocation = flags.config || path.join(this.config.configDir, 'config.yaml')

    logger.debug(`run configFileLocation: ${configFileLocation}`)

    const configContent = yaml.load(readFileSync(configFileLocation).toString()) as Record<string, unknown>
    logger.debug('run configContent', configContent)

    const validatedConfig = loadAndValidateConfig({
      ...configContent,
      configFileLocation,
      ...omit(flags, ['include-raw-object', 'config']),
      includeRawObject: flags['include-raw-object'],
    })
    logger.debug('run validatedConfig', validatedConfig)

    // TODO the sources with different hosts / types can be called in parallel

    let reportList: CommonBananaReporterObj[] = []
    for (const [i, s] of validatedConfig.sources.entries()) {
      logger.debug(`run source loop ${i}`, s)
      this.log(`working on ${s.type} (${i + 1}) source`)
      let res: CommonBananaReporterObj[] = []
      switch (s.type) {
      case SourceType.Enum.gitlab: {
        const integrationLoaded = new GitlabIntegration(s, validatedConfig)
        // eslint-disable-next-line no-await-in-loop
        res = await integrationLoaded.fetchData()

        break
      }

      case SourceType.Enum.github: {
        const integrationLoaded = new GithubIntegration(s, validatedConfig)
        // eslint-disable-next-line no-await-in-loop
        res = await integrationLoaded.fetchData()

        break
      }

      case SourceType.Enum['todo.txt']: {
        const integrationLoaded = new TodoTxtIntegration(s, validatedConfig)
        // eslint-disable-next-line no-await-in-loop
        res = await integrationLoaded.fetchData()

        break
      }

      default: {
        this.error(`unknown source provided ${s.type}`)
      }
      }

      logger.debug(`run source loop integration res length ${res.length}`)

      // eslint-disable-next-line unicorn/prefer-spread
      reportList = reportList.concat(res)
    }

    if (reportList.length === 0) {
      this.warn('no entries found, make sure the date range provided and the sources are correct')
      return
    }

    // re order by date ASC
    reportList.sort((a, b) => {
      return dayjs(a.date).diff(b.date)
    })

    // output
    let outputStr = ''
    // eslint-disable-next-line unicorn/prefer-switch
    if (validatedConfig.format === BananaOutputFileFormat.Enum.csv) {
      const fieldsColumns: Array<keyof CommonBananaReporterObj> = ['date', 'type', 'username', 'projectName', 'description']
      logger.debug('run converting json to csv')
      const csvOutput = jsonToCsv({
        fields: fieldsColumns,
        data: reportList,
      })
      outputStr = csvOutput
    } else if (validatedConfig.format === BananaOutputFileFormat.Enum.json) {
      outputStr = JSON.stringify(reportList, null, 2)
    } else if (validatedConfig.format === BananaOutputFileFormat.Enum.jsonl) {
      logger.debug('run converting json to jsonl')
      outputStr = reportList.map(r => JSON.stringify(r)).join('\n')
    }

    const fileExt = `.${validatedConfig.format}`
    let outFile = validatedConfig.out
    // add file extension
    if (!outFile.endsWith(fileExt)) {
      if (outFile === Run.flags.out.default) {
        outFile = outFile
        .replace(`.${Run.flags.format.default}`, fileExt)
        .replace('$FROM', validatedConfig.from)
        .replace('$TO', validatedConfig.to)
      } else {
        outFile += fileExt
      }
    }

    logger.debug(`run saving to ${outFile} with file content of size ${outputStr.length}`)
    writeFileSync(outFile, outputStr)
    this.log(`report with ${reportList.length} entries saved to ${outFile}`)

    // this.log(`run! ${flags.config} ${JSON.stringify(configContent)}`)
  }
}
