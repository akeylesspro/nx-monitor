FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

# A lockfile created on Windows omits optional native packages for other
# platforms (https://github.com/npm/cli/issues/4828). Install the Alpine
# binaries Vite needs, using the versions already locked for rollup and esbuild.
RUN npm install \
    && npm install --no-save --include=optional \
        "$(node -p "const v=require('./node_modules/rollup/package.json').optionalDependencies['@rollup/rollup-linux-x64-musl']; '@rollup/rollup-linux-x64-musl@'+v")" \
        "$(node -p "const v=require('./node_modules/esbuild/package.json').optionalDependencies['@esbuild/linux-x64']; '@esbuild/linux-x64@'+v")"

COPY . .

ARG ENV
RUN if [ -z "$ENV" ]; then echo "ENV build argument is required" && exit 1; fi
COPY env/${ENV}/.env .env

RUN npm run build

RUN rm -rf env

FROM node:22-alpine

WORKDIR /usr/src/app

RUN npm install -g serve

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 8004

CMD ["sh", "-c", "serve -s dist -l 8004 > /dev/null 2>&1"]