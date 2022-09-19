# linkedcomponents-ui

UI for Linked Events. Linked Events is a collection of software components and API endpoints that enables event management and distribution for different event providers in Finland

## Prerequisites

1. Node 16 (`nvm use`)
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

## Running development environment locally without docker

Run `yarn && yarn start`

## Configurable environment variables

Use .env.development.local for development.

| Name                                       | Description                                                                                            |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| REACT_APP_LINKED_EVENTS_URL                | linkedevents api base url                                                                              |
| REACT_APP_LINKED_REGISTRATIONS_UI_URL      | Linked registration UI url. Used to get signup form url                                                |
| REACT_APP_OIDC_AUTHORITY                   | https://api.hel.fi/sso                                                                                 |
| REACT_APP_OIDC_CLIENT_ID                   | linkedcomponents-ui-test                                                                               |
| REACT_APP_OIDC_API_SCOPE                   | https://api.hel.fi/auth/linkedeventsdev                                                                |
| REACT_APP_SENTRY_DSN                       | https://9b104b8db52740ffb5002e0c9e40da45@sentry.hel.ninja/12                                           |
| REACT_APP_MATOMO_URL_BASE                  | https://analytics.hel.ninja/                                                                           |
| REACT_APP_MATOMO_SITE_ID                   | 69                                                                                                     |
| REACT_APP_MATOMO_SRC_URL                   | matomo.js                                                                                              |
| REACT_APP_MATOMO_TRACKER_URL               | matomo.php                                                                                             |
| REACT_APP_MATOMO_ENABLED                   | Flag to enable matomo. Default false.                                                                  |
| REACT_APP_SWAGGER_URL                      | https://dev.hel.fi/apis/linkedevents                                                                   |
| REACT_APP_SWAGGER_SCHEMA_URL               | https://raw.githubusercontent.com/City-of-Helsinki/api-linked-events/master/linked-events.swagger.yaml |
| REACT_APP_INTERNET_PLACE_ID                | Id of the internet place. system:internet in development server, helsinki:internet in production       |
| REACT_APP_REMOTE_PARTICIPATION_KEYWORD_ID  | yso:p26626                                                                                             |
| REACT_APP_LINKED_EVENTS_SYSTEM_DATA_SOURCE | helsinki                                                                                               |
| REACT_APP_SHOW_ADMIN                       | Flag to show admin, Default true. pages                                                                |
| REACT_APP_SHOW_REGISTRATION                | Flag to show registration related pages, Default true.                                                 |


## Feature flags

There are a feature flags which can be enabled in `.env.development.local`:

`REACT_APP_SHOW_ADMIN`:
`REACT_APP_SHOW_REGISTRATION`:

Features enabled:

- Link to the registrations in the header.
- Link to the registrations in the footer.
- Registration search, creation and update pages routes.
- Enrolment search, creation and update pages routes.

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

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

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

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

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
