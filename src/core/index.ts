import dayjs = require('dayjs')
import {z} from 'zod'
import {SourceType} from '../integrations/base'
import {zIsoString} from '../util/common'
import {logger} from '../util/logger'

export const BananaOutputFileFormat = z.enum(['json', 'jsonl', 'csv'])
export type BananaOutputFileFormat = z.infer<typeof BananaOutputFileFormat>

export const BananaConfig = z.object({
  includeRawObject: z.boolean().default(false),
  format: BananaOutputFileFormat,
  out: z.string().min(1),
  /**
     * ISO8601 date range for all the sources,
     * can be overridden per source
     */
  from: zIsoString,
  to: zIsoString,
  /**
     * banana reporter configuration file path
     */
  configFileLocation: z.string().min(1),
  /**
     * delay in seconds between every HTTP requests (sources)
     */
  delay: z.number().min(0).max(5000).default(300),
  /**
     * where to fetch data
     */
  sources: z.array(z.object({
    type: SourceType,
  }).passthrough(),
  ).nonempty(),
}).refine(schema => {
  const dateFrom = dayjs(schema.from)
  const dateTo = dayjs(schema.to)
  return dateFrom.isSame(dateTo) || dateFrom.isBefore(dateTo)
}, "'from' date must be before 'to' date")
.refine(schema => {
  return !(schema.includeRawObject && (
    schema.format !== BananaOutputFileFormat.Enum.json && schema.format !== BananaOutputFileFormat.Enum.jsonl
  ))
}, "'include-raw-object' can only be used with json or jsonl format")
export type BananaConfig = z.infer<typeof BananaConfig>;

export function loadAndValidateConfig(input: unknown): BananaConfig {
  logger.debug('loadAndValidateConfig input', input)
  const validated = BananaConfig.parse(input)

  return validated
}
