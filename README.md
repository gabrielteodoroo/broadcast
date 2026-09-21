# Broadcast

SaaS multi-tenant de disparo de mensagens (fake), com **React + TypeScript + Vite**,
**Material UI + Tailwind** e **Firebase** (Auth, Firestore realtime, Cloud Functions).

Paradigma **funcional** (sem OO). Sem subcoleções no Firestore. Isolamento por cliente
via `ownerId` + Firestore Security Rules.

## Estrutura

```
broadcast/
├── web/            # frontend (Vite + React)
│   └── src/
│       ├── lib/          # firebase init
│       ├── types/        # modelos de domínio
│       ├── mappers/      # doc Firestore -> domínio (funções puras)
│       ├── services/     # I/O Firestore (realtime + CRUD)
│       ├── features/     # auth, connections, contacts, messages
│       └── components/   # UI compartilhada
├── functions/      # Cloud Functions (dispatch agendado)
├── firestore.rules # isolamento multi-tenant
├── firestore.indexes.json
└── firebase.json
```

## Modelo de dados (coleções raiz, sem subcoleção)

- `connections`  — `{ name, ownerId, createdAt }`
- `contacts`     — `{ name, phone, ownerId, connectionId, createdAt }`
- `messages`     — `{ body, ownerId, connectionId, contactIds[], status, scheduledAt, sentAt, createdAt }`

Cada doc carrega `ownerId = auth.uid`. As rules garantem que um cliente só lê/escreve
os próprios docs — o filtro no front é conveniência, o isolamento real vive nas rules.

## Agendamento

`messages.status` = `scheduled | sent`. A Cloud Function `dispatchScheduledMessages`
roda a cada minuto, pega `status == 'scheduled'` com `scheduledAt <= now` e vira para
`sent` (grava `sentAt`). Nada é enviado de fato — é fake.

## Rodar local

### web
```bash
cd web
cp .env.example .env   # preencha com as credenciais do seu projeto Firebase
npm install
npm run dev
```

### functions
```bash
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
# na raiz do projeto
firebase login
firebase use --add            # selecione seu projeto
cd functions && npm run build && cd ..
cd web && npm run build && cd ..
firebase deploy               # hosting + functions + firestore rules
```

O link do Firebase Hosting sai ao final do deploy.
