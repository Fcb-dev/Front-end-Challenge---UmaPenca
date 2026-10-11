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

## 08 — Cards sem bordas (`fix(ui)`)

- Removidos contorno marrom, espessura animada e sombra dos cards a pedido do usuário.
- Restaurado o espaçamento original dos textos; mantidos hover da imagem e movimento reduzido.
- Animações de abertura e fechamento da sacola preservadas.
- Validação: lint do componente e revisão do diff.

## 09 — Transição com movimento reduzido (`fix(cart)`)

- Diagnóstico no navegador da prévia confirmou `prefers-reduced-motion: reduce`, que zerava a duração do carrinho.
- Substituída a abertura instantânea por fade de 180 ms nesse modo, sem deslocamento lateral; backdrop acompanha a transição.
- Deslizamento padrão ajustado para 420 ms na entrada e 340 ms na saída.
- Validação: lint, tipos, 12 cenários E2E existentes e 3 regressões de movimento reduzido, incluindo fechamento diferido e retorno de foco.

## 10 — Deslizamento explícito da sacola (`fix(cart)`)

- A pedido do usuário, o carrinho passa a deslizar também quando o navegador informa movimento reduzido; removida a substituição por fade.
- Entrada, saída e backdrop sincronizados em 450 ms com aceleração e desaceleração suaves.
- Verificação na própria prévia confirmou posições intermediárias na entrada e saída, mantendo o diálogo aberto até terminar.
- Regressão atualizada para exigir deslocamento lateral também com movimento reduzido.

## 11 — Filtros com identidade visual (`feat(filters)`)

- Componente reutilizável FilterSelect na camada molecules substitui os selects nativos.
- Menu creme, contornos discretos, seleção em framboesa, indicador de seleção e seta animada.
- Navegação por setas, Home/End, busca digitada, Enter, Escape e Tab; fechamento externo e estados ARIA explícitos para Vue 2.
- Mantidos filtros combinados e persistência na URL; exemplos interativos adicionados ao Storybook.
- Revisão visual na prévia e cobertura de teclado, clique externo e seleção por mouse nos três tamanhos de tela.
- Validação: lint, tipos, builds da aplicação e Storybook, 17 testes unitários/integração e 18 cenários E2E.

## 12 — Identidade Bossa e refinamentos visuais (`feat(brand)`)

- Nome Bossa no cabeçalho, títulos das páginas, favicon, metadados, pacote e documentação.
- Texto principal atualizado para “Vista suas ideias. Leve sua bossa.” e manifesto ajustado à marca.
- Referências à Uma Penca preservadas como origem dos produtos e do teste; chave legada da sacola mantida para não perder itens salvos.
- Incluídos os ajustes visuais aprovados durante a experimentação: cards flutuantes sem borda, elevação suave de 600 ms sem zoom da imagem e dropdowns com transição de 300 ms.
- Documentação do Storybook alinhada às decisões atuais de movimento do protótipo.
- Cursor pixelado autoral em framboesa, contorno ameixa e creme, inspirado na referência enviada; aplicado em dispositivos com mouse, preservando cursores de texto e indisponibilidade.
- Validação: lint, tipos, 17 testes unitários/integração, 18 cenários E2E e builds da aplicação e Storybook.

## 13 — Tipografia autoral (`feat(brand)`)

- Chocolate Covered Raindrops aplicada à marca, títulos e destaques; Inter preservada em textos longos e controles para legibilidade.
- Pesos regular e bold servidos localmente, sem dependência de rede.
- Licença e crédito da autora Vanessa Bays incluídos junto aos arquivos da fonte e registrados na documentação.
