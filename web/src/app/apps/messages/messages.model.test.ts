import { resolveSchedule } from 'app/apps/messages/messages.model';

describe('resolveSchedule', () => {
	const now = 1_700_000_000_000;

	it('sem data marca como enviada', () => {
		const result = resolveSchedule(null, now);

		expect(result.isScheduled).toBe(false);
		expect(result.status).toBe('sent');
		expect(result.scheduledAt).toBeNull();
	});

	it('data no futuro marca como agendada', () => {
		const result = resolveSchedule(now + 60_000, now);

		expect(result.isScheduled).toBe(true);
		expect(result.status).toBe('scheduled');
		expect(result.scheduledAt?.toMillis()).toBe(now + 60_000);
	});

	it('data no passado cai para enviada — não agenda retroativamente', () => {
		const result = resolveSchedule(now - 60_000, now);

		expect(result.status).toBe('sent');
		expect(result.scheduledAt).toBeNull();
	});

	it('data exatamente agora conta como enviada', () => {
		expect(resolveSchedule(now, now).status).toBe('sent');
	});
});
