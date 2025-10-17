# THOM Store

Aplicação Next.js que entrega uma vitrine moderna de produtos digitais com integração ao checkout do Mercado Pago e
painel administrativo para cadastrar, editar e remover itens.

## Requisitos

- Node.js 18+
- Conta no Mercado Pago com um token de acesso para criar preferências de pagamento.

## Configuração

1. Copie o arquivo `.env.example` para `.env.local` e configure as variáveis de ambiente:

```bash
cp .env.example .env.local
```

Variáveis disponíveis:

- `MERCADO_PAGO_ACCESS_TOKEN`: token de acesso gerado no painel do Mercado Pago.
- `ADMIN_PASSWORD`: senha utilizada para autenticar no painel administrativo.
- `NEXT_PUBLIC_BASE_URL` (opcional): URL pública da aplicação, utilizada para montar os links de retorno do checkout.

2. Instale as dependências e rode o projeto em modo de desenvolvimento:

```bash
npm install
npm run dev
```

3. Acesse `http://localhost:3000` para visualizar a vitrine e `http://localhost:3000/admin` para o painel administrativo.

## Fluxo do checkout

- A lista de produtos é carregada do arquivo `data/products.json`.
- Ao clicar em **Comprar agora**, uma preferência é criada via API do Mercado Pago e o usuário é redirecionado para o
  `init_point` retornado pela API.
- Após o pagamento, o cliente retorna para as páginas `/success`, `/failure` ou `/pending` de acordo com o status.

## Painel administrativo

- O painel exige a senha definida em `ADMIN_PASSWORD`.
- Permite cadastrar, editar e remover produtos com informações de preço, categoria, tags, imagem e link de download.
- Os dados são persistidos no arquivo `data/products.json`, facilitando o deploy em ambientes simples.

## Estrutura de dados

Cada produto segue o formato:

```json
{
  "id": "steam-points",
  "title": "Pontos Steam 5000",
  "description": "Entrega automática com código internacional válido.",
  "price": 89.0,
  "currency": "R$",
  "imageUrl": "https://...",
  "downloadUrl": "https://...",
  "category": "Jogos",
  "tags": ["Steam", "Gift Card"],
  "available": true
}
```

## Scripts

- `npm run dev`: inicia o servidor Next.js em modo desenvolvimento.
- `npm run build`: gera a versão de produção.
- `npm start`: inicia o servidor Next.js em modo produção (após `npm run build`).

## Licença

Distribuído sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
