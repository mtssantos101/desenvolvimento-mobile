# Sports Hub — Frontend (Vite + React)

Aplicação frontend simples em React (Vite) que exibe um catálogo de produtos, tela de detalhes, fluxo de checkout com validação e persistência de pedidos em `localStorage`.

## Principais funcionalidades

- Lista de produtos em grade (aplicação principal em `src/App.jsx`).
- Tela de detalhes do produto.
- Checkout com validações básicas (nome, CPF, número do cartão, CCV) e cupom de 10% aplicado.
- Persistência de pedidos em `localStorage` e página "Meus pedidos".
- Ativos estáticos (imagens, `favicon.svg`) em `public/`.

## Pré-requisitos

- Node.js (versão 16+ recomendada)
- npm

## Como rodar (desenvolvimento)

1. Abra um terminal e navegue até a pasta do frontend:

```bash
cd app
```

2. Instale dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento (Vite):

```bash
npm run dev
```

4. Abra o endereço mostrado no terminal (por padrão http://localhost:5173).

## Comandos úteis

- `npm run dev` — inicia o servidor de desenvolvimento.
- `npm run build` — gera a build para produção.
- `npm run preview` — executa um servidor local para visualizar a build.

## Estrutura relevante

- `src/` — código-fonte React (`src/App.jsx` contém a maior parte do app).
- `public/` — ativos estáticos (imagens dos produtos, `favicon.svg`).
- `index.html` — ponto de entrada HTML para Vite.

## Observações / Troubleshooting

- As imagens de produtos devem estar em `public/` e os paths usados no código começam com `/` (ex.: `/camisa-brasil-azul-preta.webp`). Se a imagem não aparecer:
	- Verifique que o arquivo existe em `app/public/` com o mesmo nome.
	- Confirme que o servidor de desenvolvimento está rodando (`npm run dev`).
	- No navegador, abra o DevTools → Network para ver se o arquivo retorna 404.

- Os pedidos são salvos no `localStorage` do navegador sob a chave `des-mobile-orders`. Para limpar dados de teste, apague essa chave nas Ferramentas de Desenvolvedor.

- Se preferir usar outra porta, passe `--port` para Vite ao iniciar (`npm run dev -- --port 3000`).

## Contato

Se quiser que eu adicione instruções adicionais (scripts de lint, testes, CI/CD, ou deploy), diga o que deseja incluir.

---
Arquivo criado/atualizado automaticamente pelo assistente.
