# 🔧 Configuração de Variáveis de Ambiente para Render

## ⚠️ IMPORTANTE: Antes de fazer deploy no Render

Você PRECISA configurar as seguintes variáveis de ambiente no painel do Render.

---

## 📋 Variáveis OBRIGATÓRIAS

### 1. **Banco de Dados (PostgreSQL/Neon)**

```
DATABASE_HOST=your-neon-db-host.neon.tech
DATABASE_PORT=5432
DATABASE_NAME=neondb
DATABASE_USERNAME=neondb_owner
DATABASE_PASSWORD=<configure-in-render>
DATABASE_SCHEMA=public
```

**Onde obter:**
- Crie um banco PostgreSQL no [Neon](https://neon.tech) (gratuito)
- Copie os dados da sua connection string

---

### 2. **Chaves de Segurança (Strapi Admin)**

Você PRECISA gerar 4 chaves aleatórias seguras:

#### Opção A: Gerar automaticamente (Recomendado)
```bash
# No terminal do seu computador, rode:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Repita 4 vezes para gerar 4 chaves diferentes.

#### Opção B: Valores de exemplo (PARA TESTE APENAS - NÃO USE EM PRODUÇÃO)
```
APP_KEYS=<configure-in-render>
ADMIN_JWT_SECRET=<configure-in-render>
API_TOKEN_SALT=<configure-in-render>
TRANSFER_TOKEN_SALT=<configure-in-render>
ENCRYPTION_KEY=<configure-in-render>
```

---

### 3. **Variáveis Opcionais**

```
NODE_ENV=production        # Sempre production
HOST=0.0.0.0              # Sempre 0.0.0.0
PORT=1337                 # Porta padrão (Render atribui automaticamente)
```

---

## 🚀 Como Configurar no Render

### Passo 1: Acessar o Painel
1. Vá para [render.com](https://render.com)
2. Selecione seu serviço Web Service (stripi-uz7v)
3. Clique em **Environment**

### Passo 2: Adicionar Variáveis
Clique em **Add Environment Variable** para cada uma:

```
DATABASE_HOST = neon-host.neon.tech
DATABASE_PORT = 5432
DATABASE_NAME = neondb
DATABASE_USERNAME = user
DATABASE_PASSWORD = <configure-in-render>
DATABASE_SCHEMA = public

APP_KEYS = <configure-in-render>
ADMIN_JWT_SECRET = <configure-in-render>
API_TOKEN_SALT = <configure-in-render>
TRANSFER_TOKEN_SALT = <configure-in-render>
ENCRYPTION_KEY = <configure-in-render>

NODE_ENV = production
HOST = 0.0.0.0
```

### Passo 3: Deploy
- Clique em **Deploy** ou **Redeploy**
- Aguarde 5-10 minutos
- Acesse https://stripi-uz7v.onrender.com/admin

---

## ✅ Testando Após Deploy

1. **Acesse o Painel Admin:**
   ```
   https://stripi-uz7v.onrender.com/admin
   ```

2. **Crie um usuário admin** (primeira execução)

3. **Verifique as Collections:**
   - Content Manager → Você deve ver:
     - asaas-cliente ✅
     - asaas-plano ✅
     - asaas-pagamento ✅

4. **Teste a API:**
   ```bash
   curl https://stripi-uz7v.onrender.com/api
   ```

---

## 🔐 Segurança

**⚠️ NÃO COLOQUE ESSAS CHAVES NO GITHUB!**

- Use variáveis de ambiente do Render
- Nunca commit `.env` com dados reais
- Gere chaves diferentes para cada ambiente (dev, staging, prod)

---

## 🆘 Troubleshooting

### Erro: "Cannot read properties of undefined"
→ Falta variável de ambiente (DATABASE_HOST, ADMIN_JWT_SECRET, etc)

### Erro: "Port not detected"
→ NODE_ENV está errado, deve ser "production"

### Tela Preta no Admin
→ Espere 2-3 minutos após deploy, Strapi está compilando

### Erro de Banco de Dados
→ Verifique DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD

---

## 📝 Checklist Antes de Deploy

- [ ] Gerei 4 chaves seguras
- [ ] Criei banco PostgreSQL no Neon
- [ ] Configurei todas as 11 variáveis de ambiente no Render
- [ ] Dockerfile foi atualizado para produção
- [ ] Fiz commit e push no GitHub
- [ ] Cliquei em Redeploy no Render

---

## 📚 Documentação Útil

- [Strapi Deployment](https://docs.strapi.io/dev-docs/deployment)
- [Neon PostgreSQL](https://neon.tech/docs)
- [Render Environment Variables](https://render.com/docs/environment-variables)
