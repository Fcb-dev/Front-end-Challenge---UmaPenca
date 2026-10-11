# Bossa — ideias que vestem

Bossa é a mini loja do teste técnico Uma Penca: catálogo real coletado por scraping, filtros combináveis, página de produto e sacola lateral persistente. Identidade editorial autoral, responsiva, com Atomic Design e Storybook. **Vista suas ideias. Leve sua bossa.**

- **Aplicação publicada:** https://bossa-zeta.vercel.app/
- **Storybook:** https://bossa-zeta.vercel.app/storybook/
- **API (Catálogo):** https://bossa-zeta.vercel.app/api/products

## Rodar em uma máquina limpa

Pré-requisitos: **Node 22** (arquivo `.nvmrc`) ou Node 24 e npm. Não é necessário banco de dados, conta de serviço ou executar scraping para iniciar: o seed já está versionado.

```sh
git clone https://github.com/Fcb-dev/Front-end-Challenge---UmaPenca.git
cd Front-end-Challenge---UmaPenca
npm ci
npm run dev
```

- Loja: http://127.0.0.1:5173
- API: http://127.0.0.1:3001/api/products
- Saúde: http://127.0.0.1:3001/api/health

O comando inicia Vite e Express juntos. Encerre com Ctrl+C.

## Comandos

| Comando                              | Resultado                                               |
| ------------------------------------ | ------------------------------------------------------- |
| `npm run dev`                        | Frontend e API em desenvolvimento                       |
| `npm run build`                      | Verifica tipos e gera a aplicação em `dist/`            |
| `npm start`                          | Inicia somente a API do seed                            |
| `npm run preview`                    | Serve o build local; mantenha a API em outro terminal   |
| `npm run storybook`                  | Documentação interativa em http://localhost:6006        |
| `npm run build-storybook`            | Gera a documentação estática em `storybook-static/`     |
| `npm run build:deploy`               | Gera app e documentação em `dist/storybook/`            |
| `npm run lint` / `npm run typecheck` | Qualidade e tipos, incluindo SFCs                       |
| `npm test`                           | Testes de regras, componentes, parser e API HTTP        |
| `npm run test:e2e`                   | Fluxos de navegador; inicia os servidores se necessário |
| `npm run check`                      | Lint, tipos, testes e ambos os builds                   |
| `npm run scrape -- --pages=2`        | Atualiza o snapshot da fonte, respeitando os limites    |

Antes do primeiro E2E: `npx playwright install chromium`. Em Linux/CI, use `npx playwright install --with-deps chromium`.

## Ambiente

A configuração padrão dispensa `.env`. Se necessário, copie `.env.example` para `.env`.

| Variável       | Padrão | Uso                                                  |
| -------------- | ------ | ---------------------------------------------------- |
| `PORT`         | `3001` | Porta da API local e destino do proxy Vite           |
| `VITE_API_URL` | `/api` | Base HTTP consumida pelo frontend, definida no build |

Não há segredos no projeto. O deploy proposto mantém aplicação e API na mesma origem.

## Stack e compatibilidade

- Vue **2.7.16**, Composition API nativa, Vue Router **3.6.5**.
- TypeScript **5.3.3**, vue-tsc **1.8.27**, Vite **5.4.21**.
- Tailwind **3.4.17**, Inter e Nunito locais, servidas por `@fontsource`.
- Storybook **7.6.24**, última linha utilizada com suporte ao Vue 2.
- Vitest **3.2.6**, Vue Test Utils **1.3.6**, Playwright **1.56.1**.
- Express **5.1.0**, Cheerio e tsx na coleta/API.

Versões exatas e transitivas estão no lockfile. Vue 2.7 é uma exigência do teste. Não atualizar isoladamente Vue, Router, Storybook ou Vue Test Utils para suas versões mais recentes: isso rompe a compatibilidade da stack.

## Arquitetura

```text
src/
  components/atoms/        elementos básicos e acessíveis
  components/molecules/    combinações de controles e cards
  components/organisms/    regiões completas da interface
  templates/               layout compartilhado
  pages/                   rotas, carregamento e composição
  composables/             estado e coordenação
  domain/                  regras puras e cálculos
  services/                acesso HTTP e cache
  router/                  rotas e histórico
  styles/                  tokens e estilos globais
shared/                    contratos de produtos e variantes
scripts/scraping/          coleta, parser e adapter
server/                    API Express local e fábrica testável
api/                       entrada serverless para deploy
data/                      seed com origem e relatório de coleta
tests/                     integração, componentes e E2E
```

Atomic Design organiza a interface, mantendo HTTP, persistência e regras fora dos componentes visuais. A documentação de cada componente usa stories adjacentes e fixtures isoladas; a aplicação consome exclusivamente a API.

A sacola usa reatividade nativa do Vue, com fábrica de estado testável. Persistimos apenas IDs e quantidades; os preços e a disponibilidade são conferidos novamente na API após recarregar. Quantidades vão de 1 a 99; remoção é explícita. Mesma variante soma quantidade; variantes ou produtos diferentes são linhas distintas.

## Dados e API

O snapshot contém **50 produtos de 9 tipos**, coletados de duas páginas da [vitrine Uma Penca](https://umapenca.com/loja/). Há 22 registros ignorados, com motivos no seed: lojas em domínios externos ou páginas sem a estrutura de detalhe esperada.

A coleta lê o HTML e extrai JSON estruturado sem executar scripts do site. O intervalo mínimo é 1,1 segundo, com até cinco páginas de listagem. O frontend nunca coleta dados em tempo real. Uma falha que impeça uma coleta válida preserva o seed anterior.

Descrição, cores, tamanhos, disponibilidade e preços vêm dos detalhes quando presentes. Na ausência desses dados na fonte, o adapter aplica **enriquecimento determinístico**, devidamente registrado no campo `enrichedFields`:

- **Tamanhos:** vestuário adulto sem tamanho recebe `['P', 'M', 'G', 'GG']`; vestuário infantil recebe `['4', '6', '8', '10', '12']`; itens que não são roupas (canecas, posters, bottons) ficam sem tamanho (`null`).
- **Cores:** aproveita as amostras de tecidos da fonte; se ausentes, adota a cor determinística `"Única"` com hex `#D7D1C6`.
- **Descrições:** prioriza o texto individual; caso falte, utiliza o campo `info` do modelo original da peça.

O catálogo demonstra um modelo por produto, escolhido pela capa. Consulte [as regras completas e contratos](docs/data.md).

| Endpoint                | Resposta                        |
| ----------------------- | ------------------------------- |
| `GET /api/products`     | `{ products, collectedAt }`     |
| `GET /api/products/:id` | Produto ou 404 JSON             |
| `GET /api/health`       | Estado e quantidade de produtos |

## Experiência e decisões

- Paleta creme, carvão e framboesa, inspirada no protagonismo das fotos e amostras de cor da referência, com composição editorial própria.
- Tipo e cor se combinam por AND e ficam na query string; recarregar e navegar pelo histórico preserva a busca.
- Catálogo pequeno filtrado localmente após uma requisição, com cache de sessão e deduplicação.
- Loading, erro com tentativa, vazio, produto ausente e imagem indisponível têm tratamentos próprios.
- Produto tem URL direta, seleção obrigatória das variações aplicáveis e imagem/preço da variante.
- Drawer nativo acessível nas duas páginas, com Escape, foco modal e retorno de foco.
- Cabeçalho fixo, atalho com rolagem suave para a coleção e botão flutuante de retorno ao topo.
- Adição rápida no card adiciona produtos de variante única diretamente ou abre modal acessível para escolha de cor e tamanho sem sair do catálogo; a prévia de cores expande no hover para revelar as opções.
- Imagens com dimensões explícitas, otimização Imgix e lazy loading abaixo da primeira dobra.
- Fontes locais; rota de produto carregada separadamente; regras monetárias usam centavos inteiros.

## Verificação

Os testes cobrem parsing, preço brasileiro, enriquecimento, disponibilidade, filtros combinados, regras/persistência da sacola, bloqueio de compra e respostas HTTP. O E2E cobre URL direta, busca compartilhada, histórico, falha e recuperação, variantes, quantidades, subtotal, reload, remoção, 404 e armazenamento corrompido.

A CI em `.github/workflows/quality.yml` executa instalação limpa, verificações, builds e E2E. Relatórios de falhas ficam disponíveis como artefatos da execução. A documentação do Storybook também é compilada, evitando stories quebradas silenciosamente.

## Deploy

- **Aplicação:** https://bossa-zeta.vercel.app/
- **Storybook:** https://bossa-zeta.vercel.app/storybook/
- **API (Catálogo):** https://bossa-zeta.vercel.app/api/products
- **API (Saúde):** https://bossa-zeta.vercel.app/api/health
- **Repositório:** [Fcb-dev/Front-end-Challenge---UmaPenca](https://github.com/Fcb-dev/Front-end-Challenge---UmaPenca)

A configuração em `vercel.json` prepara **um projeto Vercel** com frontend, API própria e Storybook em `/storybook/`. Essa simplificação substitui os três projetos inicialmente propostos, reduzindo configuração, CORS e dependência de múltiplas URLs.

1. Importar o repositório na Vercel com Node 22.
2. Usar `npm ci`, build `npm run build:deploy` e saída `dist`.
3. Manter `VITE_API_URL=/api`; a função em `api/index.ts` utiliza o mesmo Express e seed.
4. Validar `/api/health`, `/produto/431589`, uma URL filtrada e `/storybook/` no endereço publicado.

**Status:** Publicado e verificado na Vercel em https://bossa-zeta.vercel.app/.

## Limitações e próximos passos

- Sem autenticação, checkout, pagamentos, frete ou administração: não fazem parte do escopo.
- O snapshot não representa estoque/preço em tempo real. Imagens dependem do CDN da fonte e têm fallback visual.
- Apenas um modelo por produto; uma loja real precisaria modelar também mudanças de modelagem, produção e regras comerciais.
- O catálogo inteiro é adequado ao volume limitado; com mais dados, mover filtros/paginação para a API.
- Vue 2 e parte do ecossistema estão fora de manutenção. `npm audit` ainda aponta alertas na cadeia legada; consultar [a avaliação de dependências](docs/dependencies.md). Não foi usado `audit fix --force`, que migraria requisitos obrigatórios.
- Com mais tempo: ampliar cenários de acessibilidade com leitores de tela, estabelecer regressão visual e validar a publicação em ambiente real.

## Créditos tipográficos

A interface utiliza a família Nunito, disponibilizada localmente pelo pacote `@fontsource/nunito`.

## Histórico de implementação

Cada commit representa uma etapa funcional ou estrutural, com corpo em tópicos e validações. Veja [o histórico detalhado](docs/implementation.md).
