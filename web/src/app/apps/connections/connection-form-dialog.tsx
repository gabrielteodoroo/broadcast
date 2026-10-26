import { FormEvent, useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { ConnectionModel } from 'app/apps/connections/connections.model';
import { messageFromFirestoreError } from 'core/utils/firestore-error';

interface ConnectionFormDialogProps {
	open: boolean;
	connection: ConnectionModel | null;
	onSubmit: (name: string) => Promise<void>;
	onClose: () => void;
}

export function ConnectionFormDialog(props: ConnectionFormDialogProps) {
	const { open, connection, onSubmit, onClose } = props;

	const [name, setName] = useState('');
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!open) return;

		setName(connection?.name ?? '');
		setError('');
	}, [open, connection]);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setError('');

		if (!name.trim()) return;

		setSubmitting(true);

		try {
			await onSubmit(name);
			onClose();
		} catch (error) {
			setError(messageFromFirestoreError(error, 'Não foi possível salvar a conexão. Tente novamente.'));
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
			<form onSubmit={handleSubmit}>
				<DialogTitle>{connection ? 'Editar conexão' : 'Nova conexão'}</DialogTitle>
				<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
