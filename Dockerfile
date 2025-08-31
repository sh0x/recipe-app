FROM node:20-bookworm

RUN apt-get update &&     apt-get install -y --no-install-recommends ca-certificates openssl postgresql-client &&     rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=development
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install || true

COPY . .

# Ensure home exists and is writable for the node user (usually true already)
RUN mkdir -p /home/node && chown -R node:node /home/node

# Keep node_modules & store on volumes; dev server will be started by docker-compose command
EXPOSE 3000
CMD ["bash", "-lc", "pnpm config set store-dir /app/.pnpm-store && pnpm install && npx prisma migrate dev --name init || true && pnpm run seed || true && pnpm dev"]
