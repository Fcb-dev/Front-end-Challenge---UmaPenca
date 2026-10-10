# Histórico de implementação

Cada etapa agrupa uma entrega verificável. O commit usa `tipo(escopo): resumo` e corpo com tópicos de mudanças e validação. Este registro evolui no mesmo commit da etapa; correções relacionadas permanecem agrupadas até a verificação passar.

## 01 — Fundação (`chore(setup)`)

- Base Vue 2.7, TypeScript e Vite com versões fixadas e lockfile.
- Tailwind e fontes locais com tokens da identidade editorial.
- Storybook 7.6 e primeiro componente para verificar integração.
- Scripts de desenvolvimento, API, qualidade, build e documentação.
- Estrutura de Atomic Design iniciada por componentes coesos, expandida conforme as funcionalidades.
- Validação: lint, tipos, build da aplicação e build do Storybook.

## 02 — Coleta e API (`feat(data)`)

- Parser de JSON embutido no HTML público, sem executar scripts externos.
- Coleta limitada, sequencial e rastreável com seed versionado.
- Adapter de preços, modelos, cores, tamanhos e disponibilidade.
- API Express de catálogo, detalhe e saúde; respostas 404 em JSON.
- Regras de enriquecimento e limitações documentadas em `docs/data.md`.
- Validação: testes de parsing/adapter e API HTTP, tipos e lint; coleta real de duas páginas.

## 03 — Catálogo editorial (`feat(catalog)`)

- Identidade creme/carvão/framboesa, cabeçalho, manifesto e layout responsivo.
- Catálogo HTTP com cache de sessão e deduplicação de requisições.
- Filtros combináveis por tipo/cor refletidos na URL e no histórico do navegador.
- Cards com imagens otimizadas, lazy loading, cores e preços em BRL.
- Estados de carregamento, erro recuperável, lista vazia e imagem indisponível.
- Router com rotas de catálogo, produto e página inexistente; detalhe completo na etapa seguinte.
- Validação: testes de filtros e imagens, lint, tipos e build.

## 04 — Produto e sacola (`feat(shop)`)

- Produto com URL direta, carregamento, recuperação de erro e tratamento de 404.
- Seleção de cor/tamanho respeita combinações reais e bloqueia adição incompleta.
- Sacola global com variantes separadas, quantidades, remoção e subtotal em centavos.
- Persistência versionada de IDs/quantidades e revalidação de preços/disponibilidade na API.
- Diálogo nativo com foco modal, Escape, fechamento externo e retorno de foco.
- Stories de produto, seletores e estados da sacola; compatibilidade de VTU 1 documentada no teste.
- Validação: 16 testes unitários/integração e cenários de navegador desktop/mobile, além dos builds.

## 05 — Entrega reproduzível (`chore(delivery)`)

- README completo: requisitos, comandos, ambiente, arquitetura, dados, trade-offs e limitações.
- CI com instalação limpa, lint, tipos, testes, builds e cenários de navegador.
- Documentação de todos os componentes reutilizáveis e template, com fixtures isoladas.
- Correções compatíveis de dependências e registro dos alertas da stack legada.
- Configuração Vercel para frontend/API na mesma origem e Storybook em `/storybook/`.
- Variáveis locais carregadas na API e proxy, favicon e normalização de finais de linha.
- Revisão do adapter para aproveitar descrições reais do campo `info` e atualização do seed.
- E2E aguarda API e frontend separadamente; API sem watch evita falhas de inicialização no runner.
- Validação: instalação limpa com `npm ci`, lint, tipos, 17 testes unitários/integração, builds da aplicação e Storybook e 12 cenários E2E em desktop, celular e tablet.
- Revisão visual dos três tamanhos e verificação do Storybook empacotado em `/storybook/`.
- Deploy externo preparado; publicação e links dependem da conta/projeto da hospedagem.

## 06 — Inicialização no Windows (`fix(dev)`)

- Substituído o watch do CLI tsx pelo watch nativo do Node com loader tsx.
- Correção de inicialização da API quando executada com pipes no Windows, reproduzida ao abrir a prévia final.
- O comando E2E continua usando API sem watch e verificando a saúde dos dois serviços.
- Validação: inicialização via `npm run dev` e consulta HTTP da API através do proxy Vite.

## 07 — Movimento e contornos (`feat(ui)`)

- Sacola com entrada lateral de 360 ms, saída de 280 ms e transição do backdrop.
- Fechamento preserva o modal e bloqueio de rolagem até terminar a animação, restaurando o foco depois.
- Transições interrompidas são canceladas ao alternar o estado ou desmontar o componente.
- Cards com contorno marrom e espessura interna animada no hover/foco, sem deslocamento do layout.
- Preferência de movimento reduzido respeitada na sacola e nos cards.
- Validação: lint, tipos/build e 12 cenários E2E em desktop, celular e tablet; revisão visual dos contornos.
