import {z} from 'zod'
import {BananaConfig} from '../core'

export const SourceType = z.enum(['gitlab', 'github'])
export type SourceType = z.infer<typeof SourceType>;

export interface CommonBananaReporterObj {
    date: string;
    description: string;
    username?: string;
    projectId?: string;
    projectName?: string;
    type: SourceType,
    __raw: any
}
// TODO improve base integration
export abstract class IntegrationBase {
    static type: SourceType;
    // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
    constructor(_rawConfig: unknown, _bananaConfig: BananaConfig) {}
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    toBananaReporterObj(_rawData: any): Promise<CommonBananaReporterObj> | CommonBananaReporterObj {
      throw new Error('implement toBananaReporterObj method')
    }

    async fetchData(): Promise<CommonBananaReporterObj[]> {
      throw new Error('implement fetchData method')
    }
}
