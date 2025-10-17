# THOM Digital HTML

Projeto convertido para um único arquivo `index.html` que entrega uma vitrine de produtos digitais com painel
administrativo, busca, filtros e integração opcional com o checkout do Mercado Pago.

## Como testar

1. Abra o arquivo `index.html` diretamente no navegador (arraste-o para uma aba ou use `Arquivo > Abrir`).
2. Use a aba **Vitrine** para explorar o catálogo. A busca e o filtro por categoria funcionam instantaneamente.
3. Acesse a aba **Painel admin** e informe a senha padrão `admin123` para liberar o gerenciamento dos itens.
4. Cadastre, edite ou remova produtos. Os dados ficam salvos no `localStorage`, então as alterações permanecem ao
   recarregar a página.

## Configuração do Mercado Pago (opcional)

Edite o objeto `CONFIG` localizado no final do arquivo `index.html`:

```js
const CONFIG = {
  mercadoPagoPublicKey: "SEU_PUBLIC_KEY", // ex.: TEST-... fornecido pelo Mercado Pago
  checkoutPreferenceEndpoint: "https://seu-endpoint.com/preferences", // deve retornar { preferenceId: "..." }
  adminPassword: "admin123",
};
```

- **`mercadoPagoPublicKey`**: chave pública da sua aplicação no Mercado Pago. Ela é necessária para inicializar o SDK.
- **`checkoutPreferenceEndpoint`**: URL que deve receber um `POST` com `{ productId }` e devolver o `preferenceId`
  criado pela sua API. Pode ser um endpoint hospedado em qualquer backend.

Sem preencher esses valores, o botão **Comprar com Mercado Pago** exibirá um aviso solicitando a configuração.

## Recursos inclusos

- Catálogo estilizado com tema escuro, busca, filtro por categorias e contadores dinâmicos.
- Botões de compra que integram com o SDK oficial do Mercado Pago quando configurados.
- Painel administrativo com autenticação por senha, cadastro, edição e exclusão de produtos.
- Persistência em `localStorage` para simular um backend mínimo e permitir testes rápidos.

## Personalização

Todos os estilos (CSS), dados iniciais e scripts JavaScript estão concentrados dentro de `index.html`, facilitando o
ajuste em qualquer editor ou hospedagem estática.

## Licença

Distribuído sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
