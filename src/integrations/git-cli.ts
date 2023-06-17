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
    }" --reverse --source --format='{"commit": "%H","author": "%an","dateUnix": %at,"commitMessage": "%s","branch": "%S"},' --after="${fromDate.toISOString()}" --before="${toDate.toISOString()}"`
    , {
      silent: true,
    })

    if (gitLogCommand.code !== 0) {
      throw new Error(
        `unable to execute git log to ${this.config.path}, output: ${gitLogCommand.stderr}`,
      )
    }

    const parsedOutput = gitLogCommand?.stdout ? `[${gitLogCommand.stdout.slice(0, -2)}]` : '[]'
    logger.debug('git log parsed output', {parsedOutput})

    const gitLogJson: GitCliLog[] = JSON.parse(parsedOutput)

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
    return {
      id: rawData.commit,
      date: dayjs.unix(rawData.dateUnix).toISOString(),
      description: rawData.commitMessage,
      projectName: rawData.projectName,
      type: GitCliIntegration.type,
      __raw: this.bananaReporterConfig.includeRawObject ? rawData : undefined,
    }
  }
}
