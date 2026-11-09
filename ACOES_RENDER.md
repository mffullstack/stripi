# 🚀 AÇÕES IMEDIATAS NO RENDER

## ⏱️ Tempo Total: ~30 minutos

---

## PASSO 1: Gerar Chaves de Segurança (5 min)

Abra seu terminal e execute 4 vezes:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Resultado esperado:**
```
kf8Jk2Lq+5mP9xW3nY6bZ1vQ8cD3eF7gH9j0kL2mN4
aB5cD7eF9gH1iJ3kL5mN7oP9qR1sT3uV5wX7yZ9aB
...
```

Copie as **4 chaves geradas**.

---

## PASSO 2: Obter Credenciais do Banco de Dados (5 min)

### Opção A: Usar Neon (Recomendado - Gratuito)

1. Vá para https://neon.tech
2. Crie conta gratuita
3. Crie um novo projeto
4. Copie a **Connection String**:
   ```
   postgresql://<USER>:<PASSWORD>@<HOST>:5432/<DATABASE>?sslmode=require
   ```

Extraia os dados:
```
DATABASE_HOST = host.neon.tech
DATABASE_PORT = 5432
DATABASE_NAME = database
DATABASE_USERNAME = user
DATABASE_PASSWORD = <configure-in-render>
DATABASE_SCHEMA = public
```

### Opção B: Usar outro PostgreSQL
Use as credenciais do seu provedor.

---

## PASSO 3: Configurar Variáveis no Render (10 min)

1. **Acesse:** https://dashboard.render.com
2. **Clique** no seu Web Service `stripi-uz7v`
3. **Clique** na aba **Environment**
4. **Clique** em **Add Environment Variable**

### Adicione estas 11 variáveis:

```
DATABASE_HOST=neon-host.neon.tech
DATABASE_PORT=5432
DATABASE_NAME=neondb
DATABASE_USERNAME=neon_user
DATABASE_PASSWORD=<configure-in-render>
DATABASE_SCHEMA=public

APP_KEYS=<configure-in-render>
ADMIN_JWT_SECRET=<configure-in-render>
API_TOKEN_SALT=<configure-in-render>
TRANSFER_TOKEN_SALT=<configure-in-render>
ENCRYPTION_KEY=<configure-in-render>
```

**Substitua:**
- `neon-host.neon.tech` → seu host real
- `neon_user` → seu usuário real
- `your-neon-password` → sua senha real
- `key1,key2` → copie 2 das 4 chaves geradas no Passo 1
- `chave-gerada-1` → copie uma chave diferente
- `chave-gerada-2` → copie uma chave diferente
- etc.

---

## PASSO 4: Deploy (5 min)

### Opção A: Deploy Automático (Recomendado)
1. No seu terminal local:
   ```bash
   git add .
   git commit -m "Fix: Dockerfile production + Asaas content types"
   git push origin main
   ```
2. Render detecta automaticamente e faz deploy

### Opção B: Redeploy Manual
1. Painel Render → seu serviço
2. Clique em **Redeploy**
3. Aguarde 5-10 minutos

---

## PASSO 5: Verificar (2 min)

### Acessar Painel Admin
```
https://stripi-uz7v.onrender.com/admin
```

### Esperado:
- ✅ Página de login carrega (não tela preta)
- ✅ Crie usuário admin (primeira execução)
- ✅ Content Manager mostra 3 collections Asaas:
  - asaas-cliente ✅
  - asaas-plano ✅
  - asaas-pagamento ✅

---

## 🎯 CHECKLIST PRÉ-DEPLOYMENT

Antes de fazer push ao GitHub:

- [ ] Rodei `git status` e não há arquivos não commitados
- [ ] Gerei 4 chaves de segurança
- [ ] Tenho as credenciais do banco PostgreSQL
- [ ] Configurei as 11 variáveis no Render
- [ ] Dockerfile foi atualizado (NODE_ENV=production)
- [ ] Content Types Asaas estão em singular

---

## ⚠️ SE DER ERRO

### Erro: Tela Preta
**Solução:** Espere 3-5 minutos, Strapi está compilando

### Erro: Cannot connect to database
**Solução:** Verifique DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD

### Erro: Port not detected
**Solução:** Verifique se NODE_ENV=production está configurado

### Erro: Admin JWT Secret not found
**Solução:** Verifique se ADMIN_JWT_SECRET está nas variáveis

---

## 📞 SUPORTE

Se tiver dúvidas:
1. Leia `RENDER_ENV_SETUP.md` para mais detalhes
2. Leia `ANALISE_E_CORRECOES.md` para entender os problemas
3. Verifique logs no Render: Logs → Live tail

---

**Status:** ✅ Pronto para deploy
**Ultima atualização:** 09 de Novembro de 2026
