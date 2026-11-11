# ============================================================
# Dockerfile – Đổ Đống 4 Mùa (Next.js 16 + Node.js 20)
# KHÔNG thay đổi source code
# ============================================================

# --- Giai đoạn 1: Cài dependencies ---
FROM node:20-alpine AS deps
WORKDIR /app

# Sao chép package.json để cài thư viện
COPY package.json package-lock.json* ./
RUN npm ci

# --- Giai đoạn 2: Build ---
FROM node:20-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

# Copy node_modules từ giai đoạn deps
COPY --from=deps /app/node_modules ./node_modules

# Copy toàn bộ source code
COPY . .

# Build Next.js (tạo thư mục .next)
RUN npm run build

# --- Giai đoạn 3: Chạy production (nhẹ nhất) ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Tạo user không phải root (bảo mật)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy các file cần thiết để chạy
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Tạo thư mục uploads và cấp quyền cho nextjs user
RUN mkdir -p public/uploads && chown -R nextjs:nodejs public/uploads

# Cấp quyền thư mục .next
RUN chown -R nextjs:nodejs .next

USER nextjs

# Mở cổng 3000
EXPOSE 3000

# Khởi động ứng dụng
CMD ["npm", "start"]
