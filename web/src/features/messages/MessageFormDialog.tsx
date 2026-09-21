import { useEffect, useState, type FormEvent } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { type Dayjs } from 'dayjs';
import type { Contact, Message } from '../../types';
import type { MessageInput } from '../../services/messages-service';

type MessageFormDialogProps = {
  open: boolean;
  message: Message | null;
  contacts: Contact[];
  onSubmit: (input: MessageInput) => Promise<void>;
  onClose: () => void;
};

export const MessageFormDialog = ({
  open,
  message,
  contacts,
  onSubmit,
  onClose,
}: MessageFormDialogProps) => {
  const [body, setBody] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [schedule, setSchedule] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<Dayjs | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setBody(message?.body ?? '');
    setSelected(message?.contactIds ?? []);
    const scheduled = message?.status === 'scheduled' && message.scheduledAt;
    setSchedule(Boolean(scheduled));
    setScheduledAt(scheduled ? dayjs(message!.scheduledAt) : null);
    setError('');
  }, [open, message]);

  const toggleContact = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!body.trim()) return setError('Escreva a mensagem.');
    if (selected.length === 0)
      return setError('Selecione ao menos um contato.');
    if (schedule) {
      if (!scheduledAt) return setError('Informe a data do agendamento.');
      if (scheduledAt.valueOf() <= Date.now())
        return setError('O agendamento precisa ser no futuro.');
    }

    setSubmitting(true);
    try {
      await onSubmit({
        body,
        contactIds: selected,
        scheduledAt: schedule && scheduledAt ? scheduledAt.valueOf() : null,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {message ? 'Editar mensagem' : 'Nova mensagem'}
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
        >
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <TextField
            label="Mensagem"
            value={body}
            onChange={(e) => setBody(e.target.value)}
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
                {contacts.map((contact) => (
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
            control={
              <Switch
                checked={schedule}
                onChange={(e) => setSchedule(e.target.checked)}
              />
            }
            label="Agendar envio"
          />

          {schedule && (
            <DateTimePicker
              label="Enviar em"
              value={scheduledAt}
              onChange={setScheduledAt}
              minDateTime={dayjs()}
              format="DD/MM/YYYY HH:mm"
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
};
