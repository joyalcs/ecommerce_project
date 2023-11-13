FROM node:14

WORKDIR /frontend

COPY package.json  ./

RUN npm install react-redux
RUN rm package-lock.json


COPY package.json /frontend/package.json
COPY package-lock.json /frontend/package-lock.json

CMD ["npm", "run", "dev"]
