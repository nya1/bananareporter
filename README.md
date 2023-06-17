
<p align="center">
<img src="docs/assets/banana-reporter-logo.png" alt="Banana Reporter Logo" height="70px"/>
</p>
<h1 align="center">Banana Reporter</h1>
<p align="center">Create a report in CSV, JSON and JSONL from multiple sources (GitLab, GitHub, Git local repository and todo.txt)</p>

<p align="center">
  <a href="https://oclif.io"><img src="https://img.shields.io/badge/cli-oclif-brightgreen.svg" alt="oclif"/></a>
  <a href="https://npmjs.org/package/bananareporter"><img src="https://img.shields.io/npm/v/bananareporter.svg" alt="Version"/></a>
  <a href="https://github.com/nya1/bananareporter/actions/workflows/test.yml"><img src="https://github.com/nya1/bananareporter/actions/workflows/test.yml/badge.svg" alt="Github"/></a>
  <a href="https://npmjs.org/package/bananareporter"><img src="https://img.shields.io/npm/dt/bananareporter.svg" alt="Total Downloads"/></a>
  <a href="https://github.com/nya1/bananareporter/blob/main/package.json"><img src="https://img.shields.io/npm/l/bananareporter.svg" alt="License"/></a>
</p>

<!-- toc -->
* [Features](#features)
* [Quickstart](#quickstart)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Features

- **Easy to use**: provide a `--from` and `--to` date range and a config file, all data will be fetched automatically
- **Multiple output formats**: output file can be a JSON, JSONL or CSV (via `--format`) _more coming soon_
- **Configurable**: data to be imported can be filtered using the configuration file and each option can be overridden per source
- **Sources Supported**
  - [GitLab](./docs/sources/gitlab.md): commits
  - [GitHub](./docs/sources/github.md): commits
  - [Git CLI (local repository)](./docs/sources/git-clit.md): commits
  - todo.txt: tasks
  - **[Request a new source](https://github.com/nya1/bananareporter/issues/new?assignees=&labels=enhancement&template=new-source-request.md&title=)**

## Use cases

- create a PDF work report based on commits and tasks
- get insights on your activity 

# Quickstart

0. Install banana reporter CLI `npm i -g bananareporter`

1. Create a config file `bananareporter.yaml` with the sources that you want to fetch

```yaml
sources:
  - type: 'gitlab'
    committerUsername: usernameOnGitlab
    token: glpat-personalaccesstoken
    # filters:
    #   - on: '$project.path_with_namespace'
    #     regex: '(namespace|anotherone)'
  - type: 'github'
    committerUsername: usernameOnGithub
    # optional, needed for commits on private repositories
    token: personalaccesstoken
    # filters:
    #   - on: 'repository.full_name'
    #     regex: '(namespace|anotherone)'
  # - type: 'todo.txt'
  #   file: './todo.txt'
```

2. Run the reporter with a date range (ISO8601 date)

```sh
bananareporter --from 2023-01-01 --to 2023-03-01 -c bananareporter.yaml
```

In the current directory you will find the output as `bananareporter_$FROM__$TO.json` (can be changed with `--out`)

Example of output (json) with gitlab and github sources:

```json
[
  {
    "id": "c12ba180bfecf45fcdcc40d6104d1f1b7ad409dc",
    "date": "2023-01-13T07:51:21.730Z",
    "username": "johndoe",
    "description": "chore: update changelog and swagger branch:work git:aa33b04",
    "projectId": "3318214",
    "projectName": "awesome-frontend",
    "type": "gitlab"
  },
  {
    "id": "6e1b66a1dea89e957d8c44943f942be4874c0641",
    "date": "2023-01-14T10:50:10.230Z",
    "username": "johndoe",
    "description": "refactor: compare date function branch:work git:ia1f241",
    "projectId": "928544",
    "projectName": "awesome-backend",
    "type": "github"
  }
]
```


# Usage
<!-- usage -->
```sh-session
$ npm install -g bananareporter
$ bananareporter COMMAND
running command...
$ bananareporter (--version)
bananareporter/0.3.0 linux-x64 node-v16.19.0
$ bananareporter --help [COMMAND]
USAGE
  $ bananareporter COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bananareporter help [COMMANDS]`](#bananareporter-help-commands)
* [`bananareporter run`](#bananareporter-run)

## `bananareporter help [COMMANDS]`

Display help for bananareporter.

```
USAGE
  $ bananareporter help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for bananareporter.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.8/src/commands/help.ts)_

## `bananareporter run`

Run report

```
USAGE
  $ bananareporter run -o <value> --format json|jsonl|csv [-c <value>] [--to <value> --from <value>]
    [--delay <value>] [--include-raw-object]

FLAGS
  -c, --config=<value>  config file location, by default ~/.config/bananareporter/config.yaml
  -o, --out=<value>     (required) [default: ./bananareporter.json] file path to save the output
  --delay=<value>       [default: 300] global delay in millisecons between http requests
  --format=<option>     (required) [default: json] output file format
                        <options: json|jsonl|csv>
  --from=2023-03-01     from date (ISO8601)
  --include-raw-object  include raw object in json/jsonl reporter output
  --to=2023-03-31       to date (ISO8601)

DESCRIPTION
  Run report

EXAMPLES
  $ banana-reporter run --from 2023-01-01 --to 2023-01-31
  report with 138 entries saved to ./bananareporter.json
```

_See code: [dist/commands/run/index.ts](https://github.com/nya1/bananareporter/blob/v0.3.0/dist/commands/run/index.ts)_
<!-- commandsstop -->
