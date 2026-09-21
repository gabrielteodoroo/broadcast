import { useEffect, useState, type FormEvent } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import type { Connection } from '../../types';

type ConnectionFormDialogProps = {
  open: boolean;
  connection: Connection | null;
  onSubmit: (name: string) => Promise<void>;
  onClose: () => void;
};

export const ConnectionFormDialog = ({
  open,
  connection,
  onSubmit,
  onClose,
}: ConnectionFormDialogProps) => {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setName(connection?.name ?? '');
  }, [open, connection]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(name);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {connection ? 'Editar conexão' : 'Nova conexão'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
};
