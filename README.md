# git-flow-standard-version

Examples of using [conventional commits](https://conventionalcommits.org/) and [standard-version](https://github.com/conventional-changelog/standard-version) with [Git flow](http://nvie.com/posts/a-successful-git-branching-model/).

The Git flow branches that we are interested in are the following branches :

* `develop` (long lived) - latest development work, deploys to a dev environment
* `release/*` (short lived) - release candidate, bug fixes for a release, deploys to a test environment
* `master` (long lived) - last release, deploys to a production environment
* `hotfix/*` (short lived) - urgent fixes to production

# standard-version behaviour

`standard-version` uses the format of your commit messages to determine the next [semver](http://semver.org/) version number of your release in the format *major.minor.patch*.

If you have only applied `fix: ...` commits, then it will bump your *patch* number, if you have applied a `feat: ...` commit, then it will bump your *minor* version, and if you have applied a `BREAKING CHANGE` commit, then it will bump your *major* number. See [conventional commits](https://conventionalcommits.org/) for more details.

This means that if your starting version number is `1.0.0` and you apply ten `fix: ...` commits, then your next version number will be `1.0.1`, not `1.0.10`. Likewise, if you applied ten `fix: ...` commits and ten `feat: ...` commits, then your next version number will be `1.1.0`.

# Getting started

* Run `git flow init` and configure all of the default options
* When using `standard-version` for versioning, you need to add a `package.json` file to the root of your Git repository
* You can install [yarn](https://yarnpkg.com/en/) and use `yarn init`
* Add `standard-version` as a development dependency with `yarn add standard-version -D`
* Add a `release` script in your package.json:

```
"scripts": {
	"release": "standard-version"
},
"standard-version": {
	"skip": {
		"tag": true
	}
}
```

> Note as we will be leaving release tags to `git flow`, we disable them in `standard-version`. `standard-version` will take care of bumping our `package.json` file with the version number, and updating the `CHANGELOG.md` file with changes in each release.

# Features, fixes, docs, performance improvements, refactoring, etc:

* Create a branch off of `develop`
* If you wish to maintain pull requests so that changes are reviewed and accepted to `develop`, then you can choose not use the `git flow` commands for feature branches, and instead just push your `feature/...` or `bugfix/...` branches to a remote equivalent and create a pull request to `develop`
* Branches can actually be called anything except `develop`, `master`, `release/*`, or `hotfix/*`
* Commit messages should follow conventional commits, e.g. `feat: ...` for features, and `fix: ...` for fixes
* Other work which shouldn't affect the version number should also follow a standard commit message structure, e.g. `docs: ...` or `refactor: ...`

# Starting a release

* Do not choose a version number yourself for your `release/*` branch, instead get the next version number based from your conventional commits.
* See [an example script](https://github.com/devdigital/git-flow-standard-version/blob/master/get-next-version.js) that you can add to your `package.json`.
* With the version number calculated for you, use the `git flow release start <version>` to start a release
* This will create a `release/<version>` branch
* Within this branch, you should then run `yarn run release` to increment the version number within `package.json` automatically to match the release branch name, as well as updating the `CHANGELOG.md` file automatically

# Bugfixing a release

* Your `release/<version>` branch should deploy to a test environment
* Based on testing feedback, you may need to fix a bug for that release, whilst the `develop` branch has continued on into development for the next release
* To do this you can create a branch off of your `release/<version>` branch
* If you wish to maintain pull requests for release bug fixes, then you can push your e.g. `bugfix/...` branch to a remote equivalent and create a pull request into `release/<version>`
* **You should not** run `standard-version` (`yarn run release`) after merging a release bugfix, as you want the release version to stay the same (the release branch name and version should be immutable)
* Any release bug fixes will be included in the version calculation for your *next* release, as well as being included in the *next* `CHANGELOG.md`

# Finishing a release

* Once happy, you can merge your `release/<version>` branch into `master` and any changes back into `develop` with `git flow release finish -n <version>`
* Both standard-version and git flow creates tags by default, but adding `-n` to git flow prevents a duplicate tag from being created.
* The release branch is also automatically deleted
* Your production build should then begin from the updated `master` branch and your latest release is now ready to deploy from `master`

# Creating a hotfix

* If you need to fix a critical bug in production, then you need to create a hotfix
* These are branches off of `master` and can be created with `git flow hotfix start <version>` - as a hotfix is a *fix*, you can just increment the patch version number from the last completed release, e.g. if `master` is release 1.0.1, then create a `hotfix/1.0.2` branch
* You must then update the `package.json` file to in the hotfix branch to match the hotfix branch version number (otherwise the `develop` branch will not have its version updated when you finish the hotfix, and the tagging will fail on the next release start)
* **You should not** run `standard-version` as you do not wish to update the `CHANGELOG.md` - the hotfix will be included in the next release `CHANGELOG.md`

# Finishing the hotfix

* Once you have made the hotfix, you should then merge it into `master` and back into the `develop` branch using `git flow hotfix finish <version>`
* This does mean *you lose the ability to do pull requests on hotfixes*, and it also means you need push permission to `master` to be possible. TODO: are there ways around this?
* **You should not** run `standard-version` when your hotfix is merged into master, as the fix will be included in the *next* release version calculation and in the *next* `CHANGELOG.md`
