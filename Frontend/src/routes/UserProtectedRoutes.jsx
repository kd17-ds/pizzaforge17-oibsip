import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLoader } from "../contexts/LoadingContext";
import { useNotification } from "../contexts/NotificationContext";

export default function UserProtectedRoute({ children }) {
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
        showNotification("You must be logged in to access this page", "error");
        return <Navigate to="/login" replace />;
    }

    return children;
}
