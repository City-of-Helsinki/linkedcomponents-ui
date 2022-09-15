# ===============================================
FROM helsinkitest/node:14-slim as appbase
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

ENV PORT 8000

# Copy all files
COPY --chown=appuser:appuser . /app/

# Bake package.json start command into the image
CMD ["yarn", "start"]

EXPOSE 8000

# ===================================
FROM appbase as staticbuilder
# ===================================
COPY . /app/

# Set public url
ARG PUBLIC_URL

# Set generate sitemap and generate robots flag
ARG GENERATE_SITEMAP
ARG GENERATE_ROBOTS

# Set LinkedEvents url
ARG REACT_APP_LINKED_EVENTS_URL
# Set LinkedRegistrations UI url
ARG REACT_APP_LINKED_REGISTRATIONS_UI_URL

# Set OIDC settings
ARG REACT_APP_OIDC_AUTHORITY
ARG REACT_APP_OIDC_CLIENT_ID
ARG REACT_APP_OIDC_API_SCOPE

# Set Sentry settings
ARG REACT_APP_SENTRY_DSN
ARG REACT_APP_SENTRY_ENVIRONMENT

# Set Matomo settings
ARG REACT_APP_MATOMO_URL_BASE
ARG REACT_APP_MATOMO_SITE_ID
ARG REACT_APP_MATOMO_SRC_URL
ARG REACT_APP_MATOMO_TRACKER_URL
ARG REACT_APP_MATOMO_ENABLED

# Internet place id
ARG REACT_APP_INTERNET_PLACE_ID
# Remote participation keyword id
ARG REACT_APP_REMOTE_PARTICIPATION_KEYWORD_ID
# Data source of new linked events objects
ARG REACT_APP_LINKED_EVENTS_SYSTEM_DATA_SOURCE

# Feature flags
ARG REACT_APP_SHOW_ADMIN
ARG REACT_APP_SHOW_REGISTRATION

RUN yarn build
RUN yarn generate-sitemap
RUN yarn generate-robots
RUN yarn compress

# =============================
FROM registry.access.redhat.com/ubi8/nginx-118 as production
# =============================
USER root

RUN chgrp -R 0 /usr/share/nginx/html && \
    chmod -R g=u /usr/share/nginx/html

# Copy static build
COPY --from=staticbuilder /app/build /usr/share/nginx/html

# Copy nginx config
COPY .prod/nginx.conf /etc/nginx/nginx.conf

COPY .env .

USER 1001

CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]

EXPOSE 8000