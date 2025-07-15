import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants/constants";
import { useLoader } from "../contexts/LoadingContext";
import { useNotification } from '../contexts/NotificationContext'

export default function ForgotPass() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();

    const handleSubmit = async () => {
        const token = new URLSearchParams(window.location.search).get("token");

        if (!token) {
            showNotification("Invalid or missing token.", "error"); setError("Invalid or missing token.");
            return;
        }

        if (!password || !confirmPassword) {
            showNotification("Please fill in both fields.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showNotification("Password doesn't match.", "error");
            return;
        }

        try {
            showLoader();
            const res = await axios.post(`${BASE_URL}/resetpass?token=${token}`, {
                password,
            });

            showNotification(res.data.message || "Password reset successfully", "success");
            navigate("/login");
        } catch (err) {
            showNotification("Reset failed. Try again.", "error");
        } finally {
            hideLoader();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                    Reset Your Password
                </h2>

                <div className="space-y-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-sec text-white py-2 rounded hover:bg-lite transition"
                    >
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    );
}
