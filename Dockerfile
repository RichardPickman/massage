# syntax=docker/dockerfile:1

# ---- build ----------------------------------------------------------------
FROM node:26-bookworm-slim AS build

RUN npm install -g pnpm@12.3.4

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# makeURL() appends "/api/" itself, so an empty base yields relative URLs and one
# image works behind any hostname. An absolute base still works, which is what a
# separate API domain would need.
ARG VITE_APP_API_URL=
ENV VITE_APP_API_URL=$VITE_APP_API_URL

# `pnpm build` typechecks first, so a type error fails the image, not the browser.
RUN pnpm build

# ---- runtime --------------------------------------------------------------
# Caddy serves the build and proxies /api to the API container, so the browser
# sees a single origin and there is no CORS surface to get wrong.
FROM caddy:2-alpine AS runtime

COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443
