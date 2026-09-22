import { useState } from 'react';
import {
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../auth/auth-context';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useContacts } from './use-contacts';
import { ContactFormDialog } from './ContactFormDialog';
import { formatPhone, phoneDigits } from './phone';
import {
  createContact,
  deleteContact,
  updateContact,
  type ContactInput,
} from '../../services/contacts-service';
import type { Contact } from '../../types';

export const ContactsPanel = ({ connectionId }: { connectionId: string }) => {
  const { user } = useAuth();
  const { contacts, loading } = useContacts(user?.uid, connectionId);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [removing, setRemoving] = useState<Contact | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (contact: Contact) => {
    setEditing(contact);
    setFormOpen(true);
  };

  const handleSubmit = async (input: ContactInput) => {
    if (!user) return;
    if (editing) await updateContact(editing.id, input);
    else await createContact(user.uid, connectionId, input);
  };

  const validateContact = (input: ContactInput): string | null => {
    const digits = phoneDigits(input.phone);
    const duplicated = contacts.some(
      (contact) =>
        contact.id !== editing?.id && phoneDigits(contact.phone) === digits,
    );
    return duplicated
      ? 'Já existe um contato com esse telefone nesta conexão.'
      : null;
  };

  const handleDelete = async () => {
    if (!removing) return;
    await deleteContact(removing.id);
    setRemoving(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Typography variant="h6">Contatos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Novo contato
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <CircularProgress />
        </div>
      ) : contacts.length === 0 ? (
        <Typography color="text.secondary">
          Nenhum contato nesta conexão.
        </Typography>
      ) : (
        <List className="rounded border border-gray-200">
          {contacts.map((contact) => (
            <ListItem
              key={contact.id}
              divider
              secondaryAction={
                <span>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => openEdit(contact)}
                    aria-label="Editar"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => setRemoving(contact)}
                    aria-label="Excluir"
                    className="!ml-1"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </span>
              }
            >
              <ListItemText
                primary={contact.name}
                secondary={formatPhone(contact.phone)}
              />
            </ListItem>
          ))}
        </List>
      )}

      <ContactFormDialog
        open={formOpen}
        contact={editing}
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
        validate={validateContact}
      />

      <ConfirmDialog
        open={Boolean(removing)}
        title="Excluir contato"
        description={`Tem certeza que deseja excluir "${removing?.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setRemoving(null)}
      />
    </div>
  );
};
