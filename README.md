# linkedcomponents-ui

UI for Linked Events. Linked Events is a collection of software components and API endpoints that enables event management and distribution for different event providers in Finland

## Prerequisites

1. Node 24 (`nvm use`)
1. Pnpm - Make sure you have [pnpm](https://pnpm.io/installation) installed globally.

## Development with Docker

To build the project, you will need [Docker](https://www.docker.com/community-edition).

Build the docker image

    docker compose build

Start the container

    docker compose up

The web application is running at http://localhost:3000

## Running production version with Docker

Build the docker image

    DOCKER_TARGET=production docker compose build

Start the container

    docker compose up

The web application is running at http://localhost:3000

## Setting up complete development environment locally with docker

### Install local Linked Events API

Clone the repository (https://github.com/City-of-Helsinki/linkedevents). Follow the instructions for running linkedevents with docker. Before running `docker compose up` use the `env.example` template as base for `/docker/django/.env`

### Linked Events UI

Copy default environment variables from `.env.local.example` to `.env.local` to enable authentication with Helsinki Tunnistus (Keycloak) and to set correct end point for local Linked Events API.

Run `docker-compose up`, now the app should be running at `http://localhost:3000/`

`docker-compose down` stops the container.

OR

Run `pnpm i && pnpm start`

## Running development environment locally without docker

Run `pnpm i && pnpm start`

## Configurable environment variables

Use .env.development.local for development.

| Name                                          | Description                                                                                                                                              |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GENERATE_ROBOTS                               | Set to true to generate robots.txt file                                                                                                                  |
| GENERATE_SITEMAP                              | Set to true to generate sitemap for the site                                                                                                             |
| PUBLIC_URL                                    | Public url of the application url                                                                                                                        |
| REACT_APP_LINKED_EVENTS_URL                   | linkedevents api base url                                                                                                                                |
| REACT_APP_LINKED_REGISTRATIONS_UI_URL         | Linked registration UI url. Used to get signup form url                                                                                                  |
| REACT_APP_OIDC_AUTHORITY                      | Keycloak SSO service url. Default in .env.local is https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus                                       |
| REACT_APP_OIDC_API_TOKENS_URL                 | Keycloak api tokens endpoint url. Default in .env.local is https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/protocol/openid-connect/token |
| REACT_APP_OIDC_CLIENT_ID                      | Oidc client. Default in .env.local is linkedcomponents-ui-dev                                                                                            |
| REACT_APP_OIDC_API_SCOPE                      | Linked Events API scope. Default in .env.local is linkedevents-api-dev                                                                                   |
| SENTRY_PROJECT                                | Sentry project name. Used by the Sentry CLI (e.g. for source map uploads).                                                                               |
| REACT_APP_SENTRY_DSN                          | Sentry DSN. Both REACT_APP_SENTRY_DSN and REACT_APP_SENTRY_ENVIRONMENT has to be set to send error reports.                                              |
| REACT_APP_SENTRY_ENVIRONMENT                  | Sentry environment.                                                                                                                                      |
| REACT_APP_SENTRY_TRACES_SAMPLE_RATE           | Sample rate for Sentry performance tracing (0.0–1.0).                                                                                                    |
| REACT_APP_SENTRY_TRACE_PROPAGATION_TARGETS    | Comma-separated list of URL patterns for which Sentry should propagate trace headers.                                                                    |
| REACT_APP_SENTRY_REPLAYS_SESSION_SAMPLE_RATE  | Sample rate for Sentry Session Replay (0.0–1.0).                                                                                                         |
| REACT_APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE | Sample rate for Sentry Session Replay when an error occurs (0.0–1.0).                                                                                    |
| REACT_APP_MATOMO_URL_BASE                     | //matomo.hel.ninja/                                                                                                                                      |
| REACT_APP_MATOMO_SITE_ID                      | 42                                                                                                                                                       |
| REACT_APP_MATOMO_SRC_URL                      | matomo.js                                                                                                                                                |
| REACT_APP_MATOMO_ENABLED                      | Flag to enable matomo. Default false.                                                                                                                    |
| REACT_APP_SWAGGER_URL                         | https://api.hel.fi/linkedevents/api-docs/                                                                                                                |
| REACT_APP_INTERNET_PLACE_ID                   | Id of the internet place. system:internet in development server, helsinki:internet in production                                                         |
| REACT_APP_REMOTE_PARTICIPATION_KEYWORD_ID     | yso:p26626                                                                                                                                               |
| REACT_APP_LINKED_EVENTS_SYSTEM_DATA_SOURCE    | helsinki                                                                                                                                                 |
| REACT_APP_SHOW_ADMIN                          | Flag to show admin pages, Default true. pages                                                                                                            |
| REACT_APP_SHOW_PLACE_PAGES                    | Flag to show place pages, Default is false.                                                                                                              |
| REACT_APP_ENABLE_SWEDISH_TRANSLATIONS         | Flag to enable swedish translations, Default is false.                                                                                                   |
| REACT_APP_ENABLE_EXTERNAL_USER_EVENTS         | Flag to enable events for users without an organization, Default true.                                                                                   |
| REACT_APP_USE_IMAGE_PROXY                     | Flag to enable image proxy for event images. Default is true.                                                                                            |
| REACT_APP_MAINTENANCE_SHOW_NOTIFICATION       | Flag to show maintenance notification in each page. Default is false.                                                                                    |
| REACT_APP_MAINTENANCE_DISABLE_LOGIN           | Flag to disable login and to show toast message instead. Default is false                                                                                |
| REACT_APP_ALLOWED_SUBSTITUTE_USER_DOMAINS     | Allowed domains for the substitute user email. Defaul is hel.fi                                                                                          |
| REACT_APP_WEB_STORE_INTEGRATION_ENABLED       | Flag to enable Tapla integration. Default is false                                                                                                       |

## Feature flags

There are a feature flags which can be enabled in `.env.development.local`:

`REACT_APP_SHOW_ADMIN`:

Features enabled:

- Editing keywords.
- Editing keyword sets.
- Editing image.
- Editing organizations.
- Editing places.

Note that also `REACT_APP_SHOW_PLACE_PAGES` has to be enabled to see place pages.

`REACT_APP_SHOW_PLACE_PAGES`:

Features enabled:

- Editing places.

`REACT_APP_WEB_STORE_INTEGRATION_ENABLED`:

Features enabled:

- Editing price groups of a registration
- Selecting price group for a signup or a signup group

## Commit message format

New commit messages must adhere to the [Conventional Commits](https://www.conventionalcommits.org/)
specification, and line length is limited to 72 characters.

[`commitlint`](https://github.com/conventional-changelog/commitlint) checks new commit messages for the correct format.

## Available Scripts

In the project directory, you can run:

### `pnpm analyze`

Source map explorer analyzes JavaScript bundles using the source maps. This helps you understand where code bloat is coming from.

To analyze the bundle run the production build then run the analyze script.

    pnpm build
    pnpm analyze

### `pnpm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

https://vitejs.dev/guide/cli.html#build

### `pnpm codegen`

Codegen settings in <b>codegen.yml</b>

- Generate static types for GraphQL queries by using the schema from the local schema
- Generate react hooks for GraphQL queries from <b>query.ts</b> and <b>mutation.ts</b> files.

### `pnpm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `pnpm test:coverage`

Launches the test runner and generates coverage report

### `pnpm test:e2e:install`

Install [Playwright](https://playwright.dev) for running browser tests

### `pnpm test:e2e`

Running browser tests

### `pnpm build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

https://vitejs.dev/guide/cli.html#build

### `pnpm serve`

Locally preview the production build. Do not use this as a production server as it's not designed for it.

https://vitejs.dev/guide/cli.html#vite-preview

### `pnpm generate-sitemap`

Generates sitemap for the app. Sitemap is generated only if PUBLIC_URL is set and GENERATE_SITEMAP === true.

### `pnpm generate-robots`

Generates production robots.txt for the app. File is generated only if PUBLIC_URL is set and GENERATE_ROBOTS === true. Link to sitemap is added if GENERATE_SITEMAP === true

### `pnpm lint`

Run linter to all the files in app

### `pnpm lint:fix`

Run linter and fix all the linter errors
