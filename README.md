# Myapp

[![Linter: flake8][pylinter-image]](https://flake8.pycqa.org)
[![Linter: eslint][jslinter-image]](https://eslint.org/)
[![Linter: stylelint][csslinter-image]](https://stylelint.io/)
[![Imports: isort][isort-image]](https://pycqa.github.io/isort/)
[![Type hint: mypy][type-hint-image]](https://mypy.readthedocs.io)

![python versions][py-image]
![django versions][django-image]
[![node versions][node-image]](https://nodejs.org/)
[![react versions][react-image]](https://react.dev/)

[![pipeline status][pipeline-image]][latest-commit-url]
[![coverage][coverage-image]][latest-commit-url]
[![license][license-image]](./LICENSE)

[pylinter-image]: https://img.shields.io/badge/linter-flake8-blue?style=flat&labelColor=orange&logo=python
[jslinter-image]: https://img.shields.io/badge/linter-eslint-blue?style=flat&logo=eslint&labelColor=navy&logoColor=yellow
[csslinter-image]: https://img.shields.io/badge/linter-stylelint-blue?style=flat&logo=stylelint&labelColor=navy&logoColor=yellow
[isort-image]: https://img.shields.io/badge/imports-isort-blue?style=flat&labelColor=orange&logo=python
[type-hint-image]: https://img.shields.io/badge/type_hint-mypy-blue?style=flat&labelColor=orange&logo=python
[py-image]: https://img.shields.io/badge/python-3.14-blue?style=flat&labelColor=blueviolet&logo=python&logoColor=white
[django-image]: https://img.shields.io/badge/django-6.0-blue?style=flat&labelColor=blueviolet&logo=django&logoColor=white
[node-image]: https://img.shields.io/badge/Node%20js-24-blue?style=flat&logo=nodedotjs&logoColor=white
[react-image]: https://img.shields.io/badge/React-19-blue?style=flat&logo=reactjs
[latest-commit-url]: https://gitlab.com/systracorp/hq/boilerplates/django-react-boilerplate/-/commits/master
[pipeline-image]: https://gitlab.com/systracorp/hq/boilerplates/django-react-boilerplate/badges/master/pipeline.svg?ignore_skipped=true
[coverage-image]: https://gitlab.com/systracorp/hq/boilerplates/django-react-boilerplate/badges/master/coverage.svg
[license-image]: https://img.shields.io/badge/license-MIT-darkgreen?style=flat&labelColor=gray


This guide will help you to quickly install and run the Myapp application locally for development purposes.

[//]: # (Start of Boilerplate doc)

## Boilerplate

To use this boilerplate:
- clone it in some directory
- use the `exit` script with your application name and optionally your gitlab url

Run the `exit` script to create a new application detached from this boilerplate.

```shell
./exit [name_of_the_app]
```

You can now link the directory to a distant Git repository (on Gitlab, GitHub…)

Don’t forget to:

- Edit the `LICENSE` file and the badge in the readme
- Edit the `pyproject.toml` file (description, author, private, URLs, version…)
- Edit the `package.json` file (description, author, private, URLs, version…)
- Edit the `README.md` file (badges, description, environment variables…)
- Change the static assets files and `back/favicon.ico` file
- Check that the version has been set to `0.1.0` in `pyproject.toml` and `package.json`

This project regroups all the common code you may need to start a new Django + React project with DSF (Digital Software Factory) UX charter.

## What's inside?

- GraphQL with Strawberry
- OIDC Authentication
- Unit testing with Pytest
- All the common interfaces (header, left navigation drawer, notifications, snackbar, ...).
- A login page
- A home page with blog post management
- A map page with a left expansible drawer and classic use of [**Mapbox GL**](https://docs.mapbox.com/mapbox-gl-js/api/)
- A router
- A store
- A translation module
- Examples of components (time and date pickers, data tables, radio buttons, file upload interface...)
- Icons with [**MaterialIcons**](https://mui.com/material-ui/material-icons/#search-material-icons)
- Unit testing with [**Vitest**](https://vitest.dev/)

[//]: # (End of Boilerplate doc)

Django
======

## Setup

```shell
# create a virtual env with python version 3.14 or more
uv venv -p 3.14
# install all dependencies
uv sync
# adjust some env variables (`export DJANGO_[…]=[…]`), see `back/config/settings.py`.
source .env
# setup database schema and configuration
./back/manage.py migrate
```

## Run server

Within the python virtual env:
```shell
# serve with hot reload at localhost:8000
poe run_dev
```

You can also change the port by setting the `DJANGO_PORT` env var.

Then go to [http://localhost:8000/].

## Run the task manager

Within the python virtual env:
```shell
poe tasks
```

## Environment variables

The following environment variables are available with their default:

| Name                         | Default value                           | Comment                        |
| ---                          | ---                                     | ---                            |
| `DJANGO_DEBUG`               | `False`                                 | `0`/`1`/`True`/`False`         |
| `DJANGO_VITE_DEV_MODE`       | `True` if `DJANGO_DEBUG` else `False`   | `0`/`1`/`True`/`False`         |
| `DJANGO_LOG_LEVEL`           | `INFO` if `DJANGO_DEBUG` else `WARNING` |                                |
| `DJANGO_RUNSERVER_LOG_LEVEL` | `DEBUG` if `DJANGO_DEBUG` else `INFO`   | only used with `runserver`     |
| `DJANGO_NO_HTTPS`            | `False`                                 | `0`/`1`/`True`/`False`         |
| `DJANGO_SECRET_KEY`          | *default value for dev only*            | change this                    |
| `DJANGO_DB_TYPE`             | `postgresql`                            | `postgresql`/`sqlite`          |
| `DJANGO_DB_HOST`             | `db`                                    | use `localhost` outside Docker |
| `DJANGO_DB_PORT`             | `5432`                                  |                                |

You can define them in a `.env` file and use `uv run env-file=.env` or define another env file for uv: `UV_ENV_FILE=.env`.

## Run unit tests

You can execute unit tests by using the poe task `test` or directly using `pytest`. This task will create a temporary Postgres database in order to carry out all unit tests and then execute all test cases.

You can run a group or a single test by indicating path to the test
```shell
poe test -v [path to the test file]::[Test class]::[name of the test]
```

_Example:_
```shell
poe test -v back/tests/api/test_codification.py::TestCodification::test__get_codification_with_input_id
```

### Quick run and options

By default, if you run tests with `poe test`, some operations like coverage will be executed.

If you wish to run unit tests quickly without using all these options, you can use the `QUICK` option as follows:

```shell
QUICK=1 poe test
```

### Pytest options

You can indicate the detail level on the error or warning messages by using extra verbose `-vv` option.

```shell
QUICK=1 poe test -vv
```

You can also use the `-s` option to show all output messages generating during tests.

If you run your database locally, you can also directly use `pytest` without the wrapper script.

## Internationalization (i18n)

To update the `.pot` file and any `.po` language file, use:

```shell
poe i18n_extract
```

Then translate any missing strings in your `.po` file, using **[Poedit](https://poedit.net/)** for instance. Then compile the `.po` files to `.mo` files using:

```shell
poe i18n_compile
```

You can also find out missing translations with:

```shell
poe i18n_report
```

## Run linter

You can execute a linter tools by using the `poe lint` task.

```shell
poe lint
```

You can also directly run `flake8` or `mypy .`

React
=====

## Build Setup

```shell
# define MAPBOX_PUBLIC_KEY variable in your .env

# install dependencies
$ yarn install

# serve with hot reload at localhost:3978 or PORT variable
$ yarn run start

# build for production with minification
$ yarn run build
```

Then go to [http://localhost:3978/].

You can adjust your configuration in `front/src/config.js` file.

## Internationalization (i18n)

Use `t` or `<Trans>` in your `.jsx` files.

Use `msg` for lazy translations.

For more information: https://lingui.dev/tutorials/react

To update the `.pot` file and any `.po` language file, use:

```shell
yarn run i18n-extract
```

Then translate any missing strings in your `.po` file, using **[Poedit](https://poedit.net/)** for instance.

You can purge old translations with:

```shell
yarn run i18n-extract --clean
```

You can also find out missing translations with:

```shell
yarn run i18n-report
```

No compile is necessary in development. `.po` updates will be taken immediately.

## Linter

You can check writings errors in the code by using the following command:

```shell
yarn run lint
```

You can run only javascript linter with:

```shell
yarn run jslint
```

You can run only CSS/SASS linter with:

```shell
yarn run csslint
```

## Unit tests

Unit tests are made with **[Vitest](https://vitest.dev/)** which is a testing framework close to Jest. You can run tests by using:

```shell
yarn run test
```

If you wish to run unit tests quickly without coverage nor watch mode, you can set `QUICK=1` env var.

Start the application
=====================

## Use Docker compose
To run the project frontend and backend you can simply use docker compose.
```shell
docker compose up [-d] [--build]
```

You can access Myapp by going to: `http://localhost:3978/`

## Initialize data

### Initialize database

Open a new tab in your terminal and execute the following commands to set up the application's database:

```shell
uv run --env-file=.env ./back/manage.py migrate
```

You can check if migrations have been well applied by typing:

```shell
uv run --env-file=.env ./back/manage.py showmigrations
```

### Create a super user

To use the application, you will need to create a super-user account.

To do so, use the following command:

```shell
uv run --env-file=.env ./back/manage.py createsuperuser
```

Your super user account is now ready!

Tasks runner
============

For python, a tasks runner named `poe` is available. Simply run it (`poe`) within your venv or prefixed with `uv run` (`uv run poe`).

For javascript, you can list all tasks with `yarn run -s list`.

Common
======

## Update CHANGELOG

Create the `_CHANGELOGS/{Added, Fixed, Changed, Removed}/{branch_name}.md` files. Place the new file following the type of changes made to the application.

- Use the correct folder for your changes, use multiple if required.
- Use your branch name as a file base name.
- Describe any notable changes relevant to users or contributors.
- Indicate the story reference between brackets if the changes you brought are linked to one. _Example:_ (IT-42)
- Check grammar and spelling mistakes using extensions (_[Grammarly](https://marketplace.visualstudio.com/items?itemName=znck.grammarly)_, _[Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)_ for Visual Studio Code)

**Do not modify the main `CHANGELOG.md` file!** It will be automatically done during the creation of a new version.

Use [**ezchlog**](https://pypi.org/project/ezchlog/) to do it easily.


## Create a new version

To create a new version, you need first to go to the GitLab project page.
Then, go to the "CI/CD" section in the menu on the left and select the "Pipeline" subsection.

Select the last pipeline on the main branch and check that the commit is the last one on this branch. If that is the case,
click on the "Passed" icon and select one of the "tag" jobs depending on the type of version you want.

Version numbers are constructed as follows: `X.Y.Z`.

Where `X` stands for the major version, `Y` for the minor version and `Z` stands for the patched version.

- **Major:** choose it if you brought many evolutions to the code like new major features, important library updates...
- **Minor:** for feature modification, bug fixes
- **Patched:** mostly for adjustments or minor bug fixes

The job will:

- Create a new version commit and modify the `version` value in the `pyproject.toml` file
- Modify the `CHANGELOG.md` file by adding the content of the `_CHANGELOGS` folder
- Create a new version tag
- Create and publish a new Docker image to GitLab's Docker registry

Don’t do it by hand if possible.
