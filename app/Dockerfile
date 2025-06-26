FROM public.ecr.aws/docker/library/node:23-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN --mount=type=secret,id=TURNSTILE_SITE_KEY,env=NEXT_PUBLIC_TURNSTILE_SITE_KEY \
    --mount=type=secret,id=HCAPTCHA_SITE_KEY,env=NEXT_PUBLIC_HCAPTCHA_SITE_KEY \
    npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

ENV PORT=3000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["node", "server.js"]