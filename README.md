# 6street-cli

Plugin for 6Street Digital

[![Version](https://img.shields.io/npm/v/6street-cli.svg)](https://npmjs.com/package/@6street/6street-cli)
[![Known Vulnerabilities](https://snyk.io/test/github/6street/6street-cli/badge.svg)](https://snyk.io/test/github/6street/6street-cli)
[![Downloads/week](https://img.shields.io/npm/dw/6street-cli.svg)](https://npmjs.com/package/@6street/6street-cli)
[![License](https://img.shields.io/npm/l/6street-cli.svg)](https://github.com/6street/6street-cli/blob/main/package.json)

<!-- toc -->
* [6street-cli](#6street-cli)
<!-- tocstop -->

<!-- install -->
<!-- installstop -->

<!-- usage -->
```sh-session
$ npm install -g @6street/6street-cli
$ sfdx COMMAND
running command...
$ sfdx (--version)
@6street/6street-cli/0.0.4 win32-x64 node-v16.14.2
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->

<!-- commands -->
* [`sfdx 6st:b2b:org [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-6stb2borg--n-string--f--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx 6st:manifest [-f] [-o <string>] [-s <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-6stmanifest--f--o-string--s-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx 6st:b2b:org [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

print a greeting and your org IDs

```
USAGE
  $ sfdx 6st:b2b:org [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel
    trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -f, --force                                                                       example boolean flag
  -n, --name=<value>                                                                name to print
  -u, --targetusername=<value>                                                      username or alias for the target
                                                                                    org; overrides default target org
  -v, --targetdevhubusername=<value>                                                username or alias for the dev hub
                                                                                    org; overrides default dev hub org
  --apiversion=<value>                                                              override the api version used for
                                                                                    api requests made by this command
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

DESCRIPTION
  print a greeting and your org IDs

EXAMPLES
  $ sfdx 6st:b2b:org --targetusername myOrg@example.com --targetdevhubusername devhub@org.com

  $ sfdx 6st:b2b:org --name myname --targetusername myOrg@example.com
```

_See code: [src/commands/6st/b2b/org.ts](https://github.com/6street/6street-cli/blob/v0.0.4/src/commands/6st/b2b/org.ts)_

## `sfdx 6st:manifest [-f] [-o <string>] [-s <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

generates a package.xml manifest based on git changes made in a branch.

```
USAGE
  $ sfdx 6st:manifest [-f] [-o <string>] [-s <string>] [--json] [--loglevel
    trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -f, --force                                                                       overwrites an existing package.xml
                                                                                    in the manifest folder if it exists
  -o, --output=<value>                                                              [default: ./manifest] Selected
                                                                                    output folder for the manifest file
  -s, --source=<value>                                                              [default: develop] Branch or commit
                                                                                    we're comparing to for the diff
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

DESCRIPTION
  generates a package.xml manifest based on git changes made in a branch.

EXAMPLES
  $  sfdx 6st:manifest
```

_See code: [src/commands/6st/manifest.ts](https://github.com/6street/6street-cli/blob/v0.0.4/src/commands/6st/manifest.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
