FROM node:18-alpine as dependencies
LABEL stage=intermediate
WORKDIR /nnchat
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:18-alpine as builder
LABEL stage=intermediate
WORKDIR /nnchat
COPY . .
COPY --from=dependencies /nnchat/node_modules ./node_modules
RUN yarn build

FROM node:18-alpine as runner
WORKDIR /nnchat
ENV NODE_ENV production

COPY --from=builder /nnchat/public ./public
COPY --from=builder /nnchat/package.json ./package.json
COPY --from=builder /nnchat/.next ./.next
COPY --from=builder /nnchat/node_modules ./node_modules

EXPOSE 3000
CMD ["yarn", "start"]