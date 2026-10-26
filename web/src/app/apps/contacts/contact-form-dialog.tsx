import { FormEvent, useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { ContactInput, ContactModel } from 'app/apps/contacts/contacts.model';
import { formatPhone } from 'core/utils/phone';
import { messageFromFirestoreError } from 'core/utils/firestore-error';

interface ContactFormDialogProps {
	open: boolean;
	contact: ContactModel | null;
	onSubmit: (input: ContactInput) => Promise<void>;
	onClose: () => void;
	validate?: (input: ContactInput) => string | null;
}

export function ContactFormDialog(props: ContactFormDialogProps) {
	const { open, contact, onSubmit, onClose, validate } = props;

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!open) return;

		setName(contact?.name ?? '');
		setPhone(formatPhone(contact?.phone ?? ''));
		setError('');
	}, [open, contact]);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setError('');

		if (!name.trim() || !phone.trim()) return;

		const input: ContactInput = { name, phone };
		const message = validate?.(input);

		if (message) {
			setError(message);
			return;
		}

		setSubmitting(true);

		try {
			await onSubmit(input);
			onClose();
		} catch (error) {
			setError(messageFromFirestoreError(error, 'Não foi possível salvar o contato. Tente novamente.'));
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
			<form onSubmit={handleSubmit}>
				<DialogTitle>{contact ? 'Editar contato' : 'Novo contato'}</DialogTitle>
				<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
					{error && <Alert severity="error">{error}</Alert>}
					<TextField
						autoFocus
						label="Nome"
						value={name}
						onChange={event => setName(event.target.value)}
						required
						fullWidth
						sx={{ mt: 1 }}
					/>
					<TextField
						label="Telefone"
						value={phone}
						onChange={event => setPhone(formatPhone(event.target.value))}
						placeholder="(11) 99999-8888"
						inputMode="tel"
						required
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Cancelar</Button>
					<Button type="submit" variant="contained" disabled={submitting}>
						Salvar
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
