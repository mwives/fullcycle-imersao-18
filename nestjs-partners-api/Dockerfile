FROM node:20-alpine

RUN npm i -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000 3001

ENTRYPOINT ["/app/entrypoint.sh"]
