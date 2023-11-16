FROM node:21

WORKDIR /frontend

COPY package.json  ./

RUN npm i
RUN npm install react-redux
RUN rm package-lock.json


COPY package.json /frontend/package.json
COPY package-lock.json /frontend/package-lock.json

EXPOSE 5173

CMD ["npm", "run", "dev"]
