import { Navigate, Outlet } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useCurrentUser } from 'app/apps/auth/auth.model';

export function ProtectedRoute() {
	const user = useCurrentUser();

	if (user === undefined) {
		return (
			<div className="flex h-full items-center justify-center">
				<CircularProgress />
			</div>
		);
	}

	if (!user) return <Navigate to="/login" replace />;

	return <Outlet />;
}
