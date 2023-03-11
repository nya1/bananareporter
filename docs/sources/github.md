
# GitHub

`type: github`

To access GitHub API a personal access token is needed, data fetched will be commits pushed, any merge commit will be automatically skipped.

- [Create a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
  - scopes required: `repo`

## Configuration

### Example

```yaml
# banana reporter configuration file

sources:
  - type: 'github'
    committerUsername: johndoe
    token: ghp_tokentest
    # filter only commits made to repositories
    # with "spacex" and "nasa" in the repository full name 
    filters:
      - on: 'repository.full_name'
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
    - description: github pesonal access token (scope: `repo`)
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
    - default: `api.github.com`
    - description: domain to be used for API calls
- `apiVersion`
    - type: string
    - mandatory: no
    - default: `2022-11-28`
    - description: api version to use
- `protocol`
    - type: string
    - mandatory: no
    - default: `https`
    - description: http or https
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
