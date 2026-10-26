import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ConfirmDialog } from 'app/components/confirm-dialog';
import { LoadError } from 'app/components/load-error';
import { MessageFormDialog } from 'app/apps/messages/message-form-dialog';
import { MessageFilter, useMessagesPanel } from 'app/apps/messages/messages.facade';
import { formatDateTime } from 'core/utils/date';

interface MessagesPanelProps {
	connectionId: string;
}

export function MessagesPanel(props: MessagesPanelProps) {
	const { connectionId } = props;

	const {
		contacts,
		isLoading,
		loadError,
		visible,
		filter,
		setFilter,
		formOpen,
		editing,
		removing,
		removeError,
		openCreate,
		openEdit,
		closeForm,
		submit,
		askRemove,
		cancelRemove,
		confirmRemove,
		recipientsOf,
	} = useMessagesPanel({ connectionId });

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<Typography variant="h6">Mensagens</Typography>
				<div className="flex items-center gap-2">
					<ToggleButtonGroup
						size="small"
						exclusive
						value={filter}
						onChange={(_, value: MessageFilter | null) => value && setFilter(value)}
					>
						<ToggleButton value="all">Todas</ToggleButton>
						<ToggleButton value="sent">Enviadas</ToggleButton>
						<ToggleButton value="scheduled">Agendadas</ToggleButton>
					</ToggleButtonGroup>
					<Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
						Nova
					</Button>
				</div>
			</div>

			{isLoading ? (
				<div className="flex justify-center p-8">
					<CircularProgress />
				</div>
			) : loadError ? (
				<LoadError
					error={loadError}
					message="Não foi possível carregar as mensagens. Atualize a página para tentar novamente."
				/>
			) : visible.length === 0 ? (
				<Typography color="text.secondary">Nenhuma mensagem neste filtro.</Typography>
			) : (
				<List className="rounded border border-gray-200">
					{visible.map(message => (
						<ListItem
							key={message.id}
							divider
							alignItems="flex-start"
							secondaryAction={
								<span>
									{message.status === 'scheduled' && (
										<IconButton edge="end" size="small" onClick={() => openEdit(message)} aria-label="Editar">
											<EditIcon fontSize="small" />
										</IconButton>
									)}
									<IconButton
										edge="end"
										size="small"
										onClick={() => askRemove(message)}
										aria-label="Excluir"
										className="!ml-1"
									>
										<DeleteIcon fontSize="small" />
									</IconButton>
								</span>
							}
						>
							<ListItemText
								primary={
									<span className="flex items-center gap-2 pr-16">
										<Chip
											size="small"
											color={message.status === 'sent' ? 'success' : 'warning'}
											label={message.status === 'sent' ? 'Enviada' : 'Agendada'}
										/>
										<span className="truncate">{message.body}</span>
									</span>
								}
								secondary={
									<>
										<span className="block">Para: {recipientsOf(message)}</span>
										<span className="block">
											{message.status === 'sent'
												? `Enviada em ${formatDateTime(message.sentAt)}`
												: `Agendada para ${formatDateTime(message.scheduledAt)}`}
										</span>
									</>
								}
							/>
						</ListItem>
					))}
				</List>
			)}

			<MessageFormDialog
				open={formOpen}
				message={editing}
				contacts={contacts}
				onSubmit={submit}
				onClose={closeForm}
			/>

			<ConfirmDialog
				open={Boolean(removing)}
				title="Excluir mensagem"
				description="Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita."
				error={removeError}
				onConfirm={confirmRemove}
				onCancel={cancelRemove}
			/>
		</div>
	);
}
