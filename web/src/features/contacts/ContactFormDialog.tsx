import { useEffect, useState, type FormEvent } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import type { Contact } from '../../types';
import type { ContactInput } from '../../services/contacts-service';
import { formatPhone } from './phone';

type ContactFormDialogProps = {
  open: boolean;
  contact: Contact | null;
  onSubmit: (input: ContactInput) => Promise<void>;
  onClose: () => void;
  validate?: (input: ContactInput) => string | null;
};

export const ContactFormDialog = ({
  open,
  contact,
  onSubmit,
  onClose,
  validate,
}: ContactFormDialogProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(contact?.name ?? '');
      setPhone(formatPhone(contact?.phone ?? ''));
      setError('');
    }
  }, [open, contact]);

  const handleSubmit = async (event: FormEvent) => {
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{contact ? 'Editar contato' : 'Novo contato'}</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
        >
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            autoFocus
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            sx={{ mt: 1 }}
          />
          <TextField
            label="Telefone"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
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
};
