Banana Reporter
=================

Create a report in CSV, JSON/L from multiple sources (e.g. GitLab, GitHub, todo.txt etc.)

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/bananareporter.svg)](https://npmjs.org/package/bananareporter)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/bananareporter.svg)](https://npmjs.org/package/bananareporter)
[![License](https://img.shields.io/npm/l/bananareporter.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

# Features

- **Easy to use**: provide a `--from` and `--to` date range and a config file, all data will be fetched automatically
- **Multiple output formats**: output file can be a JSON, JSONL or CSV (via `--format`) _more coming soon_
- **Configurable**: data to be imported can be filtered using the configuration file and each option can be overridden per source
- **Sources Supported**: GitLab, GitHub and todo.txt files, _more coming soon_

<!-- toc -->
* [Features](#features)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g bananareporter
$ bananareporter COMMAND
running command...
$ bananareporter (--version)
bananareporter/0.0.0 linux-x64 node-v16.19.0
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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.5/src/commands/help.ts)_

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

_See code: [dist/commands/run/index.ts](https://github.com/nya1/bananareporter/blob/v0.0.0/dist/commands/run/index.ts)_
<!-- commandsstop -->
