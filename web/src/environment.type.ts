export interface EnvironmentConfig {
	firebaseConfig: {
		apiKey: string;
		authDomain: string;
		projectId: string;
		storageBucket: string;
		messagingSenderId: string;
		appId: string;
	};

	firebaseDebug: boolean;
}
