import {z} from 'zod'

const ISO_DATE_REGEX = /\d{4}-[01]\d-[0-3]\d/

// from https://github.com/colinhacks/zod/issues/482#issuecomment-1369800957
export const zIsoString = z
.string()
.regex(ISO_DATE_REGEX, 'date must be a valid ISO8601 date')

export function delay(ms: number): Promise<NodeJS.Timeout> {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise(resolve => setTimeout(resolve, ms))
}
