import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from 'app/components/app-layout';
import { ProtectedRoute } from 'app/components/protected-route';
import { LoginPage } from 'app/apps/auth/login-page';
import { RegisterPage } from 'app/apps/auth/register-page';
import { ConnectionsPage } from 'app/apps/connections/connections-page';
import { ConnectionDetailPage } from 'app/apps/connections/connection-detail-page';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />

				<Route element={<ProtectedRoute />}>
					<Route element={<AppLayout />}>
						<Route path="/" element={<ConnectionsPage />} />
						<Route path="/connections/:connectionId" element={<ConnectionDetailPage />} />
					</Route>
				</Route>

				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}
