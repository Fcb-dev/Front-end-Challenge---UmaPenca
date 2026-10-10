# Coleta e contrato de dados

Execute `npm run scrape` para duas páginas ou `npm run scrape -- --pages=1`. O limite rígido é cinco páginas. O coletor usa requisições sequenciais, intervalo mínimo de 1,1 segundo e timeout de 20 segundos. O navegador da loja nunca faz scraping.

1. Ler HTML público de `/loja/?page=N` e extrair o JSON atribuído a `window.vueInitialData`.
2. Deduplicar produtos por ID e visitar apenas detalhes do domínio `umapenca.com`. Links de lojas em domínios próprios são registrados como ignorados.
3. Extrair `window.initialScope.ELASTIC_PRODUCT`, sem executar código recebido. Somente os campos de catálogo necessários são persistidos; o objeto de contexto completo do site não é salvo.
4. Normalizar e gravar `data/products.json` por arquivo temporário e renomeação. Uma listagem inválida ou coleta sem produtos não sobrescreve o seed anterior.

## Normalização

- Preços em centavos inteiros; descrição e nomes convertidos a texto simples.
- Cada produto usa o modelo da imagem de capa, ou o primeiro modelo disponível. A escolha é registrada em `model`; variantes de outros modelos são descartadas para manter o fluxo em cor/tamanho.
- Disponibilidade real respeita estoque virtual ou quantidade positiva. Não se infere estoque físico.
- Imagens e cores de variantes são preservadas quando disponíveis.
- Quando faltam variantes: cores do catálogo; se ausentes, “Única”. Adultos recebem P/M/G/GG, infantis 4/6/8/10/12, acessórios sem tamanho. São opções demonstrativas determinísticas, identificadas em `enrichedFields`.
- Descrição individual tem prioridade; quando ausente, o campo `info` fornece a descrição real do modelo. Se ambos faltarem, recebe aviso explícito. Não se inventam propriedades comerciais.
- Falhas por produto ficam em `skipped`; data, páginas e URL da coleta permanecem no seed.

## API

- `GET /api/products`: `{ products, collectedAt }`.
- `GET /api/products/:id`: produto, ou 404 com `{ message }`.
- `GET /api/health`: estado e quantidade de produtos.

Tipos em `shared/catalog.ts`. A API é de leitura e usa o seed versionado. Uma atualização do snapshot exige executar a coleta e reiniciar/publicar a API. A execução local é independente da disponibilidade do site original, exceto pelas imagens remotas.
