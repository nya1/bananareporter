import {CommonBananaReporterObj, IntegrationBase, SourceType} from './base'
// import {Axios} from 'axios'
import {zIsoString} from '../util/common'
import {BananaConfig} from '../core'
import {z} from 'zod'
import dayjs = require('dayjs');
import {logger} from '../util/logger'
import path = require('path');
import {lstatSync} from 'node:fs'
import * as shell from 'shelljs'

export type GitCliConfig = z.infer<typeof GitCliConfig>;
export const GitCliConfig = z.object({
  // TODO support wildcard
  path: z
  .string()
  .min(1)
  .refine(s => {
    return path.resolve(s)
  }),
  authorUsername: z.string().min(1),
  from: zIsoString.optional(),
  to: zIsoString.optional(),
})

interface GitCliLog {
  commit: string;
  commitMessage: string;
  author: string;
  dateUnix: number;
  projectName?: string;
  branch: string;
}

export class GitCliIntegration extends IntegrationBase {
  static type = SourceType.Enum['git-cli'];

  private config: GitCliConfig;

  private dateRange: {
    from: string;
    to: string;
  };

  private bananaReporterConfig: BananaConfig;

  constructor(_rawConfig: unknown, bananaReporterConfig: BananaConfig) {
    super(_rawConfig, bananaReporterConfig)

    logger.debug('git-cli integration')

    this.config = GitCliConfig.parse(_rawConfig)

    logger.debug('git-cli integration config', this.config)

    this.bananaReporterConfig = bananaReporterConfig

    this.dateRange = {
      from: this.config.from ?? this.bananaReporterConfig.from,
      to: this.config.to ?? this.bananaReporterConfig.to,
    }

    logger.debug('git-cli integration dateRange', this.dateRange)

    if (!lstatSync(this.config.path)?.isDirectory()) {
      const errorMsg = `Unable to find path ${this.config.path} or not a valid directory`
      logger.error(errorMsg)
      throw new Error(errorMsg)
    }

    logger.debug(`git-cli path ${this.config.path} exists`)

    if (!shell.which('git')) {
      throw new Error('git CLI required for git-cli source')
    }
  }

  async fetchData(): Promise<CommonBananaReporterObj[]> {
    const fromDate = dayjs(this.dateRange.from).startOf('day')
    const toDate = dayjs(this.dateRange.to).endOf('day')

    // extract project name from directory
    const directory = path.basename(this.config.path)

    // execute git log
    const gitLogCommand = shell.exec(`git -C ${
      this.config.path
    } --no-pager log --branches="*" --author="${
      this.config.authorUsername
    // hash - author - date unix - commit message - branch
    }" --reverse --no-merges --source --format='%H~~~~~%an~~~~~%at~~~~~%s~~~~~%S>%n%n' --after="${fromDate.toISOString()}" --before="${toDate.toISOString()}"`
    , {
      silent: true,
    })

    if (gitLogCommand.code !== 0) {
      throw new Error(
        `unable to execute git log to ${this.config.path}, output: ${gitLogCommand.stderr}`,
      )
    }

    const gitLogJson: GitCliLog[] = [];

    if (gitLogCommand.stdout) {
      for (const line of gitLogCommand.stdout.split('>\n\n')) {
        const splitGit = line.split('~~~~~')
        logger.debug('git log', {splitGit})
        if (splitGit.length !== 5) {
          continue
        }

        gitLogJson.push({
          commit: splitGit[0].replace(/\n/g, ''),
          author: splitGit[1],
          dateUnix: Number(splitGit[2]),
          commitMessage: splitGit[3],
          branch: splitGit[4],
        })
      }
    }

    return gitLogJson.map((e, i) => {
      // add project name
      e.projectName = directory
      return this.toBananaReporterObj(e, i)
    })
  }

  toBananaReporterObj(
    rawData: GitCliLog,
    _index?: number,
  ): CommonBananaReporterObj {
    const description = `${rawData.commitMessage} branch:${rawData.branch} git:${rawData.commit.slice(0, 7)}`

    return {
      id: rawData.commit,
      date: dayjs.unix(rawData.dateUnix).toISOString(),
      description: description,
      projectName: rawData.projectName,
      type: GitCliIntegration.type,
      __raw: this.bananaReporterConfig.includeRawObject ? rawData : undefined,
    }
  }
}
