import { useEffect, useState, type FormEvent } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import type { Contact } from '../../types';
import type { ContactInput } from '../../services/contacts-service';

type ContactFormDialogProps = {
  open: boolean;
  contact: Contact | null;
  onSubmit: (input: ContactInput) => Promise<void>;
  onClose: () => void;
};

export const ContactFormDialog = ({
  open,
  contact,
  onSubmit,
  onClose,
}: ContactFormDialogProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(contact?.name ?? '');
      setPhone(contact?.phone ?? '');
    }
  }, [open, contact]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ name, phone });
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
            onChange={(e) => setPhone(e.target.value)}
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
