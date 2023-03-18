import {CommonBananaReporterObj, IntegrationBase, SourceType} from './base'
// import {Axios} from 'axios'
import {zIsoString} from '../util/common'
import {BananaConfig} from '../core'
import {z} from 'zod'
import dayjs = require('dayjs')
import {logger} from '../util/logger'
import objectPath = require('object-path');
import {existsSync, readFileSync} from 'node:fs'
import {parse as todoTxtParse, Task} from '@lggruspe/todo-txt-parser'
import path = require('path')

export type TodoTxtConfig = z.infer<typeof TodoTxtConfig>;
export const TodoTxtConfig = z.object({
  // TODO support wildcard
  file: z.string().min(1).default('./todo.txt').refine(s => {
    return path.resolve(s)
  }),
  filters: z.array(z.object({
    on: z.string().min(1),
    regex: z.string().min(1),
  })).nonempty().optional(),
  from: zIsoString.optional(),
  to: zIsoString.optional(),
})

export class TodoTxtIntegration extends IntegrationBase {
    static type = SourceType.Enum['todo.txt'];

    private config: TodoTxtConfig;

    private dateRange: {
      from: string,
      to: string,
    }

    private bananaReporterConfig: BananaConfig;

    constructor(_rawConfig: unknown, bananaReporterConfig: BananaConfig) {
      super(_rawConfig, bananaReporterConfig)

      logger.debug('todo.txt integration')

      this.config = TodoTxtConfig.parse(_rawConfig)

      logger.debug('todo.txt integration config', this.config)

      this.bananaReporterConfig = bananaReporterConfig

      this.dateRange = {
        from: this.config.from ?? this.bananaReporterConfig.from,
        to: this.config.to ?? this.bananaReporterConfig.to,
      }

      logger.debug('todo.txt integration dateRange', this.dateRange)

      if (!existsSync(this.config.file)) {
        const errorMsg = `Unable to find file ${this.config.file}`
        logger.error(errorMsg)
        throw new Error(errorMsg)
      }

      logger.debug(`todo.txt file ${this.config.file} exists`)
    }

    async fetchData(): Promise<CommonBananaReporterObj[]> {
      // parse
      const rawTodoTxt = readFileSync(this.config.file).toString()
      const parsedTodoTxtFile = todoTxtParse(rawTodoTxt)

      const fromDate = dayjs(this.dateRange.from).subtract(1, 'minute')
      const toDate = dayjs(this.dateRange.to).add(1, 'minute')

      let filteredTasks = parsedTodoTxtFile.filter(t => {
        const rawTaskDate = t.completion || t.creation
        // unknown task date, don't include it
        if (typeof rawTaskDate === 'undefined') {
          return false
        }

        const taskDateObj = dayjs(rawTaskDate)
        return (
          taskDateObj.isAfter(fromDate) &&
          taskDateObj.isBefore(toDate)
        )
      })

      // format data to common obj
      for (const filter of this.config.filters || []) {
        const targetKey = filter.on

        filteredTasks = filteredTasks.filter(t => {
          const regex = new RegExp(filter.regex)
          const value = objectPath.get(t, targetKey)
          if (typeof value === 'undefined') {
            const errorMsg = `while filtering "${t.description}" unable to find the key ${targetKey} in the task's object (available keys: ${Object.keys(t).join(',')})`
            logger.error(errorMsg)
            throw new Error(errorMsg)
          }

          return regex.test(value)
        })
      }

      const formattedData = filteredTasks.map((e, i) => this.toBananaReporterObj(e, i))

      return formattedData
    }

    toBananaReporterObj(rawData: Task, index?: number): CommonBananaReporterObj {
      const projectName = rawData.projects?.map(p => p.replace('+', '')).join(',')
      const description = `${rawData.description}`
      return {
        id: `${index}`,
        date: rawData.completion || rawData.creation || '',
        description,
        projectName,
        type: TodoTxtIntegration.type,
        __raw: this.bananaReporterConfig.includeRawObject ? rawData : undefined,
      }
    }
}
