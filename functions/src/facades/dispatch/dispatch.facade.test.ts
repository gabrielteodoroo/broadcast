import { Timestamp } from 'firebase-admin/firestore';
import { dispatchDueMessages } from 'facades/dispatch/dispatch.facade';

const commit = jest.fn();
const update = jest.fn();
const get = jest.fn();

interface QueryMock {
	where: jest.Mock<QueryMock, unknown[]>;
	limit: jest.Mock<QueryMock, unknown[]>;
	get: jest.Mock;
}

const query: QueryMock = {
	where: jest.fn(() => query),
	limit: jest.fn(() => query),
	get,
};

jest.mock('firebase-firestore', () => ({
	getDb: () => ({
		collection: () => query,
		batch: () => ({ update, commit }),
	}),
}));

jest.mock('firebase-functions', () => ({
	logger: { info: jest.fn(), error: jest.fn() },
}));

describe('dispatchDueMessages', () => {
	beforeEach(() => jest.clearAllMocks());

	it('não escreve nada quando não há mensagem vencida', async () => {
		get.mockResolvedValue({ empty: true, size: 0, docs: [] });

		const result = await dispatchDueMessages();

		expect(result.dispatched).toBe(0);
		expect(commit).not.toHaveBeenCalled();
	});

	it('promove as vencidas para enviada num único batch', async () => {
		const now = Timestamp.fromMillis(1_700_000_000_000);
		const docs = [{ ref: 'ref-1' }, { ref: 'ref-2' }];

		get.mockResolvedValue({ empty: false, size: docs.length, docs });

		const result = await dispatchDueMessages({ now });

		expect(result.dispatched).toBe(2);
		expect(update).toHaveBeenCalledTimes(2);
		expect(update).toHaveBeenCalledWith('ref-1', { status: 'sent', sentAt: now });
		expect(commit).toHaveBeenCalledTimes(1);
	});

	it('filtra por status agendado e por data de corte', async () => {
		const now = Timestamp.fromMillis(1_700_000_000_000);

		get.mockResolvedValue({ empty: true, size: 0, docs: [] });

		await dispatchDueMessages({ now, limit: 10 });

		expect(query.where).toHaveBeenCalledWith('status', '==', 'scheduled');
		expect(query.where).toHaveBeenCalledWith('scheduledAt', '<=', now);
		expect(query.limit).toHaveBeenCalledWith(10);
	});
});
