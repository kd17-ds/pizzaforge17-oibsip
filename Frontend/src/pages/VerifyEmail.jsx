import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/constants";
import { Link } from "react-router-dom";
import { useLoader } from "../contexts/LoadingContext";
import { useNotification } from "../contexts/NotificationContext";

export default function VerifyEmail() {
    const [verified, setVerified] = useState(false);

    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token");

        if (!token) {
            showNotification("Token missing or invalid.", "error");
            return;
        }

        const verify = async () => {
            try {
                showLoader();
                const res = await axios.get(`${BASE_URL}/verifyemail?token=${token}`);
                if (res.data.status) {
                    setVerified(true);
                    showNotification("Your email has been verified!", "success");
                } else {
                    showNotification("Verification failed or token expired.", "error");
                }
            } catch (err) {
                showNotification("Server error. Please try again later.", "error");
            } finally {
                hideLoader();
            }
        };

        verify();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-xl font-medium text-amber-500">
            {verified && (
                <Link to="/login">
                    <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded transition">
                        Go to Login
                    </button>
                </Link>
            )}
        </div>
    );
}
