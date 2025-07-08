import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/constants";
import { Link } from "react-router-dom";

export default function VerifyEmail() {
    const [message, setMessage] = useState("Verifying...");
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token");

        if (!token) {
            setMessage("Verification token missing.");
            return;
        }

        axios
            .get(`${BASE_URL}/verifyemail?token=${token}`)
            .then((res) => {
                if (res.data.status) {
                    setMessage("Email verified successfully. You can now login.");
                    setVerified(true);
                } else {
                    setMessage("Verification failed or token expired.");
                }
            })
            .catch(() => {
                setMessage("Something went wrong. Please try again later.");
            });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-xl font-medium text-amber-500">
            <p className="mb-4">{message}</p>
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
