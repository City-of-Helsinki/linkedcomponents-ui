# ===============================================
FROM helsinkitest/node:12-slim as appbase
# ===============================================
# Offical image has npm log verbosity as info. More info - https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL warn

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Yarn
ENV YARN_VERSION 1.22.5
RUN yarn policies set-version $YARN_VERSION

# Use non-root user
USER appuser

# Install dependencies
COPY --chown=appuser:appuser package*.json *yarn* /app/
RUN yarn && yarn cache clean --force

# =============================
FROM appbase as development
# =============================

# Set NODE_ENV to development in the development container
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# Copy all files
COPY --chown=appuser:appuser . /app/

# Bake package.json start command into the image
CMD ["yarn", "start"]

# ===================================
FROM appbase as staticbuilder
# ===================================
COPY . /app/

# Set public url
ARG PUBLIC_URL

# Set generate sitemap and generate robots flag
ARG GENERATE_SITEMAP
ARG GENERATE_ROBOTS

# set sass path to support scss import
ARG SASS_PATH=./src/assets/styles
ENV SASS_PATH $SASS_PATH

# Set LinkedEvents url
ARG REACT_APP_LINKED_EVENTS_URL

# Set OIDC settings
ARG REACT_APP_OIDC_AUTHORITY
ARG REACT_APP_OIDC_CLIENT_ID
ARG REACT_APP_OIDC_SCOPE

# Set Sentry settings
ARG REACT_APP_SENTRY_DSN
ARG REACT_APP_SENTRY_ENVIRONMENT

# Set Matomo settings
ARG REACT_APP_MATOMO_URL_BASE
ARG REACT_APP_MATOMO_SITE_ID
ARG REACT_APP_MATOMO_SRC_URL
ARG REACT_APP_MATOMO_TRACKER_URL
ARG REACT_APP_MATOMO_ENABLED

RUN yarn build
RUN yarn generate-sitemap
RUN yarn generate-robots
RUN yarn compress

# =============================
FROM nginx:1.17 as production
# =============================

# Nginx runs with user "nginx" by default
COPY --from=staticbuilder --chown=nginx:nginx /app/build /usr/share/nginx/html

COPY .prod/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80