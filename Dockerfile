FROM node:21-alpine AS base
WORKDIR /src/app
COPY package*.json ./

FROM base AS dependencies
RUN npm install

FROM dependencies AS build
COPY . .
RUN npm run build

FROM node:21-alpine AS release
WORKDIR /src/app
COPY --from=build /src/app ./
EXPOSE 3000
CMD ["npm", "run", "dev"]