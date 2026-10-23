# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Escopo: este arquivo cobre `functions/` (backend Firebase). O repositório contém também
> `web/` (frontend React).

## O que é

Backend do Broadcast. Roda como Firebase Cloud Functions em Node 22, TypeScript estrito, na
região `southamerica-east1`. Gerenciado com **npm**.

Há uma function:

| function | gatilho | o que faz |
|---|---|---|
| `dispatchScheduledMessages` | `onSchedule`, a cada minuto | promove mensagens vencidas para `sent` |

Tudo em `firebase-functions` v2 — não há nenhum gatilho v1 no projeto.

## Arquitetura

Camadas:

- **`facades/`** — regra de negócio, por feature (`dispatch/`). É onde a lógica
  mora, e é o que os testes exercitam. Não conhece o formato dos eventos do Firebase.
- **`models/`** — contratos de documento (`*.model.ts`) e os nomes das coleções. Nenhuma
  string de coleção ou de campo solta fora daqui.
- **`functions/`** — adaptadores Firebase, organizados por tipo de gatilho (`pubsub/`).
  São cascas: declaram gatilho, região e fuso, e chamam a facade.
- **`utils/`** — `fix-ts-path.ts`.
- **`firebase-firestore.ts`** — wrapper do firebase-admin com inicialização tardia
  (`getDb()`).
- **`environment.ts`** — configuração num lugar só (região, fuso, teto do batch).

O `src/index.ts` é só o entrypoint, e tudo que `src/functions/index.ts` exporta vira uma
Cloud Function no deploy.

> **`import './utils/fix-ts-path'` é a primeira linha do `index.ts`** e precisa continuar
> sendo. Ele instala a resolução dos path aliases nos caminhos de módulo do Node; qualquer
> import por alias que rode antes dele falha em runtime.

## Path aliases

`tsconfig.json` define `models/*`, `utils/*`, `facades/*`, `functions/*`,
`firebase-firestore` e `environment`. Cada alias precisa existir em **três** lugares:

1. `tsconfig.json` (`paths`) — compilação;
2. `jest.config.js` (`moduleNameMapper`) — testes;
3. `utils/fix-ts-path.ts` — runtime (resolve `./lib` como raiz de módulos).

Ao adicionar um alias, atualize os três. Esquecer um dá erro só em um dos ambientes.

## Configuração

Não há segredo neste projeto — `environment.ts` guarda só configuração de comportamento.

Quando aparecer o primeiro segredo de verdade, o padrão a seguir é: `defineSecret` em
`environment.ts`, leitura tardia (nunca no import — `value()` lança durante a análise do
deploy), agrupado num array exportado, e o grupo anexado ao `secrets: [...]` de cada
function que o consome.

> **Regra de ouro:** se `environment.X` é alcançável no código de uma function, o secret de
> `X` precisa estar no `secrets:` daquela function. Senão a leitura devolve string vazia em
> runtime.

## Firestore

Toda query de leitura do front filtra por `ownerId` e ordena no banco, o que exige índice
composto — declarados em `firestore.indexes.json`, na raiz do repositório.

```bash
npm run deploy:indexes
```

Índice novo precisa ser publicado **antes** do código que o usa; sem ele a query falha em
runtime (o erro traz um link para criar o índice).

## Testes

`npm test` (jest + ts-jest). Teste fica junto do código, como `*.test.ts`, e é excluído do
build por `tsconfig.build.json`.

O Firestore é mockado no nível do `firebase-firestore` (o wrapper do projeto), não do SDK:
é a fronteira que as facades realmente usam, e mockar ali mantém o teste preso ao contrato
do projeto.

## Deploy

```bash
npm run build     # tsc -p tsconfig.build.json
npm run deploy    # firebase deploy --only functions
```

> Nunca cancele um deploy no meio. O CLI publica as functions em lotes; cancelar deixa parte
> na versão nova e parte na antiga. Deixe terminar e publique por cima.

## Commits

Semânticos (commitlint + commitizen na raiz): `feat`, `fix`, `test`, `build`, `perf`,
`style`, `refactor`, `chore`, `raw`.

## Revisões de código

**Toda revisão deve ser escrita em português do Brasil.**
