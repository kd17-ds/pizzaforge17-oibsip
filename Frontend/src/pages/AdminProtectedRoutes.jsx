import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AdminProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // or show a spinner here
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}
