
# ==========================================
# STRAPI 5 + NODE 22 + NEON POSTGRESQL
# ==========================================

FROM node:22-bookworm-slim

WORKDIR /opt/app

# Dependências do sistema
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm ci --no-audit --no-fund

# Copiar código do Strapi
COPY . .

# Configurações
ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=1337

EXPOSE 1337

CMD ["npm", "run", "develop"]
