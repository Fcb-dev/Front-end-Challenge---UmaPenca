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
