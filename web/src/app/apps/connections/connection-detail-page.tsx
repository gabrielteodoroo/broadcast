import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import useConnection from 'app/apps/connections/hooks/useConnection';
import { LoadError } from 'app/components/load-error';
import { ContactsPanel } from 'app/apps/contacts/contacts-panel';
import { MessagesPanel } from 'app/apps/messages/messages-panel';

type TabKey = 'contacts' | 'messages';

export function ConnectionDetailPage() {
	const { connectionId = '' } = useParams();
	const { connection, error } = useConnection({ connectionId });

	const [tab, setTab] = useState<TabKey>('contacts');

	return (
		<div className="flex flex-col gap-4">
			<Breadcrumbs>
				<Link component={RouterLink} to="/" underline="hover">
					Conexões
				</Link>
				<Typography color="text.primary">{connection?.name ?? '...'}</Typography>
			</Breadcrumbs>

			<LoadError
				error={error}
				message="Não foi possível carregar esta conexão. Atualize a página para tentar novamente."
			/>

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
}
