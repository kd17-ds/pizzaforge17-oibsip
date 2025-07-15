import { createContext, useContext, useState } from "react";
import Notification from "../components/Notification"; // your custom banner

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({ open: false, message: "", type: "success" });

    let timeoutId;

    const showNotification = (message, type = "success") => {
        setNotification({ open: true, message, type });

        // Clear any existing timeout
        if (timeoutId) clearTimeout(timeoutId);

        // Set new timeout
        timeoutId = setTimeout(() => {
            setNotification({ open: false, message: "", type });
            timeoutId = null;
        }, 4000);
    };

    const hideNotification = () => {
        if (timeoutId) clearTimeout(timeoutId);
        setNotification({ open: false, message: "", type: "success" });
        timeoutId = null;
    };


    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification.open && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={hideNotification}
                />
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);