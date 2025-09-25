FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

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