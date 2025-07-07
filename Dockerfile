# ステージ1: ビルド環境 (依存関係のインストールとアプリケーションのビルド)
FROM node:20-alpine AS builder
# Alpine Linuxは軽量なベースイメージです

WORKDIR /app

# package.jsonとpackage-lock.json (またはyarn.lock) のみをコピーして依存関係をインストール
# これにより、コード変更時にも依存関係のレイヤーはキャッシュされ、ビルドが高速化される
COPY package*.json ./
# もしyarnを使っている場合は COPY yarn.lock ./ と RUN yarn install --frozen-lockfile
RUN npm install --legacy-peer-deps

# アプリケーションのソースコードをコピー
COPY . .

# Next.jsアプリケーションをビルド
# (環境変数NEXT_TELEMETRY_DISABLED=1 はNext.jsのテレメトリを無効化するもので、任意)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ステージ2: 本番環境 (ビルド成果物のみを実行)
FROM node:20-alpine AS runner

WORKDIR /app

# ビルダー環境から必要なファイルのみをコピー
# これにより、最終的なイメージサイズを小さく保つ
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# もしnext.config.jsや他の設定ファイルがあればそれもコピー
# COPY --from=builder /app/next.config.js ./next.config.js

# 環境変数を設定 (本番モードで実行)
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# アプリケーションがリッスンするポートを公開 (Next.jsのデフォルトは3000)
EXPOSE 3000

# アプリケーションの起動コマンド
# package.jsonの "start" スクリプト (`next start`) を実行
CMD ["npm", "start"]
