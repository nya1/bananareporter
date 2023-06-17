
# Git CLI

`type: git-cli`

The Git CLI source will load the commits from a local repository.
Project name will be the directory name.


## Configuration

### Example

```yaml
# banana reporter configuration file

sources:
  - type: 'git-cli'
    # filter by author username
    authorUsername: johndoe
    # repository path
    path: '/home/user/myproject'
```

### Options

- `authorUsername`
    - type: string
    - mandatory: yes
    - description: username used for commits
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
