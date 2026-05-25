# ============================================================
# STAGE 1: Build the Static Assets
# ============================================================
FROM helsinki.azurecr.io/ubi9/nodejs-22-pnpm-builder-base AS appbase

# 1. Copy only necessary files for build
COPY --chown=default:root package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=default:root ./public ./public
COPY --chown=default:root index.html vite.config.ts tsconfig.json .eslintignore .eslintrc.json .prettierrc.json .env* ./
COPY --chown=default:root ./src ./src

# 2. Run the install and update-runtime-env script
# corepack in the base image will automatically use the version of pnpm
# defined in your package.json 'packageManager' field if present.
RUN pnpm install --frozen-lockfile --ignore-scripts && pnpm store prune

# ============================================================
# STAGE 2: Development
# ============================================================
FROM appbase AS development

WORKDIR /app

# Set NODE_ENV to development in the development container
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

EXPOSE 8080

CMD pnpm exec vite --port 8080

# ============================================================
# STAGE 3: Static builder for production
# ============================================================
FROM appbase AS staticbuilder

# Set public url
ARG PUBLIC_URL

# Set generate sitemap and generate robots flag
ARG GENERATE_SITEMAP
ARG GENERATE_ROBOTS

# Vite/Rollup build args
ARG ROLLUP_INLINE_DYNAMIC_IMPORTS

# Set release version for Sentry
ARG REACT_APP_SENTRY_RELEASE
ENV REACT_APP_RELEASE=${REACT_APP_SENTRY_RELEASE:-""}

# Set LinkedEvents url
ARG REACT_APP_LINKED_EVENTS_URL
# Set LinkedRegistrations UI url
ARG REACT_APP_LINKED_REGISTRATIONS_UI_URL

# Set OIDC settings
ARG REACT_APP_OIDC_AUTHORITY
ARG REACT_APP_OIDC_API_TOKENS_URL
ARG REACT_APP_OIDC_CLIENT_ID
ARG REACT_APP_OIDC_API_SCOPE

# Set Sentry settings
ARG REACT_APP_SENTRY_DSN
ARG REACT_APP_SENTRY_ENVIRONMENT
ARG REACT_APP_SENTRY_RELEASE
ARG REACT_APP_SENTRY_TRACES_SAMPLE_RATE
ARG REACT_APP_SENTRY_TRACE_PROPAGATION_TARGETS
ARG REACT_APP_SENTRY_REPLAYS_SESSION_SAMPLE_RATE
ARG REACT_APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE

# Set Matomo settings
ARG REACT_APP_MATOMO_SRC_URL
ARG REACT_APP_MATOMO_URL_BASE
ARG REACT_APP_MATOMO_SITE_ID
ARG REACT_APP_MATOMO_ENABLED

# Internet place id
ARG REACT_APP_INTERNET_PLACE_ID
# Remote participation keyword id
ARG REACT_APP_REMOTE_PARTICIPATION_KEYWORD_ID
# Data source of new linked events objects
ARG REACT_APP_LINKED_EVENTS_SYSTEM_DATA_SOURCE
# Allowed domain for the substitute user
ARG REACT_APP_ALLOWED_SUBSTITUTE_USER_DOMAINS

# Swagger URL
ARG REACT_APP_SWAGGER_URL

# Feature flags
ARG REACT_APP_SHOW_ADMIN
ARG REACT_APP_SHOW_PLACE_PAGES
ARG REACT_APP_ENABLE_SWEDISH_TRANSLATIONS
ARG REACT_APP_ENABLE_EXTERNAL_USER_EVENTS
ARG REACT_APP_MAINTENANCE_SHOW_NOTIFICATION
ARG REACT_APP_MAINTENANCE_DISABLE_LOGIN
ARG REACT_APP_WEB_STORE_INTEGRATION_ENABLED
ARG REACT_APP_USE_IMAGE_PROXY

RUN pnpm build
RUN pnpm generate-sitemap
RUN pnpm generate-robots

# ============================================================
# STAGE 4: Production Runtime
# ============================================================
FROM helsinki.azurecr.io/ubi9/nginx-126-spa-standard AS production

ARG REACT_APP_SENTRY_RELEASE
ENV APP_RELEASE=${REACT_APP_SENTRY_RELEASE:-""}
# 1. Copy the compiled assets
COPY --from=staticbuilder /app/build /usr/share/nginx/html

# 2. Setup Runtime Env Injection
# env.sh is provided by the base image
WORKDIR /usr/share/nginx/html
COPY .env .

# 3. Inject Versioning for the /readiness endpoint from package.json using base image
COPY package.json .

# - env.sh      (Inherited from base image at /usr/share/nginx/html/env.sh)
# - USER 1001   (Inherited from base image)
# - EXPOSE 8080 (Inherited from base image)
# - ENTRYPOINT/CMD (Inherited from base image)
