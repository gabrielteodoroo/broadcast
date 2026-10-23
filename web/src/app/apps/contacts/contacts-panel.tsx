import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ConfirmDialog } from 'app/components/confirm-dialog';
import { ContactFormDialog } from 'app/apps/contacts/contact-form-dialog';
import { useContactsPanel } from 'app/apps/contacts/contacts.facade';
import { formatPhone } from 'core/utils/phone';

interface ContactsPanelProps {
	connectionId: string;
}

export function ContactsPanel(props: ContactsPanelProps) {
	const { connectionId } = props;

	const {
		contacts,
		isLoading,
		formOpen,
		editing,
		removing,
		openCreate,
		openEdit,
		closeForm,
		submit,
		validate,
		askRemove,
		cancelRemove,
		confirmRemove,
	} = useContactsPanel({ connectionId });

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<Typography variant="h6">Contatos</Typography>
				<Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
					Novo contato
				</Button>
			</div>

			{isLoading ? (
				<div className="flex justify-center p-8">
					<CircularProgress />
				</div>
			) : contacts.length === 0 ? (
				<Typography color="text.secondary">Nenhum contato nesta conexão.</Typography>
			) : (
				<List className="rounded border border-gray-200">
					{contacts.map(contact => (
						<ListItem
							key={contact.id}
							divider
							secondaryAction={
								<span>
									<IconButton edge="end" size="small" onClick={() => openEdit(contact)} aria-label="Editar">
										<EditIcon fontSize="small" />
									</IconButton>
									<IconButton
										edge="end"
										size="small"
										onClick={() => askRemove(contact)}
										aria-label="Excluir"
										className="!ml-1"
									>
										<DeleteIcon fontSize="small" />
									</IconButton>
								</span>
							}
						>
							<ListItemText primary={contact.name} secondary={formatPhone(contact.phone)} />
						</ListItem>
					))}
				</List>
			)}

			<ContactFormDialog
				open={formOpen}
				contact={editing}
				onSubmit={submit}
				onClose={closeForm}
				validate={validate}
			/>

			<ConfirmDialog
				open={Boolean(removing)}
				title="Excluir contato"
				description={`Tem certeza que deseja excluir "${removing?.name}"? Esta ação não pode ser desfeita.`}
				onConfirm={confirmRemove}
				onCancel={cancelRemove}
			/>
		</div>
	);
}
