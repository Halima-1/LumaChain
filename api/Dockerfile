FROM node:20-alpine
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace config
COPY pnpm-workspace.yaml package.json ./
COPY api/package.json ./api/
COPY sdk/package.json ./sdk/

# Install dependencies
RUN pnpm install

# Copy source code
COPY api/ ./api/
COPY sdk/ ./sdk/

# Build SDK and API
RUN pnpm --filter @lumachain/sdk build
RUN pnpm --filter @lumachain/api build

# Start API
WORKDIR /app/api
EXPOSE 3001
CMD ["pnpm", "start"]
