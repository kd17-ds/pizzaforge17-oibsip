import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { Link } from "react-router-dom";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function VerifyEmail() {
    const [verified, setVerified] = useState(null);

    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token");

        if (!token) {
            setVerified(false);
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
                    setVerified(false);
                    showNotification("Verification failed or token expired.", "error");
                }
            } catch (err) {
                setVerified(false);
                showNotification("Server error. Please try again later.", "error");
            } finally {
                hideLoader();
            }
        };

        verify();
    }, []);

    return (
        <div className="min-h-[calc(100vh-225px)] pt-[75px] flex items-center justify-center px-4 ">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full flex flex-col items-center text-center">
                {verified === null && (
                    <p className="text-lg font-semibold text-gray-600">Verifying your email...</p>
                )}

                {verified === true && (
                    <>
                        <VerifiedIcon className="text-green-500 mb-4" sx={{ fontSize: 60 }} />
                        <h2 className="text-2xl font-bold mb-2 text-green-600">Email Verified!</h2>
                        <p className="mb-6 text-gray-700">You can now log in to your account.</p>
                        <Link to="/login">
                            <button className="bg-sec text-white font-medium px-6 py-2 rounded hover:bg-primary transition">
                                Go to Login
                            </button>
                        </Link>
                    </>
                )}

                {verified === false && (
                    <>
                        <ErrorOutlineIcon className="text-red-500 mb-4" sx={{ fontSize: 60 }} />
                        <h2 className="text-2xl font-bold mb-2 text-red-600">Verification Failed</h2>
                        <p className="mb-6 text-gray-700">The token is invalid or expired. Please request a new one.</p>
                        <Link to="/login">
                            <button className="bg-sec text-white font-medium px-6 py-2 rounded hover:bg-primary transition">
                                Back to Login
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
