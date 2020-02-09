From: https://raw.githubusercontent.com/guigrpa/oao/master/README.md

## Usage

To see all CLI options, run `oao --help`:

```
Usage: oao [options] [command]

Options:

  -V, --version  output the version number
  -h, --help     output usage information

Commands:

  status [options]                               Show an overview of the monorepo status
  bootstrap [options]                            Install external dependencies and create internal links
  clean [options]                                Delete all node_modules directories from sub-packages and the root package
  add [options] <sub-package> <packages...>      Add dependencies to a sub-package
  remove [options] <sub-package> <packages...>   Remove dependencies from a sub-package
  upgrade [options] <sub-package> [packages...]  Upgrade some/all dependencies of a package
  outdated [options]                             Check for outdated dependencies
  prepublish [options]                           Prepare for a release: validate versions, copy READMEs and package.json attrs
  publish [options]                              Publish updated sub-packages
  reset-all-versions [options] <version>         Reset all versions (incl. monorepo package) to the specified one
  all [options] <command>                        Run a given command on all sub-packages
  run-script [options] <command>                 Run a given script on all sub-packages
```

You can also get help from particular commands, which may have additional options, e.g. `oao publish --help`:

```
Usage: publish [options]

Publish updated sub-packages

Options:

-s --src <glob>                                           glob pattern for sub-package paths [packages/*] (default: "packages/*")
-i --ignore-src <glob>                                    glob pattern for sub-package paths that should be ignored
-l --link <regex>                                         regex pattern for dependencies that should be linked, not installed
--single                                                  no subpackages, just the root one
--relative-time                                           shorten log dates
--no-master                                               allow publishing from a non-master branch
--no-check-uncommitted                                    skip uncommitted check
--no-check-unpulled                                       skip unpulled check
--no-checks                                               skip all pre-publish checks
--no-bump                                                 do not increment version numbers (also disables git commit)
--no-confirm                                              do not ask for confirmation before publishing
--no-git-commit                                           skip the commit-tag-push step before publishing
--no-npm-publish                                          skip the npm publish step
--new-version <version>                                   use this version for publishing, instead of asking
--increment-version-by <major|minor|patch|rc|beta|alpha>  increment version by this, instead of asking
--publish-tag <tag>                                       publish with a custom tag (instead of `latest`)
--changelog-path <path>                                   changelog path [CHANGELOG.md] (default: "CHANGELOG.md")
--no-changelog                                            skip changelog updates
-h, --help                                                output usage information
```

## Main commands

In recent versions of npm, remember that you can run oao commands conveniently with the `npx` tool:

```sh
$ npx oao bootstrap
$ npx oao add my-subpackage my-new-dependency --dev
$ npx oao publish
```

This uses the local oao package inside your monorepo.

### `oao status`

Provides lots of information on the git repo (current branch, last tag, uncommitted/unpulled changes) and subpackage status (version, private flag, changes since last tag, dependencies).

![oao status](https://raw.githubusercontent.com/guigrpa/oao/master/docs/status.png)

### `oao bootstrap`

Installs all sub-package dependencies using **yarn**. External dependencies are installed normally, whereas those belonging to the monorepo itself (and custom links specified with the `--link` option) are `yarn link`ed. Note that dependencies may end up in different places depending on whether you use [yarn workspaces](https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/) or not (see above).

Development-only dependencies can be skipped by enabling the `--production` option, or setting the `NODE_ENV` environment variable to `production`. Other flags that are passed through to `yarn install` include `--frozen-lockfile`, `--pure-lockfile` and `--no-lockfile`.

### `oao clean`

Removes `node_modules` directories from all sub-packages, as well as from the root package.

### `oao add <sub-package> <deps...>`

Adds one or several dependencies to a sub-package. For external dependencies, it passes through [`yarn add`'s flags](https://yarnpkg.com/en/docs/cli/add). Internal dependencies are linked. Examples:

```sh
$ oao add subpackage-1 jest --dev
$ oao add subpackage-2 react subpackage-1 --exact
```

### `oao remove <sub-package> <deps...>`

Removes one or several dependencies from a sub-package. Examples:

```sh
$ oao remove subpackage-1 jest
$ oao remove subpackage-2 react subpackage-1
```

### `oao remove-all <deps...>`

Remove one or deveral dependencies from the monorepo (root and subpackages). It automatically runs `oao bootstrap` after upgrading the `package.json` files as needed. Examples:

```sh
$ oao remove-all leftpad
$ oao remove-all leftpad rightpad centerpad
```

### `oao upgrade <sub-package> [deps...]`

Upgrade one/several/all dependencies of a sub-package. For external dependencies, it will download the upgraded dependency using yarn. For internal dependencies, it will just update the sub-package's `package.json` file. Examples:

```sh
$ oao upgrade subpackage-1 jest@18.0.1
$ oao upgrade subpackage-2 react subpackage-1@3.1.2
$ oao upgrade subpackage-3
```

### `oao bump <deps...>`

Upgrade one or several dependencies to either their latest version or to a specific version range. In case of internal dependencies, if no version range is given the current version will be used. It automatically runs `oao bootstrap` after upgrading the `package.json` files as needed. Examples:

```sh
$ oao bump moment
$ oao bump react@^16 react-dom@^16
$ oao bump subpackage-2
```

### `oao outdated`

Runs `yarn outdated` on all sub-packages, as well as the root package.

### `oao prepublish`

Carries out a number of chores that are needed before publishing:

- Checks that all version numbers are valid and <= the master version.
- Copies `<root>/README.md` to the _main_ sub-package (the one having the same name as the monorepo).
- Copies `<root>/README-LINK.md` to all other sub-packages.
- Copies several fields from the root `package.json` to all other `package.json` files: `description`, `keywords`, `author`, `license`, `homepage`, `bugs`, `repository`.

### `oao publish`

Carries out a number of steps:

- Asks the user for confirmation that it has _built_ all sub-packages for publishing (using something like `yarn build`).
- Performs a number of checks:
  - The current branch should be `master`.
  - No uncommitted changes should remain in the working directory.
  - No unpulled changes should remain.
- Determines which sub-packages need publishing (those which have changed with respect to the last tagged version).
- Asks the user for an incremented master version (major, minor, patch or pre-release major), that will be used for the root package as well as all updated sub-packages.
- Asks the user for final confirmation before publishing.
- Updates versions in `package.json` files, commits the updates, adds a tag and pushes all the changes.
- Publishes updated sub-packages.

There are lots of custom options for `oao publish`. Chances are, you can disable each one of the previous steps by means of one of those options. Check them all with `oao publish --help`.

**Note: There is a problem when running `oao publish` as a script run with `yarn`. As a workaround, either run `oao publish` manually from the command line, or put it in a script and run it with `npm`, not `yarn`.**

### `oao all <command>`

Executes the specified command on all sub-packages (private ones included), with the sub-package's root as _current working directory_. Examples:

```sh
$ oao all ls
$ oao all "ls -al"
$ oao all "yarn run compile"
$ oao all --tree "yarn run compile"
```

By default, `oao all` runs sequentially. Sometimes you must run commands in parallel, for example when you want to compile all sub-packages with a _watch_ option:

```sh
$ oao all "yarn run compileWatch" --parallel
```

**Note: some terminals may have problems with parallel logs (based on [terminal-kit](https://github.com/cronvel/terminal-kit)). If you experience issues, use the `--no-parallel-logs` flag. If you're using the default terminal or Hyper on OS X or Windows, you should be fine.**

Use `--tree` if you want to follow the inverse dependency tree (starting from the tree leaves).

You can also pass extra arguments to the command separating them with a `--`: `oao all ls -- -al` is equivalent to `oao all 'ls -al'`. This can be useful for adding extra commands to scripts in `package.json`.

### `oao run-script <script>`

Similar to `oao all <command>`, it executes the specified (package) script on all sub-packages. Missing scripts will be skipped. Examples:

```sh
$ oao run-script start
$ oao run-script start --parallel
$ oao run-script start --tree
```

By default, `oao run-script` runs sequentially. Use `--parallel` to run the scripts in parallel, and `--tree` if you want to follow the inverse dependency tree (starting from the tree leaves).

You can also run all scripts matching a given glob pattern: `oao run-script test:*`.