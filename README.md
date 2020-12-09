# linkedcomponents-ui

UI for Linked Events. Linked Events is a collection of software components and API endpoints that enables event management and distribution for different event providers in Finland

## Development with Docker

To build the project, you will need [Docker](https://www.docker.com/community-edition).

Start the container

    docker-compose up

The web application should run at http://localhost:3000

## Running production version with Docker

Build the docker image

    DOCKER_TARGET=production docker-compose build

Start the container

    docker-compose up

The web application should run at http://localhost:3001

## Setting up development environment locally with docker

### Set tunnistamo hostname

Add the following line to your hosts file (`/etc/hosts` on mac and linux):

    127.0.0.1 tunnistamo-backend

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

To get silent renew to work locally you also need to set:

- ALLOW_CROSS_SITE_SESSION_COOKIE=True

After you've got tunnistamo running locally, ssh to the tunnistamo docker container:

`docker-compose exec django bash`

and execute the following four commands inside your docker container:

```bash
./manage.py add_oidc_client -n linkedevents-ui -t "id_token token" -u "http://localhost:3000/callback" "http://localhost:3000/silent-renew.html" -i https://api.hel.fi/auth/linkedevents-ui -m github -s dev -234 we
./manage.py add_oidc_client -n linkedevents -t "code" -u http://localhost:8081/return -i https://api.hel.fi/auth/linkedevents -m github -s dev -c
./manage.py add_oidc_api -n linkedevents -d https://api.hel.fi/auth -s email,profile -c https://api.hel.fi/auth/linkedevents
./manage.py add_oidc_api_scope -an linkedevents -c https://api.hel.fi/auth/linkedevents-ui -n "Linked Events UI" -d "Lorem ipsum"
```

Also add http:localhost:3000/ to Post Logout Redirect URIs of palvelutarjotin-admin client on Tunnistamo Django admin http://tunnistamo-backend:8000/admin/oidc_provider/client/

### Install Linked Events REST API server locally

TODO: Add instructions to set up local Linked Events REST API server when OIDC authentication is implemented there

### palvelutarjotin-admin-ui

Copy `cp .env.development.local.example .env.development.local`

Run `docker-compose up`, now the app should be running at `http://localhost:3000/`!
`docker-compose down` stops the container.

OR

Run `yarn && yarn start`

## Available Scripts

In the project directory, you can run:

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

Browser tests are written in TypeScript with [TestCafe](https://devexpress.github.io/testcafe/) framework.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

### `yarn lint`

Run linter to all the files in app

### `yarn lint:fix`

Run linter and fix all the linter errors

## Browser tests

Browser tests are written in TypeScript with [TestCafe](https://devexpress.github.io/testcafe/) framework.
