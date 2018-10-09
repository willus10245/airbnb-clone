FROM node

# Create app directory
WORKDIR /airbnb-clone

# Install app dependencies
COPY ./package.json .
COPY yarn.lock .
COPY ./packages/server/package.json ./packages/server/
COPY ./packages/common/package.json ./packages/common/

RUN yarn install --production

COPY ./packages/server/dist/ ./packages/server/dist
COPY ./packages/common/dist/ ./packages/common/dist
COPY ./packages/server/.env ./packages/server/
COPY ./ormconfig.json .

WORKDIR ./packages/server

ENV NODE_ENV production

EXPOSE 4000

CMD [ "node", "dist/index.js" ]