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

### Set tunnistamo and linkedevents hostname

Add the following lines to your hosts file (`/etc/hosts` on mac and linux):

    127.0.0.1 tunnistamo-backend
    127.0.0.1 linkedevents-backend

### Create a new OAuth app on GitHub

Go to https://github.com/settings/developers/ and add a new app with the following settings:

- Application name: can be anything, e.g. local tunnistamo
- Homepage URL: http://tunnistamo-backend:8000
- Authorization callback URL: http://tunnistamo-backend:8000/accounts/github/login/callback/

Save. You'll need the created **Client ID** and **Client Secret** for configuring tunnistamo in the next step.

### Install local tunnistamo

Clone https://github.com/City-of-Helsinki/tunnistamo/.

Follow the instructions for setting up tunnistamo locally. Before running `docker-compose up` set the following settings in tunnistamo roots `docker-compose.env.yaml`:

- SOCIAL_AUTH_GITHUB_KEY: **Client ID** from the GitHub OAuth app
- SOCIAL_AUTH_GITHUB_SECRET: **Client Secret** from the GitHub OAuth app

After you've got tunnistamo running locally, ssh to the tunnistamo docker container:

`docker-compose exec django bash`

and execute the following four commands inside your docker container:

```bash
./manage.py add_oidc_client -n linkedevents-ui -t "code" -u "http://localhost:3000/callback" "http://localhost:3000/silent-callback" -i https://api.hel.fi/auth/linkedevents-ui -m github -s dev
./manage.py add_oidc_client -n linkedevents -t "code" -u http://linkedevents-backend:8080/accounts/helsinki/login/callback -i https://api.hel.fi/auth/linkedevents -m github -s dev -c
./manage.py add_oidc_api -n linkedevents -d https://api.hel.fi/auth -s email,profile -c https://api.hel.fi/auth/linkedevents
./manage.py add_oidc_api_scope -an linkedevents -c https://api.hel.fi/auth/linkedevents -n "Linked events" -d"Lorem ipsum"
./manage.py add_oidc_client_to_api_scope -asi https://api.hel.fi/auth/linkedevents -c https://api.hel.fi/auth/linkedevents-ui
```

### Install local Linked Events API

Clone the repository (https://github.com/City-of-Helsinki/linkedevents). Follow the instructions for running linkedevents with docker. Before running `docker-compose up` set the following settings in `/docker/django/.env`:

- ALLOWED_HOSTS=\*
- APPLY_MIGRATIONS=false
- CREATE_SUPERUSER=true
- DATABASE_URL=postgres://linkedevents:linkedevents@linkedevents-db/linkedevents
- DEBUG=true
- DEV_SERVER=true
- MEMCACHED_URL=linkedevents-memcached:11211
- RUNSERVER_ADDRESS=0.0.0.0:8080
- SEAT_RESERVATION_DURATION=15
- WAIT_FOR_IT_ADDRESS=linkedevents-db:5432
- TOKEN_AUTH_AUTHSERVER_URL=http://tunnistamo-backend:8000/openid
- TOKEN_AUTH_ACCEPTED_AUDIENCE=https://api.hel.fi/auth/linkedevents
- TOKEN_AUTH_REQUIRE_SCOPE_PREFIX=False
- SOCIAL_AUTH_TUNNISTAMO_OIDC_ENDPOINT=http://tunnistamo-backend:8000/openid
- SOCIAL_AUTH_TUNNISTAMO_KEY=linkedevents
- SOCIAL_AUTH_TUNNISTAMO_SECRET<linkedevents client secret>

### Linked Events UI

Set the following settings in `.env.local`:

- VITE_OIDC_AUTHORITY=http://tunnistamo-backend:8000/openid
- VITE_OIDC_API_TOKENS_URL=http://tunnistamo-backend:8000/api-tokens/
- VITE_OIDC_CLIENT_ID=https://api.hel.fi/auth/linkedevents-ui
- VITE_OIDC_API_SCOPE=https://api.hel.fi/auth/linkedevents
- VITE_OIDC_RESPONSE_TYPE=code
- VITE_LINKED_EVENTS_URL=http://linkedevents-backend:8080/v1
- VITE_LINKED_REGISTRATIONS_UI_URL=http://localhost:3001

Run `docker-compose up`, now the app should be running at `http://localhost:3000/`

`docker-compose down` stops the container.

OR

Run `yarn && yarn start`

## Running development environment locally without docker

Run `yarn && yarn start`

## Configurable environment variables

Use .env.development.local for development.

| Name                                  | Description                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| GENERATE_ROBOTS                       | Set to true to generate robots.txt file                                                                |
| GENERATE_SITEMAP                      | Set to true to generate sitemap for the site                                                           |
| PUBLIC_URL                            | Public url of the application url                                                                      |
| VITE_LINKED_EVENTS_URL                | linkedevents api base url                                                                              |
| VITE_LINKED_REGISTRATIONS_UI_URL      | Linked registration UI url. Used to get signup form url                                                |
| VITE_OIDC_AUTHORITY                   | Tunnistamo SSO service url. Default is https://tunnistamo.test.hel.ninja/openid                        |
| VITE_OIDC_API_TOKENS_URL              | Tunnistamo api tokens endpoint url. Default is https://tunnistamo.test.hel.ninja/api-tokens/           |
| VITE_OIDC_CLIENT_ID                   | Oidc client. Default is linkedcomponents-ui-dev                                                        |
| VITE_OIDC_API_SCOPE                   | Linked Events API scope. Default is https://api.hel.fi/auth/linkedeventsapidev                         |
| VITE_OIDC_RESPONSE_TYPE               | Response type of oidc client. Default is 'code'                                                        |
| VITE_SENTRY_DSN                       | Sentry DSN. Both VITE_SENTRY_DSN and VITE_SENTRY_ENVIRONMENT has to be set to send error reports.      |
| VITE_SENTRY_ENVIRONMENT               | Setry environment.                                                                                     |
| VITE_MATOMO_URL_BASE                  | https://analytics.hel.ninja/                                                                           |
| VITE_MATOMO_SITE_ID                   | 69                                                                                                     |
| VITE_MATOMO_SRC_URL                   | matomo.js                                                                                              |
| VITE_MATOMO_TRACKER_URL               | matomo.php                                                                                             |
| VITE_MATOMO_ENABLED                   | Flag to enable matomo. Default false.                                                                  |
| VITE_SWAGGER_URL                      | https://dev.hel.fi/apis/linkedevents                                                                   |
| VITE_SWAGGER_SCHEMA_URL               | https://raw.githubusercontent.com/City-of-Helsinki/api-linked-events/master/linked-events.swagger.yaml |
| VITE_INTERNET_PLACE_ID                | Id of the internet place. system:internet in development server, helsinki:internet in production       |
| VITE_REMOTE_PARTICIPATION_KEYWORD_ID  | yso:p26626                                                                                             |
| VITE_LINKED_EVENTS_SYSTEM_DATA_SOURCE | helsinki                                                                                               |
| VITE_SHOW_ADMIN                       | Flag to show admin, Default true. pages                                                                |
| VITE_SHOW_REGISTRATION                | Flag to show registration related pages, Default true.                                                 |
| VITE_LOCALIZED_IMAGE                  | Flag to disabled localized image alt texts, Default true.                                              |
| VITE_ENABLE_EXTERNAL_USER_EVENTS      | Flag to enable events for users without an organization, Default true.                                 |
| VITE_MAINTENANCE_SHOW_NOTIFICATION    | Flag to show maintenance notification in each page. Default is false.                                  |
| VITE_MAINTENANCE_DISABLE_LOGIN        | Flag to disable login and to show toast message instead. Default is false                              |

## Feature flags

There are a feature flags which can be enabled in `.env.development.local`:

`VITE_SHOW_ADMIN`:

Features enabled:

- Editing keywords.
- Editing keyword sets.
- Editing image.
- Editing organizations.
- Editing places.

`VITE_SHOW_REGISTRATION`:

Features enabled:

- Link to the registrations in the header.
- Link to the registrations in the footer.
- Registration search, creation and update pages routes.
- Signup search, creation and update pages routes.

`VITE_LOCALIZED_IMAGE`:

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
