import {CommonBananaReporterObj, IntegrationBase, SourceType} from './base'
// import {Axios} from 'axios'
import {delay, zIsoString} from '../util/common'
import {BananaConfig} from '../core'
import {z} from 'zod'
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios'
import dayjs = require('dayjs')
import {logger} from '../util/logger'
import objectPath = require('object-path');

type GithubCommitItemData = {
    'url': 'https://api.github.com/repos/username/reponame/commits/dd0de5e530c625e188ec7211816898deee6b36ec',
    'sha': 'dd0de5e230c625e188ec7211816898deee6b36ec',
    'node_id': 'MDY1Q29tbWl0NTQ3OTE5NDExOmRkMGRlNWU1MzBjNjI1ZTE4OGVjNzIxMTgxNjg5OGRlZWU2YjM2ZWM=',
    'html_url': 'https://github.com/username/reponame/commit/dd0de5e530c625e188ec7211816898deee6b36ec',
    'comments_url': 'https://api.github.com/repos/username/reponame/commits/dd0de5e530c625e188ec7211816898deee6b36ec/comments',
    'commit': {
      'url': 'https://api.github.com/repos/username/reponame/git/commits/dd0de5e530c625e188ec7211816898deee6b36ec',
      'author': {
        'date': '2022-10-08T20:16:43.000+02:00',
        'name': 'username',
        'email': 'usernamegit@example.com'
      },
      'committer': {
        'date': '2022-10-08T20:16:43.000+02:00',
        'name': 'username',
        'email': 'usernamegit@example.com'
      },
      'message': 'refactor: moved custom badge to components folder',
      'tree': {
        'url': 'https://api.github.com/repos/username/reponame/git/trees/535dc8a05b4bb6f97bda80f3722e85f9af06bd7f',
        'sha': '535dc8a05b4bb6f97bda80f3722e85f9af06bd7f'
      },
      'comment_count': 0
    },
    'author': {
      'login': 'username',
      'id': 1,
      'node_id': 'MDQ2VXNlcjE2NjM2NzQz',
      'avatar_url': 'https://avatars.githubusercontent.com/u/1?v=4',
      'gravatar_id': '',
      'url': 'https://api.github.com/users/username',
      'html_url': 'https://github.com/username',
      'followers_url': 'https://api.github.com/users/username/followers',
      'following_url': 'https://api.github.com/users/username/following{/other_user}',
      'gists_url': 'https://api.github.com/users/username/gists{/gist_id}',
      'starred_url': 'https://api.github.com/users/username/starred{/owner}{/repo}',
      'subscriptions_url': 'https://api.github.com/users/username/subscriptions',
      'organizations_url': 'https://api.github.com/users/username/orgs',
      'repos_url': 'https://api.github.com/users/username/repos',
      'events_url': 'https://api.github.com/users/username/events{/privacy}',
      'received_events_url': 'https://api.github.com/users/username/received_events',
      'type': 'User',
      'site_admin': false
    },
    'committer': {
      'login': 'username',
      'id': 1,
      'node_id': 'MDQ4VXNlcjE2NjM2NzQz',
      'avatar_url': 'https://avatars.githubusercontent.com/u/1?v=4',
      'gravatar_id': '',
      'url': 'https://api.github.com/users/username',
      'html_url': 'https://github.com/username',
      'followers_url': 'https://api.github.com/users/username/followers',
      'following_url': 'https://api.github.com/users/username/following{/other_user}',
      'gists_url': 'https://api.github.com/users/username/gists{/gist_id}',
      'starred_url': 'https://api.github.com/users/username/starred{/owner}{/repo}',
      'subscriptions_url': 'https://api.github.com/users/username/subscriptions',
      'organizations_url': 'https://api.github.com/users/username/orgs',
      'repos_url': 'https://api.github.com/users/username/repos',
      'events_url': 'https://api.github.com/users/username/events{/privacy}',
      'received_events_url': 'https://api.github.com/users/username/received_events',
      'type': 'User',
      'site_admin': false
    },
    'parents': [
      {
        'url': 'https://api.github.com/repos/username/reponame/commits/99cf5912aa946c952d848b04a38d98f3379b98ec',
        'html_url': 'https://github.com/username/reponame/commit/99cf5912aa946c952d848b04a38d98f3379b98ec',
        'sha': '99cf5912aa946c942d848b04a38d98f3379b98ec'
      }
    ],
    'repository': {
      'id': 547_919_410,
      'node_id': 'R_kgDOAKiWMw',
      'name': 'reponame',
      'full_name': 'username/reponame',
      'private': false,
      'owner': {
        'login': 'username',
        'id': 1,
        'node_id': 'MDQ3VXNlcjE2NjM2NzQz',
        'avatar_url': 'https://avatars.githubusercontent.com/u/1?v=4',
        'gravatar_id': '',
        'url': 'https://api.github.com/users/username',
        'html_url': 'https://github.com/username',
        'followers_url': 'https://api.github.com/users/username/followers',
        'following_url': 'https://api.github.com/users/username/following{/other_user}',
        'gists_url': 'https://api.github.com/users/username/gists{/gist_id}',
        'starred_url': 'https://api.github.com/users/username/starred{/owner}{/repo}',
        'subscriptions_url': 'https://api.github.com/users/username/subscriptions',
        'organizations_url': 'https://api.github.com/users/username/orgs',
        'repos_url': 'https://api.github.com/users/username/repos',
        'events_url': 'https://api.github.com/users/username/events{/privacy}',
        'received_events_url': 'https://api.github.com/users/username/received_events',
        'type': 'User',
        'site_admin': false
      },
      'html_url': 'https://github.com/username/reponame',
      'description': 'repository description',
      'fork': false,
      'url': 'https://api.github.com/repos/username/reponame',
      'forks_url': 'https://api.github.com/repos/username/reponame/forks',
      'keys_url': 'https://api.github.com/repos/username/reponame/keys{/key_id}',
      'collaborators_url': 'https://api.github.com/repos/username/reponame/collaborators{/collaborator}',
      'teams_url': 'https://api.github.com/repos/username/reponame/teams',
      'hooks_url': 'https://api.github.com/repos/username/reponame/hooks',
      'issue_events_url': 'https://api.github.com/repos/username/reponame/issues/events{/number}',
      'events_url': 'https://api.github.com/repos/username/reponame/events',
      'assignees_url': 'https://api.github.com/repos/username/reponame/assignees{/user}',
      'branches_url': 'https://api.github.com/repos/username/reponame/branches{/branch}',
      'tags_url': 'https://api.github.com/repos/username/reponame/tags',
      'blobs_url': 'https://api.github.com/repos/username/reponame/git/blobs{/sha}',
      'git_tags_url': 'https://api.github.com/repos/username/reponame/git/tags{/sha}',
      'git_refs_url': 'https://api.github.com/repos/username/reponame/git/refs{/sha}',
      'trees_url': 'https://api.github.com/repos/username/reponame/git/trees{/sha}',
      'statuses_url': 'https://api.github.com/repos/username/reponame/statuses/{sha}',
      'languages_url': 'https://api.github.com/repos/username/reponame/languages',
      'stargazers_url': 'https://api.github.com/repos/username/reponame/stargazers',
      'contributors_url': 'https://api.github.com/repos/username/reponame/contributors',
      'subscribers_url': 'https://api.github.com/repos/username/reponame/subscribers',
      'subscription_url': 'https://api.github.com/repos/username/reponame/subscription',
      'commits_url': 'https://api.github.com/repos/username/reponame/commits{/sha}',
      'git_commits_url': 'https://api.github.com/repos/username/reponame/git/commits{/sha}',
      'comments_url': 'https://api.github.com/repos/username/reponame/comments{/number}',
      'issue_comment_url': 'https://api.github.com/repos/username/reponame/issues/comments{/number}',
      'contents_url': 'https://api.github.com/repos/username/reponame/contents/{+path}',
      'compare_url': 'https://api.github.com/repos/username/reponame/compare/{base}...{head}',
      'merges_url': 'https://api.github.com/repos/username/reponame/merges',
      'archive_url': 'https://api.github.com/repos/username/reponame/{archive_format}{/ref}',
      'downloads_url': 'https://api.github.com/repos/username/reponame/downloads',
      'issues_url': 'https://api.github.com/repos/username/reponame/issues{/number}',
      'pulls_url': 'https://api.github.com/repos/username/reponame/pulls{/number}',
      'milestones_url': 'https://api.github.com/repos/username/reponame/milestones{/number}',
      'notifications_url': 'https://api.github.com/repos/username/reponame/notifications{?since,all,participating}',
      'labels_url': 'https://api.github.com/repos/username/reponame/labels{/name}',
      'releases_url': 'https://api.github.com/repos/username/reponame/releases{/id}',
      'deployments_url': 'https://api.github.com/repos/username/reponame/deployments'
    },
    'score': 1
}

type GithubCommitResponseData = {
  'total_count': 33,
  'incomplete_results': true,
  'items': GithubCommitItemData[]
}

export type GithubConfig = z.infer<typeof GithubConfig>;
export const GithubConfig = z.object({
  committerUsername: z.string().min(1),
  /**
   * needed only if you want to access commits
   * made to private repositories
   */
  token: z.string().min(1).optional(),
  filters: z.array(z.object({
    on: z.string().min(1),
    regex: z.string().min(1),
  })).nonempty().optional(),
  domain: z.string().optional().default('api.github.com'),
  apiVersion: z.string().startsWith('2').optional().default('2022-11-28'),
  protocol: z.union([z.literal('http'), z.literal('https')]).optional().default('https'),
  // TODO should be extended from a base integration
  from: zIsoString.optional(),
  to: zIsoString.optional(),
  delay: z.number().min(0).optional(),
})

export class GithubIntegration extends IntegrationBase {
    static type = SourceType.Enum.github;

    private httpClient: AxiosInstance;

    private config: GithubConfig;

    private delayToUse: number;

    private dateRange: {
      from: string,
      to: string,
    }

    private bananaReporterConfig: BananaConfig;

    constructor(_rawConfig: unknown, bananaReporterConfig: BananaConfig) {
      super(_rawConfig, bananaReporterConfig)

      logger.debug('github integration')

      this.config = GithubConfig.parse(_rawConfig)

      logger.debug('github integration config', this.config)

      this.bananaReporterConfig = bananaReporterConfig

      this.delayToUse = this.config.delay ?? this.bananaReporterConfig.delay

      logger.debug(`github integration delayToUse ${this.delayToUse}`)

      this.dateRange = {
        from: this.config.from ?? this.bananaReporterConfig.from,
        to: this.config.to ?? this.bananaReporterConfig.to,
      }

      logger.debug('github integration dateRange', this.dateRange)

      const baseURL = `${this.config.protocol}://${this.config.domain}`

      logger.debug(`github integration baseURL ${baseURL}`)

      this.httpClient = axios.create({
        baseURL,
        headers: {
          Authorization: this.config.token ? `Bearer ${this.config.token}` : undefined,
          'X-GitHub-Api-Version': this.config.apiVersion,
          Accept: 'application/vnd.github+json',
        },
        timeout: 35_000,
      })
    }

    private async httpRequest<T>(path: string, config?: AxiosRequestConfig) {
      logger.debug(`github integration http request ${path}`, config)
      const res = await this.httpClient<T>(path, {
        ...config,
      })
      return res.data
    }

    async fetchData(): Promise<CommonBananaReporterObj[]> {
      let page = 1

      let commitList: GithubCommitItemData[] = []
      const commitShaList = new Set<string>()

      while (page > 0) {
        logger.debug(`github integration working on ${page}`)

        /* eslint-disable no-await-in-loop */
        const commits = await this.getUserCommits(this.config.committerUsername, {
          from: this.dateRange.from,
          to: this.dateRange.to,
          page,
        })
        // no more data, break loop
        if (commits.items.length === 0) {
          logger.debug('github integration no more commits to process')

          break
        }

        // eslint-disable-next-line unicorn/prefer-spread
        commitList = commitList.concat(
          // remove duplicate items
          commits.items.filter(c => !commitShaList.has(c.sha)),
        )
        for (const c of commits.items) {
          commitShaList.add(c.sha)
        }

        logger.debug(`github integration commitList ${commitList.length} (added ${commits.items.length} commits)`)

        page += 1

        await delay(this.delayToUse)
      }

      // format data to common obj
      for (const filter of this.config.filters || []) {
        const targetKey = filter.on

        commitList = commitList.filter(c => {
          const regex = new RegExp(filter.regex)
          const value = objectPath.get(c, targetKey)
          if (typeof value === 'undefined') {
            const errorMsg = `while filtering commit ${c.sha} unable to find the key ${targetKey} in the commit's object (available keys: ${Object.keys(c).join(',')})`
            logger.error(errorMsg)
            throw new Error(errorMsg)
          }

          return regex.test(value)
        })
      }

      const formattedData = commitList.map(e => this.toBananaReporterObj(e))

      return formattedData
    }

    private async getUserCommits(username: string, options: {
        from: string,
        to: string,
        page?: number,
    }) {
      const fromDate = dayjs(options.from)
      const toDate = dayjs(options.to)

      const from = fromDate.format('YYYY-MM-DD')
      const to = toDate.format('YYYY-MM-DD')

      logger.debug(`github integration getUserCommits from ${from} to ${to}`)

      const page = options.page ?? 1
      const url = '/search/commits'
      const commits = await this.httpRequest<GithubCommitResponseData>(url, {
        params: {
          q: `committer:${username} committer-date:${from}..${to}`,
          sort: 'asc',
          // eslint-disable-next-line camelcase
          per_page: 100,
          page,
        },
      })

      return commits
    }

    toBananaReporterObj(rawData: GithubCommitItemData): CommonBananaReporterObj {
      const projectId = rawData.repository.id
      const projectName = rawData.repository.name
      const description = `${rawData.commit.message} git:${rawData.sha.slice(0, 7)}`
      return {
        id: rawData.sha,
        date: rawData.commit.committer.date,
        username: rawData.commit.committer.name,
        description,
        projectId: String(projectId),
        projectName,
        type: GithubIntegration.type,
        __raw: this.bananaReporterConfig.includeRawObject ? rawData : undefined,
      }
    }
}
