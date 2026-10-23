# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Escopo: este arquivo cobre `web/` (frontend React). O repositório contém também
> `functions/` (backend Firebase).

## Visão geral

`web` é o frontend SPA do Broadcast — disparo de mensagens multi-tenant. React 19 +
TypeScript + Vite, MUI v9, hospedado no Firebase Hosting. Gerenciado com **npm**
(Node 22.22.0).

Três sistemas de estado convivem, e saber qual é qual é o primeiro passo de qualquer mexida:

| para quê | com quê |
|---|---|
| dados em tempo real do Firestore | **RxJS** (`core/firebase/rxfire.ts` + `*.model.ts`) |
| cache/dedupe desses dados no React | **TanStack Query** (`core/hooks/useObservableQuery`) |
| estado de interface da feature | **Jotai** (atoms declarados na `*.facade.ts`) |

## Estrutura

```
src/
├── index.tsx                  entrypoint (providers: query, tema, locale)
├── environment.ts/.type.ts    único ponto que lê import.meta.env
├── theme.ts
├── core/
│   ├── firebase/              firebase.ts, firestore.ts, auth.ts, rxfire.ts
│   ├── rxjs/                  create-behavior.ts, index.ts (cache, myMap, mySwitchMap)
│   ├── hooks/                 useObservable, useBehavior, useObservableQuery
│   └── utils/                 phone.ts, date.ts
└── app/
    ├── app.tsx                rotas
    ├── components/            UI compartilhada
    └── apps/<feature>/
        ├── <feature>.model.ts    tipo do documento + streams `*$` + escritas
        ├── <feature>.facade.ts   atoms de UI + orquestração para a tela
        ├── hooks/useX.ts         ponte stream → React, via useObservableQuery
        └── *-page.tsx / *-panel.tsx / *-dialog.tsx
```

Regras de camada:

- **só** `core/firebase/rxfire.ts` chama `onSnapshot`;
- **só** o `*.model.ts` conhece nomes de coleção e de campo do Firestore;
- a tela consome a **facade**, nunca o model direto;
- utilitário puro compartilhado vive em `core/utils/`, não na pasta da feature.

## RxJS: o que usar e quando

- `collectionData$` / `docData$` (`core/firebase/rxfire.ts`) — a origem de todo stream.
- `useObservableQuery` — o caminho padrão para ler na tela. Deduplica por `queryKey`: dois
  componentes com a mesma chave compartilham um listener. **A `queryKey` precisa conter tudo
  que a factory fecha sobre**, ou a factory antiga fica viva.
- `useObservable` — para um stream que não vale cachear.
- `useBehavior` — para estado global observável (`currentUser$`).
- `cache()` (`core/rxjs`) — `shareReplay` com buffer 1, para não abrir N listeners do mesmo
  dado.

Usuário logado é `currentUser$`, um `BehaviorSubject` com três estados num valor só:
`undefined` = boot em curso, `null` = deslogado, `User` = logado. Não existe campo
`loading`.

## Configuração e secrets

A configuração vem dos `.env.development` / `.env.production` locais, lidos pelo Vite no
build. Os arquivos são gitignorados; `.env.example` é a lista versionada das chaves. Os
valores saem de `firebase apps:sdkconfig WEB` ou do console do Firebase.

> **Regra de ouro: todo valor `VITE_*` é público.** O Vite substitui
> `import.meta.env.VITE_X` pelo literal no build, e ele fica em claro dentro de
> `build/assets/*.js`. Quem protege o projeto são as `firestore.rules` e o App Check, não o
> sigilo dessas chaves. Valor que não pode vazar não entra no front: a chamada vai para uma
> Cloud Function, que lê o segredo com `defineSecret`.

### Adicionar uma env nova

1. Ler `import.meta.env.VITE_NOVA_CHAVE` em `src/environment.ts`, com default, e tipar o
   campo em `src/environment.type.ts` e em `src/vite-env.d.ts`.
2. Documentar em `.env.example`, com o valor em branco.
3. Preencher o `.env.development` da máquina (e o `.env.production`, antes do deploy).

## Path aliases

`tsconfig.json` mapeia `*` para `./src/*`. O mesmo alias precisa existir em **três** lugares:

1. `tsconfig.json` (`paths`) — para o `tsc`;
2. `vite.config.mts` (`resolve.tsconfigPaths`) — para o dev server e o build;
3. `jest.config.js` (`moduleNameMapper`) — para os testes.

## Deploy

`npm run prod:build` e `firebase deploy --only hosting`. **Rotacionar um valor exige novo
build**: ele está compilado dentro do bundle.

## Testes

`npm test` (jest + ts-jest, transpile-only). Teste fica junto do código, como
`*.test.ts`. O type-check de verdade é o `tsc` do build, não o jest.

## Commits

Semânticos (commitlint + commitizen na raiz): `feat`, `fix`, `test`, `build`, `perf`,
`style`, `refactor`, `chore`, `raw`.

## Revisões de código

**Toda revisão deve ser escrita em português do Brasil.**
