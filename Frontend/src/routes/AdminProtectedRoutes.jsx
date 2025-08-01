import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLoader } from "../contexts/LoadingContext";
import { useNotification } from "../contexts/NotificationContext";
import { useEffect } from "react";

export default function AdminProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();

    useEffect(() => {
        if (loading) showLoader();
        else hideLoader();
    }, [loading]);

    if (loading) {
        return null;
    }

    if (!user) {
        showNotification("You must be logged in as admin", "error");
        return <Navigate to="/login" replace />;
    }

    if (!user.isAdmin) {
        showNotification("Access denied: Admins only", "error");
        return <Navigate to="/" replace />;
    }

    return children;
}
