import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants/constants";

export default function ForgotPass() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const token = new URLSearchParams(window.location.search).get("token");

        if (!token) {
            setError("Invalid or missing token.");
            return;
        }

        if (!password || !confirmPassword) {
            setError("Please fill in both fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await axios.post(`${BASE_URL}/resetpass?token=${token}`, {
                password,
            });

            setMessage(res.data.message || "Password reset successfully");
            setError("");
            navigate("/login");
        } catch (err) {
            setError("Reset failed. Try again.");
            setMessage("");
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

                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    {message && <p className="text-green-600 text-sm">{message}</p>}

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
