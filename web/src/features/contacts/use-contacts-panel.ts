import { useState } from 'react';
import { useAuth } from '../auth/auth-context';
import { useContacts } from './use-contacts';
import { phoneDigits } from './phone';
import {
  createContact,
  deleteContact,
  updateContact,
  type ContactInput,
} from '../../services/contacts-service';
import type { Contact } from '../../types';

export const useContactsPanel = (connectionId: string) => {
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

  const submit = async (input: ContactInput) => {
    if (!user) return;
    if (editing) await updateContact(editing.id, input);
    else await createContact(user.uid, connectionId, input);
  };

  const validate = (input: ContactInput): string | null => {
    const digits = phoneDigits(input.phone);
    const duplicated = contacts.some(
      (contact) =>
        contact.id !== editing?.id && phoneDigits(contact.phone) === digits,
    );
    return duplicated
      ? 'Já existe um contato com esse telefone nesta conexão.'
      : null;
  };

  const confirmRemove = async () => {
    if (!removing) return;
    await deleteContact(removing.id);
    setRemoving(null);
  };

  return {
    contacts,
    loading,
    formOpen,
    editing,
    removing,
    openCreate,
    openEdit,
    closeForm: () => setFormOpen(false),
    submit,
    validate,
    askRemove: setRemoving,
    cancelRemove: () => setRemoving(null),
    confirmRemove,
  };
};
