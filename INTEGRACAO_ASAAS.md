# Integração Asaas - Planejamento do Banco de Dados

## 1. Collections Necessárias

### A) asaas-clientes (nova)
Armazena dados do cliente no Asaas
```
- asaas_customer_id (text) - ID único no Asaas
- user_id_login (text) - FK para usuário Clerk
- nome (text)
- email (text)
- cpf_cnpj (text)
- telefone (text)
- endereco (text)
- numero (text)
- bairro (text)
- cidade (text)
- estado (text)
- cep (text)
- criado_em (datetime)
```

### B) asaas-planos (nova)
Armazena subscriptions ativas
```
- asaas_subscription_id (text) - ID único no Asaas
- asaas_customer_id (text) - FK para asaas-clientes
- user_id_login (text) - FK para usuário
- valor (decimal)
- billing_type (text) - PIX, BOLETO, CREDIT_CARD
- status (text) - ACTIVE, PAUSED, CANCELLED
- proxima_cobranca (date) - nextDueDate
- criado_em (datetime)
- cancelado_em (datetime) - null se ativo
```

### C) asaas-pagamentos (nova)
Armazena histórico de pagamentos/cobranças
```
- asaas_payment_id (text) - ID único no Asaas
- asaas_subscription_id (text) - FK para asaas-planos
- user_id_login (text) - FK para usuário
- valor (decimal)
- status (text) - PENDING, RECEIVED, OVERDUE, CANCELLED
- tipo_cobranca (text) - PIX, BOLETO, CREDIT_CARD
- data_vencimento (date) - dueDate
- data_pagamento (datetime) - confirmedDate (null se pendente)
- url_pagamento (text) - invoiceUrl ou boletoUrl
- criado_em (datetime)
```

### D) Modificar assinadoronline (existente)
Adicionar campos para integração:
```
+ asaas_subscription_id (text) - FK para asaas-planos
+ status_pagamento (text) - PENDING, ACTIVE, CANCELLED
+ proxima_cobranca (date)
+ plano_assinado_em (datetime)
```

---

## 2. Fluxo de Integração

### Usuário Assina (POST /assinar)

```
Frontend → API /assinar
         ↓
Backend cria cliente no Asaas
         ↓
Backend cria subscription no Asaas
         ↓
Backend salva em asaas-clientes
         ↓
Backend salva em asaas-planos
         ↓
Backend atualiza assinadoronline
         ↓
Retorna invoice_url para usuário pagar
```

### Webhook de Pagamento (POST /webhook)

```
Asaas envia PAYMENT_RECEIVED
         ↓
Backend valida assinatura webhook
         ↓
Backend atualiza asaas-pagamentos (confirma)
         ↓
Backend atualiza asaas-planos (status = ACTIVE)
         ↓
Backend atualiza assinadoronline (status_pagamento = ACTIVE)
         ↓
Usuário consegue usar a plataforma
```

### Usuário Consulta Status (GET /subscription/{id})

```
Frontend → GET /subscription/{id}/payments
         ↓
Backend busca em asaas-pagamentos
         ↓
Retorna histórico com status e urls
```

---

## 3. O que Salvar no Banco

### Essencial (nunca perder):
- `asaas_subscription_id` - Identifica subscription no Asaas
- `asaas_customer_id` - Identifica cliente no Asaas
- `user_id_login` - Conecta ao usuário
- `status` - ACTIVE/PAUSED/CANCELLED
- `valor` - Quanto está cobrando
- `proxima_cobranca` - Próxima data

### Auditoria:
- `criado_em` - Quando assinou
- `cancelado_em` - Quando cancela

### Pagamentos (histórico):
- `asaas_payment_id` - Identifica payment no Asaas
- `status` - PENDING/RECEIVED/OVERDUE
- `data_pagamento` - Quando realmente pagou
- `url_pagamento` - Para reenviar se pendente

---

## 4. Mudanças na API Flask

### Rota POST /assinar - Agora salva no Strapi

```python
# 1. Cria cliente no Asaas
cliente = criar_cliente_asaas(...)

# 2. Cria subscription no Asaas
subscription = criar_subscription_asaas(...)

# 3. NOVO: Salva em asaas-clientes (Strapi)
criar_asaas_cliente_strapi(cliente.id, user_id_login, ...)

# 4. NOVO: Salva em asaas-planos (Strapi)
criar_asaas_plano_strapi(subscription.id, cliente.id, user_id_login, valor, ...)

# 5. NOVO: Atualiza assinadoronline
atualizar_assinadoronline_strapi(user_id_login, subscription.id, "PENDING")

# Retorna subscription_id para frontend
```

### Rota POST /webhook - Agora confirma no Strapi

```python
# 1. Valida assinatura webhook
validar_webhook_asaas(payload)

# 2. NOVO: Cria registro em asaas-pagamentos
criar_asaas_pagamento_strapi(payment_id, subscription_id, "RECEIVED", data_pagamento, ...)

# 3. NOVO: Atualiza asaas-planos (status = ACTIVE)
atualizar_asaas_plano_strapi(subscription_id, "ACTIVE")

# 4. NOVO: Atualiza assinadoronline (status = ACTIVE)
atualizar_assinadoronline_strapi(user_id_login, "ACTIVE")
```

---

## 5. Relacionamentos (ERD Simplificado)

```
┌─────────────────────────┐
│   asaas-clientes        │
│─────────────────────────│
│ asaas_customer_id (PK)  │
│ user_id_login (FK)      │
│ nome, email, cpf...     │
└───────────┬─────────────┘
            │ 1:N
            │
┌───────────▼──────────────────┐
│   asaas-planos               │
│──────────────────────────────│
│ asaas_subscription_id (PK)   │
│ asaas_customer_id (FK)       │
│ user_id_login (FK)           │
│ valor, status, proxima...    │
└───────────┬──────────────────┘
            │ 1:N
            │
┌───────────▼──────────────────┐
│   asaas-pagamentos           │
│──────────────────────────────│
│ asaas_payment_id (PK)        │
│ asaas_subscription_id (FK)   │
│ user_id_login (FK)           │
│ valor, status, url...        │
└──────────────────────────────┘

┌─────────────────────────┐
│   assinadoronline       │
│─────────────────────────│
│ id_strapi (PK)          │
│ user_id_login (FK)      │
│ asaas_subscription_id ──→ (link para asaas-planos)
│ status_pagamento (NOVO) │
└─────────────────────────┘
```

---

## 6. Sequência Passo a Passo

### Passo 1: Criar Collections no Strapi
- ✅ asaas-clientes
- ✅ asaas-planos
- ✅ asaas-pagamentos
- ✅ Atualizar assinadoronline com novos campos

### Passo 2: Implementar Integração Strapi na API Flask
- ✅ Enviar dados para asaas-clientes após criar cliente
- ✅ Enviar dados para asaas-planos após criar subscription
- ✅ Atualizar assinadoronline com subscription_id e status
- ✅ No webhook: criar registro em asaas-pagamentos
- ✅ No webhook: atualizar status do plano

### Passo 3: Testar Fluxo Completo
- ✅ Assinar → salva no Strapi
- ✅ Pagar → webhook atualiza Strapi
- ✅ Consultar status → lê do Strapi

---

## 7. Benefícios

| Problema | Solução |
|----------|---------|
| Perder track de quem pagou | asaas-pagamentos + audita |
| Não saber quem tem plano ativo | asaas-planos + status |
| Duplicar clientes no Asaas | asaas-clientes + deduplica |
| Sair do ar e perder dados | Tudo sincronizado no Strapi |
| Não saber próxima cobrança | proxima_cobranca registrada |
