# ============================================================
# STAGE 1: Build the Static Assets
# ============================================================
FROM helsinki.azurecr.io/ubi9/nodejs-22-pnpm-builder-base AS appbase

# 1. Copy only necessary files for build
COPY --chown=default:root package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=default:root ./public ./public
COPY --chown=default:root ./scripts ./scripts
COPY --chown=default:root index.html vite.config.ts tsconfig.json .eslintignore .eslintrc.json .prettierrc.json .env* ./
COPY --chown=default:root ./src ./src

# 2. Run the install and update-runtime-env script
# corepack in the base image will automatically use the version of pnpm
# defined in your package.json 'packageManager' field if present.
RUN pnpm install --frozen-lockfile --ignore-scripts && pnpm store prune
RUN pnpm update-runtime-env

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

# Feature flags
ARG REACT_APP_SHOW_ADMIN
ARG REACT_APP_SHOW_PLACE_PAGES
ARG REACT_APP_ENABLE_SWEDISH_TRANSLATIONS
ARG REACT_APP_WEB_STORE_INTEGRATION_ENABLED

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
