import { createContext, useContext, useRef, useState } from "react";
import Notification from "../components/Notification";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        type: "success"
    });

    const timeoutRef = useRef(null);

    const showNotification = (message, type = "success") => {
        setNotification({ open: true, message, type });


        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }


        timeoutRef.current = setTimeout(() => {
            setNotification({ open: false, message: "", type });
            timeoutRef.current = null;
        }, 4000);
    };

    const hideNotification = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setNotification({ open: false, message: "", type: "success" });
        timeoutRef.current = null;
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
