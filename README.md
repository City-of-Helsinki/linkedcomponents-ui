# linkedcomponents-ui

UI for Linked Events. Linked Events is a collection of software components and API endpoints that enables event management and distribution for different event providers in Finland

## Prerequisites

1. Node 18 (`nvm use`)
1. Yarn

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

Run `yarn && yarn start`

## Running development environment locally without docker

Run `yarn && yarn start`

## Configurable environment variables

Use .env.development.local for development.

| Name                                       | Description                                                                                                 |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| GENERATE_ROBOTS                            | Set to true to generate robots.txt file                                                                     |
| GENERATE_SITEMAP                           | Set to true to generate sitemap for the site                                                                |
| PUBLIC_URL                                 | Public url of the application url                                                                           |
| REACT_APP_LINKED_EVENTS_URL                | linkedevents api base url                                                                                   |
| REACT_APP_LINKED_REGISTRATIONS_UI_URL      | Linked registration UI url. Used to get signup form url                                                     |
| REACT_APP_OIDC_AUTHORITY                   | Keycloak SSO service url. Default in .env.local is https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus                                       |
| REACT_APP_OIDC_API_TOKENS_URL              | Keycloak api tokens endpoint url. Default in .env.local is https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/protocol/openid-connect/token |
| REACT_APP_OIDC_CLIENT_ID                   | Oidc client. Default in .env.local is linkedcomponents-ui-dev                                                                                            |
| REACT_APP_OIDC_API_SCOPE                   | Linked Events API scope. Default in .env.local is linkedevents-api-dev                                                                                   |
| REACT_APP_SENTRY_DSN                       | Sentry DSN. Both REACT_APP_SENTRY_DSN and REACT_APP_SENTRY_ENVIRONMENT has to be set to send error reports. |
| REACT_APP_SENTRY_ENVIRONMENT               | Setry environment.                                                                                          |
| REACT_APP_MATOMO_URL_BASE                  | https://analytics.hel.ninja/                                                                                |
| REACT_APP_MATOMO_SITE_ID                   | 69                                                                                                          |
| REACT_APP_MATOMO_SRC_URL                   | matomo.js                                                                                                   |
| REACT_APP_MATOMO_TRACKER_URL               | matomo.php                                                                                                  |
| REACT_APP_MATOMO_ENABLED                   | Flag to enable matomo. Default false.                                                                       |
| REACT_APP_SWAGGER_URL                      | https://dev.hel.fi/apis/linkedevents                                                                        |
| REACT_APP_SWAGGER_SCHEMA_URL               | https://raw.githubusercontent.com/City-of-Helsinki/api-linked-events/master/linked-events.swagger.yaml      |
| REACT_APP_INTERNET_PLACE_ID                | Id of the internet place. system:internet in development server, helsinki:internet in production            |
| REACT_APP_REMOTE_PARTICIPATION_KEYWORD_ID  | yso:p26626                                                                                                  |
| REACT_APP_LINKED_EVENTS_SYSTEM_DATA_SOURCE | helsinki                                                                                                    |
| REACT_APP_SHOW_ADMIN                       | Flag to show admin, Default true. pages                                                                     |
| REACT_APP_LOCALIZED_IMAGE                  | Flag to disabled localized image alt texts, Default true.                                                   |
| REACT_APP_ENABLE_EXTERNAL_USER_EVENTS      | Flag to enable events for users without an organization, Default true.                                      |
| REACT_APP_MAINTENANCE_SHOW_NOTIFICATION    | Flag to show maintenance notification in each page. Default is false.                                       |
| REACT_APP_MAINTENANCE_DISABLE_LOGIN        | Flag to disable login and to show toast message instead. Default is false                                   |

## Feature flags

There are a feature flags which can be enabled in `.env.development.local`:

`REACT_APP_SHOW_ADMIN`:

Features enabled:

- Editing keywords.
- Editing keyword sets.
- Editing image.
- Editing organizations.
- Editing places.

`REACT_APP_LOCALIZED_IMAGE`:

Features enabled:

- Localized alt-text of image.

## Snyk

Snyk CLI scans and monitors your projects for security vulnerabilities and license issues.

For more information visit the Snyk website https://snyk.io

For details see the CLI documentation https://docs.snyk.io/features/snyk-cli

How to get started

1. Authenticate by running `yarn snyk auth`
2. Test your local project with `yarn snyk test`
3. Get alerted for new vulnerabilities with `yarn snyk monitor`

You can see all available command with `yarn snyk`

You can install Snyk extension for Visual Studio Code from https://marketplace.visualstudio.com/items?itemName=snyk-security.snyk-vulnerability-scanner

## Available Scripts

In the project directory, you can run:

### `yarn analyze`

Source map explorer analyzes JavaScript bundles using the source maps. This helps you understand where code bloat is coming from.

To analyze the bundle run the production build then run the analyze script.

    yarn build
    yarn analyze

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

https://vitejs.dev/guide/cli.html#build

### `yarn codegen`

Codegen settings in <b>codegen.yml</b>

- Generate static types for GraphQL queries by using the schema from the local schema
- Generate react hooks for GraphQL queries from <b>query.ts</b> and <b>mutation.ts</b> files.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn test:coverage`

Launches the test runner and generates coverage report

### `yarn browser-test`

Running browser tests against test environment

Browser tests are written in TypeScript with [TestCafe](https://devexpress.github.io/testcafe/) framework.

### `yarn browser-test:local`

Running browser tests against local environment

### `yarn browser-test:prod`

Running browser tests against production environment

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

https://vitejs.dev/guide/cli.html#build

### `yarn serve`

Locally preview the production build. Do not use this as a production server as it's not designed for it.

https://vitejs.dev/guide/cli.html#vite-preview

### `yarn compress`

Gzip compress build folder. Run this after building app to be able serve files in compressed format.

### `yarn generate-sitemap`

Generates sitemap for the app. Sitemap is generated only if PUBLIC_URL is set and GENERATE_SITEMAP === true.

### `yarn generate-robots`

Generates production robots.txt for the app. File is generated only if PUBLIC_URL is set and GENERATE_ROBOTS === true. Link to sitemap is added if GENERATE_SITEMAP === true

### `yarn lint`

Run linter to all the files in app

### `yarn lint:fix`

Run linter and fix all the linter errors
