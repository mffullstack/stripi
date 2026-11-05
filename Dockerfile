
# ==========================================
# STRAPI 5 + NODE 22 + NEON POSTGRESQL
# PRODUÇÃO - RENDER
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

# Copiar dependências
COPY package.json package-lock.json ./

# Instalar dependências, incluindo devDependencies
RUN npm ci --no-audit --no-fund

# Copiar projeto
COPY . .

# Configurações de produção
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=10000

# Compilar painel administrativo
RUN npm run build

# Porta do Render
EXPOSE 10000

# Iniciar Strapi em produção
CMD ["npm", "run", "start"]
