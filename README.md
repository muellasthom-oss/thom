# Howstore Digital

Loja online de produtos digitais inspirada na estética e experiência da howstore.gg, com painel administrativo completo, integração com Mercado Pago e entrega automatizada de chaves e conteúdos digitais.

## Visão geral

- **Frontend** em React + Vite com TailwindCSS, responsivo e com dark mode elegante.
- **Backend** em Node.js + Express com banco SQLite (Better SQLite3) e autenticação JWT.
- **Pagamentos** via API do Mercado Pago com webhook de confirmação.
- **Painel admin** com gestão de produtos, pedidos, afiliados, promoções, relatórios e personalização de layout.
- **Entrega digital** automatizada após confirmação do pagamento.

## Estrutura do projeto

```
.
├── backend
│   ├── package.json
│   ├── .env.example
│   └── src
│       ├── server.js
│       ├── config
│       ├── controllers
│       ├── middlewares
│       ├── routes
│       ├── services
│       └── utils
└── frontend
    ├── package.json
    ├── vite.config.js
    └── src
        ├── App.jsx
        ├── layouts
        ├── pages
        ├── components
        ├── store
        ├── api
        └── utils
```

## Pré-requisitos

- Node.js 18+
- npm ou pnpm

## Configuração rápida

1. **Instale as dependências**

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

2. **Configure variáveis de ambiente**

   Copie o arquivo `.env.example` na pasta `backend` para `.env` e ajuste as credenciais:

   ```bash
   cp backend/.env.example backend/.env
   ```

   - `MERCADO_PAGO_ACCESS_TOKEN`: token da API.
   - `JWT_SECRET`: segredo dos tokens JWT.
   - Opcionalmente configure SMTP para envio real de e-mails.

3. **Execute os servidores**

   Em terminais separados:

   ```bash
   cd backend
   npm run dev
   ```

   ```bash
   cd frontend
   npm run dev
   ```

   A loja ficará disponível em `http://localhost:5173` com proxy para a API (`http://localhost:4000`).

## Recursos principais

- **Catálogo dinâmico** com destaque para produtos digitais e variações.
- **Carrinho persistente** e checkout integrado ao Mercado Pago.
- **Entrega automática** dos códigos digitais e e-mails transacionais.
- **Painel administrativo seguro** com autenticação JWT e suporte a 2FA.
- **Gestão de afiliados** com controle de comissões e geração de links personalizados.
- **Promoções e cupons** com descontos percentuais ou fixos.
- **Relatórios em tempo real** de vendas, finanças e performance de produtos.
- **Personalização completa** de branding, cores e copy diretamente pelo painel.

## Scripts úteis

### Backend

- `npm run dev`: executa o servidor com nodemon.
- `npm start`: executa o servidor em modo produção.

### Frontend

- `npm run dev`: inicia o Vite em modo desenvolvimento.
- `npm run build`: gera bundle de produção.
- `npm run preview`: pré-visualiza build gerado.

## Próximos passos sugeridos

- Conectar webhooks reais do Mercado Pago no painel.
- Integrar provedor de e-mails (Sendgrid, AWS SES) para notificações transacionais em produção.
- Implementar dashboards adicionais com gráficos.
- Configurar testes automáticos para backend e frontend.

Boa venda! 🚀
