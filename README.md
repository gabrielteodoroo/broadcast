# Broadcast

SaaS multi-tenant de disparo de mensagens (fake), com **React + TypeScript + Vite**,
**Material UI + Tailwind**, **RxJS** e **Firebase** (Auth, Firestore realtime, Cloud
Functions).

Arquitetura em camadas; as convenções de cada parte estão em `CLAUDE.md`, `web/CLAUDE.md`
e `functions/CLAUDE.md`.

## Estrutura

```
broadcast/
├── web/                    frontend (Vite + React)
│   └── src/
│       ├── core/           firebase, rxjs, hooks, utils
│       ├── app/
│       │   ├── components/ UI compartilhada
│       │   └── apps/       auth, connections, contacts, messages
│       └── environment.ts
├── functions/              Cloud Functions
│   └── src/
│       ├── facades/        regra de negócio
│       ├── models/         contratos de documento
│       └── functions/      adaptadores Firebase (pubsub/)
├── firestore.rules         isolamento multi-tenant
├── firestore.indexes.json
└── firebase.json
```

## Modelo de dados

- `connections` — `{ name, ownerId, createdAt }`
- `contacts` — `{ name, phone, ownerId, connectionId, createdAt }`
- `messages` — `{ body, ownerId, connectionId, contactIds[], status, scheduledAt, sentAt, createdAt }`

## Agendamento

`messages.status` = `scheduled | sent`. A Cloud Function `dispatchScheduledMessages` roda a
cada minuto, pega `status == 'scheduled'` com `scheduledAt <= now` e promove para `sent`
(gravando `sentAt`). Nada é enviado de fato — é simulado.

## Rodar local

Node 22.22.0 (`.nvmrc`).

```bash
# tooling compartilhado (prettier, eslint, commitlint)
npm ci

# frontend
cd web
cp .env.example .env.development   # preencha com as credenciais do seu projeto Firebase
npm install
npm run dev                        # http://localhost:3001

# backend
cd functions
npm install
npm run build
```

### Emuladores (opcional)

```bash
firebase emulators:start
```

## Deploy

```bash
firebase login
firebase use --add                 # selecione seu projeto

npm --prefix functions run build
npm --prefix web run prod:build
firebase deploy                    # hosting + functions + rules + indexes
```

Os índices compostos precisam existir antes das queries que os usam:

```bash
npm --prefix functions run deploy:indexes
```

## Qualidade

```bash
npm run lint:prettier:check        # na raiz, cobre web/src e functions/src
npm run lint:eslint:check
npm --prefix web test
npm --prefix functions test
npm run commit                     # commit semântico guiado
```
