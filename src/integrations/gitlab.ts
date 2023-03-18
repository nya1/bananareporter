import {CommonBananaReporterObj, IntegrationBase, SourceType} from './base'
// import {Axios} from 'axios'
import {delay, zIsoString} from '../util/common'
import {BananaConfig} from '../core'
import {z} from 'zod'
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios'
import dayjs = require('dayjs')
import {logger} from '../util/logger'
import objectPath = require('object-path');

type GitlabRawEventData = { 'id': 123, 'project_id': 4, 'action_name': 'pushed to', 'target_id': null, 'target_iid': null, 'target_type': null, 'author_id': 333, 'target_title': null, 'created_at': '2022-01-03T16:29:13.384Z', 'author': { 'id': 333, 'username': 'testusername', 'name': 'Test', 'state': 'active', 'avatar_url': 'https://gitlab.com/uploads/-/system/user/avatar/333/avatar.png', 'web_url': 'https://gitlab.com/testusername' }, 'push_data': { 'commit_count': 2, 'action': 'pushed', 'ref_type': 'branch', 'commit_from': '314d57ea6ece959ffe94a5186abc67db0372dae2', 'commit_to': '7fec56814c69d22296c3e3e240763a0c759d3927', 'ref': 'branchname', 'commit_title': 'chore: commit msg', 'ref_count': null }, 'author_username': 'testusername' }

type GitlabRawProjectData = {
    'id': 3,
    'description': null,
    'default_branch': 'master',
    'visibility': 'private',
    'ssh_url_to_repo': 'git@example.com:diaspora/diaspora-project-site.git',
    'http_url_to_repo': 'http://example.com/diaspora/diaspora-project-site.git',
    'web_url': 'http://example.com/diaspora/diaspora-project-site',
    'readme_url': 'http://example.com/diaspora/diaspora-project-site/blob/master/README.md',
    'tag_list': [ // deprecated, use `topics` instead
      'example',
      'disapora project'
    ],
    'topics': [
      'example',
      'disapora project'
    ],
    'owner': {
      'id': 3,
      'name': 'Diaspora',
      'created_at': '2013-09-30T13:46:02Z'
    },
    'name': 'Diaspora Project Site',
    'name_with_namespace': 'Diaspora / Diaspora Project Site',
    'path': 'diaspora-project-site',
    'path_with_namespace': 'diaspora/diaspora-project-site'
}

export type GitlabConfig = z.infer<typeof GitlabConfig>;

export const GitlabConfig = z.object({
  committerUsername: z.string().min(1),
  userId: z.number().optional(),
  token: z.string().min(1),
  filters: z.array(z.object({
    on: z.string().min(1),
    regex: z.string().min(1),
  })).nonempty().optional(),
  domain: z.string().optional().default('gitlab.com'),
  apiVersion: z.string().startsWith('v').optional().default('v4'),
  protocol: z.union([z.literal('http'), z.literal('https')]).optional().default('https'),
  apiBasePath: z.string().optional().default('api'),
  // TODO should be extended from a base integration
  from: zIsoString.optional(),
  to: zIsoString.optional(),
  delay: z.number().min(0).optional(),
})

export class GitlabIntegration extends IntegrationBase {
    static type = SourceType.Enum.gitlab;

    private projectIdToDetails: {[projectId: number]: GitlabRawProjectData} = {};

    private httpClient: AxiosInstance;

    private config: GitlabConfig;

    private delayToUse: number;

    private dateRange: {
      from: string,
      to: string,
    }

    private bananaReporterConfig: BananaConfig;

    constructor(_rawConfig: unknown, bananaReporterConfig: BananaConfig) {
      super(_rawConfig, bananaReporterConfig)

      logger.debug('gitlab integration')

      this.config = GitlabConfig.parse(_rawConfig)

      logger.debug('gitlab integration config', this.config)

      this.bananaReporterConfig = bananaReporterConfig

      this.delayToUse = this.config.delay ?? this.bananaReporterConfig.delay

      logger.debug(`gitlab integration delayToUse ${this.delayToUse}`)

      this.dateRange = {
        from: this.config.from ?? this.bananaReporterConfig.from,
        to: this.config.to ?? this.bananaReporterConfig.to,
      }

      logger.debug('gitlab integration dateRange', this.dateRange)

      const baseURL = `${this.config.protocol}://${this.config.domain}/${this.config.apiBasePath}/${this.config.apiVersion}`

      logger.debug(`gitlab integration baseURL ${baseURL}`)

      this.httpClient = axios.create({
        baseURL,
        headers: {
          Authorization: `Bearer ${this.config.token}`,
        },
        timeout: 35_000,
      })
    }

    private setup(options: {
        projectDetails: GitlabRawProjectData[]
    }): void {
      for (const p of options.projectDetails) {
        if (!(p.id in this.projectIdToDetails)) {
          this.projectIdToDetails[p.id] = p
        }
      }
    }

    private async httpRequest<T>(path: string, config?: AxiosRequestConfig) {
      logger.debug(`gitlab integration http request ${path}`, config)
      const res = await this.httpClient<T>(path, {
        ...config,
      })
      return res.data
    }

    /**
     * events API needs the user id, retrieve it
     * from the username provided
     * @returns GitLab user id
     */
    private async getUserId(): Promise<number> {
      if (typeof this.config.userId !== 'undefined') {
        return this.config.userId
      }

      const username = this.config.committerUsername
      const data = await this.httpRequest<any[]>(`/users?username=${username}`)

      if (data.length === 0) {
        throw new Error(`unable to find the GitLab username ${username}`)
      }

      return data[0].id as number
    }

    async fetchData(): Promise<CommonBananaReporterObj[]> {
      const userId = await this.getUserId()
      logger.debug(`gitlab integration userId ${userId}`)

      let page = 1

      let eventList: GitlabRawEventData[] = []

      const projectIds = new Set<number>()

      while (page > 0) {
        logger.debug(`gitlab integration working on ${page}`)

        /* eslint-disable no-await-in-loop */
        const events = await this.getUserEvents(userId, {
          from: this.dateRange.from,
          to: this.dateRange.to,
          page,
        })
        // no more data, break loop
        if (events.length === 0) {
          logger.debug('gitlab integration no more events to process')

          break
        }

        // eslint-disable-next-line unicorn/prefer-spread
        eventList = eventList.concat(events)

        for (const e of events) {
          projectIds.add(e.project_id)
        }

        logger.debug(`gitlab integration eventList ${eventList.length} (added ${events.length} events)`)

        page += 1

        await delay(this.delayToUse)
      }

      // get all project details
      const projectDetails = await this.getProjects(userId, projectIds)
      logger.debug('gitlab integration projectDetails', projectDetails)
      for (const p of projectDetails) {
        this.projectIdToDetails[p.id] = p
      }

      this.setup({
        projectDetails,
      })

      // format data to common obj
      let filteredData = eventList
      .filter(e => {
        return (
          e.action_name
          .startsWith('pushed') &&
          e?.push_data?.commit_title &&
          !e.push_data.commit_title.startsWith('Merge branch')
        )
      })

      const projectsToRemove = new Set<number>()
      for (const filter of this.config.filters || []) {
        const targetKey = filter.on
        if (targetKey.startsWith('$project.')) {
          // custom logic for project matching
          for (const projectId of Object.keys(this.projectIdToDetails)) {
            const project = this.projectIdToDetails[Number(projectId)]
            const targetProjectKey = targetKey.split('.').pop() as string
            if (!(targetProjectKey in project)) {
              const errorMsg = `while filtering the project ${project.name} (id ${project.id}) unable to find the key ${targetProjectKey} in the project's object (available keys: ${Object.keys(project).join(',')})`
              logger.error(errorMsg)
              throw new Error(errorMsg)
            }

            const regex = new RegExp(filter.regex)
            if (!regex.test(project[targetProjectKey as keyof GitlabRawProjectData] as string)) {
              // false, remove
              projectsToRemove.add(Number(projectId))
            }
          }
        }

        filteredData = filteredData.filter(e => {
          const targetKey = filter.on
          // custom project is filtered later on
          if (targetKey.startsWith('$project.')) {
            return true
          }

          const regex = new RegExp(filter.regex)
          const value = objectPath.get(e, targetKey)
          if (typeof value === 'undefined') {
            const errorMsg = `while filtering event id ${e.id} unable to find the key ${targetKey} in the event's object (available keys: ${Object.keys(e).join(',')})`
            logger.error(errorMsg)
            throw new Error(errorMsg)
          }

          return regex.test(value)
        })
      }

      if (projectsToRemove.size > 0) {
        filteredData = filteredData.filter(e => {
          return !projectsToRemove.has(e.project_id)
        })
      }

      const formattedData = filteredData.map(e => this.toBananaReporterObj(e))

      return formattedData
    }

    /**
     * GitLab doesn't return project information in the events call,
     * need to fetch all projects to enrich the events data
     * @param userId identifier of gitlab user
     * @param projectIds set of project ids found in events call
     * @returns list of projects found
     */
    private async getProjects(userId: number, projectIds: Set<number>) {
      // get all user projects, if some projects are missing
      // try to get the project via a direct GET call
      const remainingProjectIdsToFetch = projectIds
      const projects = await this.httpRequest<GitlabRawProjectData[]>(`/users/${userId}/projects`)

      for (const p of projects) {
        remainingProjectIdsToFetch.delete(p.id)
      }

      const projectsLoaded: GitlabRawProjectData[] = projects

      if (remainingProjectIdsToFetch.size > 0) {
        // delay before starting to fetch other data
        await delay(this.delayToUse)

        // eslint-disable-next-line unicorn/prefer-spread
        for (const projectId of Array.from(remainingProjectIdsToFetch)) {
          try {
            const project = await this.httpRequest<GitlabRawProjectData>(`/projects/${projectId}`)
            if (project) {
              remainingProjectIdsToFetch.delete(projectId)
              projectsLoaded.push(project)
            }
          } catch (error) {
            logger.debug(`gitlab integration unable to fetch details for project ID ${projectId}`, error)
          }

          await delay(this.delayToUse)
        }
      }

      if (remainingProjectIdsToFetch.size > 0) {
        logger.warn(`unable to retrieve details for the following project ids: ${[...remainingProjectIdsToFetch].join(',')} make sure you have still access to these projects, the report won't include the project names`)
      }

      return projectsLoaded
    }

    private async getUserEvents(userId: number, options: {
        from: string,
        to: string,
        page?: number,
    }) {
      const fromDate = dayjs(options.from)
      const toDate = dayjs(options.to)

      // recalculate from - to according on GitLab API behaviour
      const from = fromDate.subtract(1, 'day').format('YYYY-MM-DD')
      const to = toDate.add(1, 'day').format('YYYY-MM-DD')

      logger.debug(`gitlab integration getUserEvents from ${from} to ${to}`)

      const page = options.page ?? 1
      const url = `/users/${userId}/events`
      const events = await this.httpRequest<GitlabRawEventData[]>(url, {
        params: {
          after: from,
          before: to,
          sort: 'asc',
          // eslint-disable-next-line camelcase
          per_page: 100,
          action: 'pushed',
          page,
        },
      })

      return events
    }

    toBananaReporterObj(rawData: GitlabRawEventData): CommonBananaReporterObj {
      const projectId = rawData.project_id
      const projectDetails = this.projectIdToDetails[projectId]
      const projectName = projectDetails?.path
      const description = `${rawData.push_data.commit_title} branch:${rawData.push_data.ref} git:${rawData.push_data.commit_to.slice(0, 7)}`
      return {
        id: `${String(rawData.push_data.commit_to)}`,
        date: rawData.created_at,
        username: rawData.author_username,
        description,
        projectId: String(projectId),
        projectName,
        type: GitlabIntegration.type,
        __raw: this.bananaReporterConfig.includeRawObject ? rawData : undefined,
      }
    }
}
