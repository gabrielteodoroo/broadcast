import { FormEvent, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { ConnectionModel } from 'app/apps/connections/connections.model';

interface ConnectionFormDialogProps {
	open: boolean;
	connection: ConnectionModel | null;
	onSubmit: (name: string) => Promise<void>;
	onClose: () => void;
}

export function ConnectionFormDialog(props: ConnectionFormDialogProps) {
	const { open, connection, onSubmit, onClose } = props;

	const [name, setName] = useState('');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (open) setName(connection?.name ?? '');
	}, [open, connection]);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();

		if (!name.trim()) return;

		setSubmitting(true);

		try {
			await onSubmit(name);
			onClose();
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
			<form onSubmit={handleSubmit}>
				<DialogTitle>{connection ? 'Editar conexão' : 'Nova conexão'}</DialogTitle>
				<DialogContent>
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
