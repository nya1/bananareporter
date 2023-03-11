
# GitLab

`type: gitlab`

To access GitLab API a personal access token is needed, data fetched will be commits pushed, any merge commit will be automatically skipped.

- [Create a personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#create-a-personal-access-token)
  - scopes required: `api`, `read_user`, `read_api`

## Configuration

### Example

```yaml
# banana reporter configuration file

sources:
  - type: 'gitlab'
    committerUsername: johndoe
    token: glpat-tokentest
    # filter only commits made to repositories
    # with "spacex" and "nasa" in the repository full name 
    filters:
      - on: '$project.path_with_namespace'
        regex: '(spacex|nasa)'
```

### Options

- `committerUsername`
    - type: string
    - mandatory: yes
    - description: username used for commits
- `token`
    - type: string
    - mandatory: yes
    - description: gitlab pesonal access token (scopes: `api`, `read_user`, `read_api`)
- `from`
    - type: string ISO8601 date
    - mandatory: no
    - default: from CLI argument `--from`
    - description: will override the global CLI option for this source
- `to`
    - type: string ISO8601 date
    - mandatory: no
    - default: from CLI argument `--to`
    - description: will override the global CLI option for this source
- `delay`
    - type: number
    - mandatory: no
    - default: from CLI argument `--delay`
    - description: will override the global CLI option for this source
- `domain`
    - type: string
    - mandatory: no
    - default: `gitlab.com`
    - description: domain to be used for API calls
- `apiVersion`
    - type: string
    - mandatory: no
    - default: `v4`
    - description: api version to use
- `protocol`
    - type: string
    - mandatory: no
    - default: `https`
    - description: http or https
- `apiBasePath`
    - type: string
    - mandatory: no
    - default: `api`
    - description: base path for the API
- `filters`
    - type: array of objects
    - mandatory: no
    - description: allows to filter based on fetched data using regex, with `on` you need to provide the key that you want to filter for (dot notation support) and `regex` the regex to test for
    - example:
      - ```yaml
            filters:
            - on: '$project.path_with_namespace'
                regex: '(acmecorp|spacex)'
        ```
- `userId`
    - type: string
    - mandatory: no
    - description: gitlab internal user ID, if not provided it will be automatically loaded from the provided `committerUsername`

