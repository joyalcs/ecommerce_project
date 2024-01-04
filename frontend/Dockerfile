FROM node:18-alpine as BUILD_IMAGE

WORKDIR /frontend

COPY package.json  ./
COPY package-lock.json ./

RUN npm install

COPY . .

# RUN  npm run build

# FROM node:18-alpine as PRODUCTION_IMAGE
# WORKDIR /frontend
# COPY --from=BUILD_IMAGE /frontend/dist /frontend/dist
