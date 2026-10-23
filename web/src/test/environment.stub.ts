import { EnvironmentConfig } from 'environment.type';

const environment: EnvironmentConfig = {
	firebaseConfig: {
		apiKey: 'test-api-key',
		authDomain: 'test.firebaseapp.com',
		projectId: 'test-project',
		storageBucket: 'test.appspot.com',
		messagingSenderId: '0',
		appId: 'test-app-id',
	},

	firebaseDebug: false,
};

export const { firebaseConfig, firebaseDebug } = environment;

export function firebaseDebugLog() {
}

export default environment;
