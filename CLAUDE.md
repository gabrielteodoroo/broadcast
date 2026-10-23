# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Este é o CLAUDE.md raiz do repositório Broadcast. Cada subpacote tem o seu, com detalhes:
> veja `functions/CLAUDE.md` (backend) e `web/CLAUDE.md` (frontend).
> **Leia o CLAUDE.md do subpacote em que for trabalhar.**

## O que é

Broadcast é um SaaS multi-tenant de disparo de mensagens (o envio é simulado — nada sai de
fato). Tudo roda no Firebase: Cloud Functions (backend) + Hosting (frontend SPA).

A arquitetura é em camadas, com convenções fixas de nome de arquivo, tooling e leitura de
dados por RxJS. O detalhe de cada camada está nos `CLAUDE.md` de `web/` e de `functions/`.

## Estrutura

O repositório raiz não é um workspace — cada subpasta gerencia suas próprias dependências e
tem seu próprio `package.json`. Os dois subpacotes usam **npm** (Node 22.22.0, `.nvmrc`).

- **`functions/`** — backend. Firebase Cloud Functions, Node 22, TypeScript estrito, região
  `southamerica-east1`. Camadas: `facades/` (regra de negócio), `models/` (contratos de
  documento), `functions/` (adaptadores Firebase, por tipo de gatilho: `pubsub/`),
  `utils/`. Path aliases definidos em três lugares (tsconfig, jest, `utils/fix-ts-path`).
- **`web/`** — frontend SPA. React 19 + TypeScript + Vite, MUI v9, TanStack Query, Jotai e
  **RxJS** para os dados em tempo real do Firestore. Estrutura: `core/` (firebase, hooks,
  rxjs, utils) e `app/apps/<feature>/` com `*.model.ts` + `*.facade.ts` + telas.
- **raiz** — apenas tooling compartilhado: prettier, eslint, commitlint/commitizen,
  `firebase.json`, `.firebaserc`, regras e índices do Firestore.

## Como os dados chegam na tela (web)

É o ponto onde este projeto mais mudou em relação ao original, e o mais importante de
entender antes de mexer:

```
Firestore (onSnapshot)
   ↓  core/firebase/rxfire.ts         embrulha o callback num Observable
   ↓  app/apps/<feature>/*.model.ts   tipo do documento + streams (`*$`) + escritas
   ↓  .pipe(map, combineLatest, …)    transformação, ainda sem React
   ↓  core/hooks/useObservableQuery   assina, deduplica por queryKey, cancela no desmonte
   ↓  app/apps/<feature>/*.facade.ts  junta dados + estado de UI (atoms jotai)
   ↓  componente
```

O componente nunca fala com o model direto, e **nada** chama `onSnapshot` fora do
`core/firebase/rxfire.ts`. Assinatura sem cancelamento num listener do Firestore é vazamento
de memória *e* leitura cobrada.

## Modelo de dados

- `connections` — `{ name, ownerId, createdAt }`
- `contacts` — `{ name, phone, ownerId, connectionId, createdAt }`
- `messages` — `{ body, ownerId, connectionId, contactIds[], status, scheduledAt, sentAt, createdAt }`

`messages.status` é `scheduled | sent`. A function `dispatchScheduledMessages` roda a cada
minuto, pega `status == 'scheduled'` com `scheduledAt <= now` e promove para `sent`.

Toda query de leitura filtra por `ownerId` e ordena no banco (`orderBy`), o que exige índice
composto — ver `firestore.indexes.json`. Índice novo exige deploy
(`npm --prefix functions run deploy:indexes`); sem ele a query falha em runtime com link
para criar o índice.

## Convenções

- Arquivos em **kebab-case**; exceção: hooks em `**/hooks/**` ficam em camelCase começando
  por `use`. As duas regras são impostas pelo eslint (`validate-filename` / `check-file`).
- Pastas em kebab-case.
- Nomes e código em inglês. **Os comentários desta refatoração estão em português** por
  pedido explícito — eles explicam o que mudou e por quê.
- Componentes e funções exportadas como `export function Nome(props: NomeProps)`, com as
  props desestruturadas no corpo. Props em `interface`, não `type`.
- Imports por **alias absoluto** a partir de `src` (`core/hooks/useObservable`), nunca
  relativo com `../..`.
- Imports do MUI por caminho (`@mui/material/Button`), não pelo barrel.
- Formatação segue o `.prettierrc` da raiz (tabs, aspas simples, 110 colunas). Rode
  `npm ci` na raiz antes de formatar — versões diferentes do prettier geram diff em arquivos
  que ninguém tocou.
- Fim de linha é **LF**, forçado pelo `.gitattributes`.
- Quebre funções grandes em menores.

## Commits

Semânticos, validados por commitlint na raiz: `feat`, `fix`, `test`, `build`, `perf`,
`style`, `refactor`, `chore`, `raw`. Use `npm run commit` para o fluxo guiado.

## Deploy

Projeto Firebase único (preencha `.firebaserc`). Não há par dev/prod nem workflow de CI —
o deploy é manual:

```bash
npm --prefix functions run build && npm --prefix web run prod:build
firebase deploy
```

> O `firebase.json` exclui o `package-lock.json` do bundle de deploy das functions. Na
> prática isso significa que o install remoto não é reproduzível a partir do lock; se isso
> incomodar, remova a entrada do `ignore`.

## Revisões de código

**Toda revisão de código deve ser escrita em português do
Brasil.**
