import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

export function formatDateTime(value: Timestamp | null | undefined): string {
	if (!value) return '—';

	return format(value.toDate(), 'dd/MM/yyyy HH:mm');
}
