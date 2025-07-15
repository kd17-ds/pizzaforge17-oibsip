import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    return (
        <LoadingContext.Provider value={{ loading, showLoader, hideLoader }}>
            {children}
            {loading && (
                <div className="fixed top-4 right-4 z-[999]">
                    <div className="w-6 h-6 border-4 border-sec border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </LoadingContext.Provider>
    );
};

export const useLoader = () => useContext(LoadingContext);
