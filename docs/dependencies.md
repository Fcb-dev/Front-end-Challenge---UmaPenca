# Compatibilidade e dependências

O teste exige Vue 2.7. As linhas de Vue Router 3, Vue Test Utils 1 e Storybook 7 são escolhas de compatibilidade. A tipagem de SFCs usa TypeScript 5.3/vue-tsc 1.8; stories são compiladas pelo Storybook separadamente porque seus tipos React podem conflitar com o JSX legado do Vue 2.

Foram aplicadas correções compatíveis em PostCSS (8.5.29), Vite (5.4.21), Storybook (7.6.24) e Vitest (3.2.6). O lockfile fixa o resultado validado.

## Auditoria

`npm audit` ainda identifica alertas na cadeia legada, inclusive severidades altas/críticas em ferramentas de desenvolvimento. A auditoria não deve ser interpretada como zerada. Várias correções sugeridas requerem Storybook 8+, Vue 3, versões recentes do compilador ou outro conjunto de ferramentas.

Na validação desta entrega, `npm audit --omit=dev` reportou um alerta baixo, sem alertas moderados, altos ou críticos nas dependências de execução. Vue 2.7.16 mantém um alerta de ReDoS no parser de templates (GHSA-5j4c-8p2g-v4jx). A aplicação usa templates pré-compilados, não compila templates recebidos e converte conteúdo coletado para texto simples.

Os servidores de desenvolvimento são locais; não são o serviço publicado. O deploy serve o build estático e a API de leitura. Isso delimita a exposição, mas não elimina os alertas da cadeia de ferramentas. Em um produto de longo prazo, a recomendação seria migrar a stack com testes para versões mantidas; aqui essa migração violaria a exigência Vue 2.7.

Não foram usados overrides transitivos arbitrários nem `npm audit fix --force`. Atualizações futuras devem repetir `npm ci`, `npm run check` e os testes E2E antes de atualizar o lockfile.
