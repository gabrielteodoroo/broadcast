import { getContacts$ } from 'app/apps/contacts/contacts.model';
import useObservableQuery from 'core/hooks/useObservableQuery';

interface UseContactsProps {
	ownerId: string | undefined;
	connectionId: string | undefined;
}

export default function useContacts(props: UseContactsProps) {
	const { ownerId, connectionId } = props;

	const query = useObservableQuery({
		queryKey: ['contacts', ownerId, connectionId],
		observableFactory: () => getContacts$({ ownerId: ownerId!, connectionId: connectionId! }),
		enabled: !!ownerId && !!connectionId,
	});

	return {
		contacts: query.data ?? [],
		isLoading: query.isLoading,
		error: query.error,
	};
}
