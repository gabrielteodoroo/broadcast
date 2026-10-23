import { getMessages$ } from 'app/apps/messages/messages.model';
import useObservableQuery from 'core/hooks/useObservableQuery';

interface UseMessagesProps {
	ownerId: string | undefined;
	connectionId: string | undefined;
}

export default function useMessages(props: UseMessagesProps) {
	const { ownerId, connectionId } = props;

	const query = useObservableQuery({
		queryKey: ['messages', ownerId, connectionId],
		observableFactory: () => getMessages$({ ownerId: ownerId!, connectionId: connectionId! }),
		enabled: !!ownerId && !!connectionId,
	});

	return {
		messages: query.data ?? [],
		isLoading: query.isLoading,
		error: query.error,
	};
}
