import { useEffect, useState } from 'react';
import { watchContacts } from '../../services/contacts-service';
import type { Contact } from '../../types';

export const useContacts = (
  ownerId: string | undefined,
  connectionId: string | undefined,
) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId || !connectionId) return;
    setLoading(true);
    const unsubscribe = watchContacts(
      ownerId,
      connectionId,
      (items) => {
        setContacts(items);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao carregar contatos:', error);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [ownerId, connectionId]);

  return { contacts, loading };
};
