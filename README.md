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
* [`bananareporter hello PERSON`](#bananareporter-hello-person)
* [`bananareporter hello world`](#bananareporter-hello-world)
* [`bananareporter help [COMMANDS]`](#bananareporter-help-commands)
* [`bananareporter plugins`](#bananareporter-plugins)
* [`bananareporter plugins:install PLUGIN...`](#bananareporter-pluginsinstall-plugin)
* [`bananareporter plugins:inspect PLUGIN...`](#bananareporter-pluginsinspect-plugin)
* [`bananareporter plugins:install PLUGIN...`](#bananareporter-pluginsinstall-plugin-1)
* [`bananareporter plugins:link PLUGIN`](#bananareporter-pluginslink-plugin)
* [`bananareporter plugins:uninstall PLUGIN...`](#bananareporter-pluginsuninstall-plugin)
* [`bananareporter plugins:uninstall PLUGIN...`](#bananareporter-pluginsuninstall-plugin-1)
* [`bananareporter plugins:uninstall PLUGIN...`](#bananareporter-pluginsuninstall-plugin-2)
* [`bananareporter plugins update`](#bananareporter-plugins-update)

## `bananareporter hello PERSON`

Say hello

```
USAGE
  $ bananareporter hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/nya1/bananareporter/blob/v0.0.0/dist/commands/hello/index.ts)_

## `bananareporter hello world`

Say hello world

```
USAGE
  $ bananareporter hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ bananareporter hello world
  hello world! (./src/commands/hello/world.ts)
```

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

## `bananareporter plugins`

List installed plugins.

```
USAGE
  $ bananareporter plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ bananareporter plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.3.2/src/commands/plugins/index.ts)_

## `bananareporter plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ bananareporter plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ bananareporter plugins add

EXAMPLES
  $ bananareporter plugins:install myplugin 

  $ bananareporter plugins:install https://github.com/someuser/someplugin

  $ bananareporter plugins:install someuser/someplugin
```

## `bananareporter plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ bananareporter plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ bananareporter plugins:inspect myplugin
```

## `bananareporter plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ bananareporter plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ bananareporter plugins add

EXAMPLES
  $ bananareporter plugins:install myplugin 

  $ bananareporter plugins:install https://github.com/someuser/someplugin

  $ bananareporter plugins:install someuser/someplugin
```

## `bananareporter plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ bananareporter plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ bananareporter plugins:link myplugin
```

## `bananareporter plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ bananareporter plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bananareporter plugins unlink
  $ bananareporter plugins remove
```

## `bananareporter plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ bananareporter plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bananareporter plugins unlink
  $ bananareporter plugins remove
```

## `bananareporter plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ bananareporter plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bananareporter plugins unlink
  $ bananareporter plugins remove
```

## `bananareporter plugins update`

Update installed plugins.

```
USAGE
  $ bananareporter plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
