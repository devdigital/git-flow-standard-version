# git-flow-standard-version

Examples of using [conventional commits](https://conventionalcommits.org/) and [standard-version](https://github.com/conventional-changelog/standard-version) with [Git flow](http://nvie.com/posts/a-successful-git-branching-model/).

Branches:

* `develop` (long lived) - latest development work, deploys to a dev environment
* `release/*` (short lived) - release candidate, bug fixes for a release, deploys to a test environment
* `master` (long lived) - last release, deploys to a production environment
* `hotfix/*` (short lived) - urgent fixes to production

# Getting started

* Run `git flow init` and configure all of the default options
* When using `standard-version` for versioning, you need to add a `package.json` file to the root of your Git repository
* You can install [yarn](https://yarnpkg.com/en/) and use `yarn init`
* Add `standard-version` as a development dependency with `yarn add standard-version -D`
* Add a `release` script in your package.json:

```
"scripts": {
    "release": "standard-version"
}
```

# Features, fixes, docs, performance improvements, refactoring, etc:

* Create a branch off of `develop`
* If you wish to maintain pull requests so that changes are reviewed and accepted to `develop`, then you can choose not use the `git flow` commands, and instead just push your `feature/...` or `bugfix/...` branches to a remote equivalent and create a pull request to `develop`
* Branches can actually be called anything except `develop`, `master`, `release/*`, or `hotfix/*`
* Commit messages should follow conventional commits, e.g. `feat: ...` for features, and `fix: ...` for fixes
* Other work which shouldn't affect the version number should also follow a standard commit message structure, e.g. `docs: ...` or `refactor: ...`

# Starting a release

* Do not choose a version number yourself for your `release/*` branch, instead get the next version number based from your conventional commits. 
* See [an example script](https://github.com/devdigital/git-flow-standard-version/blob/master/get-next-version.js) that you can add to your `package.json`.
* With the version number calculated for you, use the `git flow release start <version>` to start a release
* This will create a `release/<version>` branch
* Within this branch, you should then run `yarn run release` to increment the version number within `package.json` automatically to match the release branch name, as well as updating the `CHANGELOG.md` file automatically, and create a tag with the version number

# Bugfixing a release

* Your `release/<version>` branch should deploy to a test environment
* Based on testing feedback, you may need to fix a bug for that release, whilst the `develop` branch has continued on into development for the next release
* To do this you can create a branch off of your `release/<version>` branch
* If you wish to maintain pull requests for release bug fixes, then you can push your e.g. `bugfix/...` to a remote equivalent and create a pull request into `release/<version>`
* You should not run `standard-version` (`yarn run release`) after merging a release bugfix, as you want the release version to stay the same (the release branch name and version should be immutable)
* Any release bug fixes will be included in the version calculation for your *next* release, as well as being included in the *next* `CHANGELOG.md`

# Finishing a release

* Once happy, you can merge your `release/<version>` branch into `master` and any changes back into `develop` with `git flow release finish <version>`
* This also creates a tag with the version number (TODO: is this an issue with standard-version and git flow both creating a release tag?)
* The release branch is also automatically deleted
* Your production build should then begin from the updated `master` branch and your latest release should now be live

# Creating a hotfix

* If you need to fix a critical bug in production, then you need to create a hotfix
* These are branches off of `master` and can be created with `git flow hotfix start <version>` where `<version>` should be a a manual calculation - as a hotfix is a *fix*, you can just increment the patch version number from the last completed release, e.g. if master is release 1.0.1, then create a `hotfix/1.0.2` branch

# Finishing the hotfix

* Once you have made the hotfix, you should then merge it into `master` and back into the `develop` branch using `git flow hotfix finish <version>`
* This does mean you lose the ability to do pull requests on hotfixes, and it also means you need push permission to `master` to be possible. TODO: are there ways around this?
* You should not run `standard-version` when your hotfix is merged into master, as the fix will be included in the *next* release version calculation and in the *next* `CHANGELOG.md`
* This does mean that hotfix tags do not contain a matching `package.json` or `CHANGELOG.md` version, but if you were to use `standard-version` on the `master` branch, then it would use features and fixes across all branches (including `develop`) to calculate the next version, and that will not match your `hotfix/<version>` branch. TODO: is there a better approach to this?
