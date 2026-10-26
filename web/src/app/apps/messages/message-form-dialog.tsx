import { FormEvent, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ContactModel } from 'app/apps/contacts/contacts.model';
import { MessageInput, MessageModel } from 'app/apps/messages/messages.model';
import { messageFromFirestoreError } from 'core/utils/firestore-error';

interface MessageFormDialogProps {
	open: boolean;
	message: MessageModel | null;
	contacts: ContactModel[];
	onSubmit: (input: MessageInput) => Promise<void>;
	onClose: () => void;
}

export function MessageFormDialog(props: MessageFormDialogProps) {
	const { open, message, contacts, onSubmit, onClose } = props;

	const [body, setBody] = useState('');
	const [selected, setSelected] = useState<string[]>([]);
	const [schedule, setSchedule] = useState(false);
	const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!open) return;

		setBody(message?.body ?? '');
		setSelected(message?.contactIds ?? []);

		const scheduled = message?.status === 'scheduled' ? message.scheduledAt : null;

		setSchedule(Boolean(scheduled));
		setScheduledAt(scheduled ? scheduled.toDate() : null);
		setError('');
	}, [open, message]);

	function toggleContact(id: string) {
		setSelected(prev => (prev.includes(id) ? prev.filter(current => current !== id) : [...prev, id]));
	}

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setError('');

		if (!body.trim()) return setError('Escreva a mensagem.');
		if (selected.length === 0) return setError('Selecione ao menos um contato.');

		if (schedule) {
			if (!scheduledAt) return setError('Informe a data do agendamento.');
			if (scheduledAt.getTime() <= Date.now()) return setError('O agendamento precisa ser no futuro.');
		}

		setSubmitting(true);

		try {
			await onSubmit({
				body,
				contactIds: selected,
				scheduledAt: schedule && scheduledAt ? scheduledAt.getTime() : null,
			});
			onClose();
		} catch (error) {
			setError(messageFromFirestoreError(error, 'Não foi possível salvar a mensagem. Tente novamente.'));
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<form onSubmit={handleSubmit}>
				<DialogTitle>{message ? 'Editar mensagem' : 'Nova mensagem'}</DialogTitle>
				<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
					{error && (
						<Typography color="error" variant="body2">
							{error}
						</Typography>
					)}

					<TextField
						label="Mensagem"
						value={body}
						onChange={event => setBody(event.target.value)}
						multiline
						minRows={3}
						fullWidth
						required
						sx={{ mt: 1 }}
					/>

					<div>
						<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
							Contatos ({selected.length} selecionados)
						</Typography>
						{contacts.length === 0 ? (
							<Typography variant="body2" color="text.secondary">
								Cadastre contatos antes de enviar.
							</Typography>
						) : (
							<FormGroup
								sx={{
									maxHeight: 192,
									overflow: 'auto',
									borderRadius: 1,
									border: '1px solid',
									borderColor: 'divider',
									px: 1.5,
								}}
							>
								{contacts.map(contact => (
									<FormControlLabel
										key={contact.id}
										control={
											<Checkbox
												checked={selected.includes(contact.id)}
												onChange={() => toggleContact(contact.id)}
											/>
										}
										label={`${contact.name} — ${contact.phone}`}
									/>
								))}
							</FormGroup>
						)}
					</div>

					<FormControlLabel
						control={<Switch checked={schedule} onChange={event => setSchedule(event.target.checked)} />}
						label="Agendar envio"
					/>

					{schedule && (
						<DateTimePicker
							label="Enviar em"
							value={scheduledAt}
							onChange={setScheduledAt}
							minDateTime={new Date()}
							format="dd/MM/yyyy HH:mm"
							slotProps={{ textField: { fullWidth: true } }}
						/>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Cancelar</Button>
					<Button type="submit" variant="contained" disabled={submitting}>
						{schedule ? 'Agendar' : 'Enviar'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
