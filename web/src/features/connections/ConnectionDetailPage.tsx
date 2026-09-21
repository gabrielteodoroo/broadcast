import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Breadcrumbs, Link, Tab, Tabs, Typography } from '@mui/material';
import { useAuth } from '../auth/auth-context';
import { useConnections } from './use-connections';
import { ContactsPanel } from '../contacts/ContactsPanel';
import { MessagesPanel } from '../messages/MessagesPanel';

type TabKey = 'contacts' | 'messages';

export const ConnectionDetailPage = () => {
  const { connectionId = '' } = useParams();
  const { user } = useAuth();
  const { connections } = useConnections(user?.uid);
  const [tab, setTab] = useState<TabKey>('contacts');

  const connection = connections.find((c) => c.id === connectionId);

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs>
        <Link component={RouterLink} to="/" underline="hover">
          Conexões
        </Link>
        <Typography color="text.primary">
          {connection?.name ?? '...'}
        </Typography>
      </Breadcrumbs>

      <Tabs value={tab} onChange={(_, value: TabKey) => setTab(value)}>
        <Tab value="contacts" label="Contatos" />
        <Tab value="messages" label="Mensagens" />
      </Tabs>

      {tab === 'contacts' ? (
        <ContactsPanel connectionId={connectionId} />
      ) : (
        <MessagesPanel connectionId={connectionId} />
      )}
    </div>
  );
};
