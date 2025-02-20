# Install dependencies only when needed
FROM docker.io/node:lts-alpine AS deps
# Set environment variables for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack and install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /usr/src/app
COPY dist/apps/be-nestjs-app/package*.json ./
COPY apps/be-nestjs-app/prisma/schema.prisma ./prisma/

RUN pnpm install

RUN chown -R node:node .
USER node
EXPOSE 3000
# Generate Prisma client during the build phase
RUN pnpx prisma generate
CMD ["dumb-init", "node", "main.js"]

