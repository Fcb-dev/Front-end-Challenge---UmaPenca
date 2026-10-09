# Penca — ideias que vestem

Mini loja do teste técnico Uma Penca. Vue 2.7, TypeScript e Atomic Design, com identidade editorial e documentação de componentes em Storybook.

## Desenvolvimento

Use Node 22 (Node 24 também aceito) e npm. As versões exatas estão no `package.json` e `package-lock.json`.

```sh
npm ci
npm run dev
```

Frontend: http://127.0.0.1:5173. API: http://127.0.0.1:3001/api/health.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run storybook
npm run build-storybook
```

`npm run preview` serve o build do frontend; execute `npm start` em outro terminal para a API. `.env.example` documenta a URL da API e a porta; os padrões locais dispensam configuração.

## Arquitetura e decisões

- Interface organizada em atoms, molecules, organisms, templates e pages.
- Serviços HTTP, regras de domínio e estado permanecem separados da interface.
- Vue 2.7 é obrigatório no desafio; Storybook 7.6 e Vue Test Utils 1 são as linhas compatíveis.
- TypeScript 5.3 e vue-tsc 1.8 são fixados juntos para validar SFCs do Vue 2.
- Tailwind 3 atende à biblioteca CSS exigida; estilos próprios e fontes locais constroem a identidade.
- Código de apresentação recebe propriedades e emite eventos, permitindo documentação isolada.

## Evolução

Veja [o histórico de implementação](docs/implementation.md) para os tópicos entregues e a validação de cada etapa. A fundação está em implementação; catálogo, coleta, produto e carrinho serão acrescentados nos próximos commits.
