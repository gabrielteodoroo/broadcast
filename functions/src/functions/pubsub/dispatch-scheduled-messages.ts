import { onSchedule } from 'firebase-functions/v2/scheduler';
import { dispatchDueMessages } from 'facades/dispatch/dispatch.facade';
import environment from 'environment';

export const dispatchScheduledMessages = onSchedule(
	{
		schedule: 'every 1 minutes',
		timeZone: environment.timeZone,
		region: environment.region,
	},
	async () => {
		await dispatchDueMessages();
	}
);
