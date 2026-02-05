import { Navigate } from 'react-router-dom';
import { isAuth } from '../lib/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    if (!isAuth()) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
