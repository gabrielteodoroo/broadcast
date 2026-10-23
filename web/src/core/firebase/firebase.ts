import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from 'environment';

let app: FirebaseApp | null = null;

export function firebaseApp(): FirebaseApp {
	if (app) return app;

	app = getApps()[0] ?? initializeApp(firebaseConfig);

	return app;
}
