# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
FROM node:22.14.0-slim AS base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
# ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# 1. Утилиты: bash и postgresql-client (psql + createdb)
RUN apt-get install -y --no-install-recommends postgresql-client bash

# 3. Копируем init-скрипт и даём права
COPY init_db.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/init_db.sh

# Install node modules
COPY package.json ./
RUN yarn install --frozen-lockfile

# Copy application code
COPY . .

# Build application
RUN yarn build

# Remove development dependencies
RUN yarn install --production --frozen-lockfile

COPY ./provider.js ./node_modules/@snapshot-labs/checkpoint/dist/src/providers/evm/provider.js

# # Final stage for app image
# FROM base

# # Copy built application
# COPY --from=build /app/dist /app/dist
# COPY --from=build /app/node_modules /app/node_modules
# COPY --from=build /app/package.json /app/

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/init_db.sh"]
CMD [ "yarn", "start" ]
