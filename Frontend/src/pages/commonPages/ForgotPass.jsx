import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { useNotification } from "../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const token = new URLSearchParams(window.location.search).get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showNotification("Passwords do not match", "error");
            return;
        }

        try {
            setSubmitting(true);
            const res = await axios.post(`${BASE_URL}/resetpass?token=${token}`, { password });

            if (res.data.message === "Password changed successfully") {
                showNotification("Password changed! Please login.", "success");
                navigate("/login");
            } else {
                showNotification(res.data.message || "Reset failed.", "error");
            }
        } catch (err) {
            showNotification("Something went wrong. Try again.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-225px)] pt-[75px] flex items-center justify-center px-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold text-center text-sec mb-6">Reset Your Password</h2>

                <label className="block mb-2 text-gray-700 font-medium">New Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sec"
                    required
                />

                <label className="block mb-2 text-gray-700 font-medium">Confirm New Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sec"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-sec hover:bg-primary text-white font-semibold py-2 rounded-lg transition"
                    disabled={submitting}
                >
                    {submitting ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}
