import React, { useState, useEffect } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotification } from '../../contexts/NotificationContext'
import { useAuth } from "../../hooks/useAuth";
import { useLoader } from "../../contexts/LoadingContext";
import { BASE_URL } from "../../constants/constants";
import axios from 'axios';

export default function Authentication({ formType }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [formState, setFormState] = useState(formType === "signup" ? 1 : 0);
    const [email, setEmail] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const { handleRegister, handleLogin } = useAuth();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        if (location.pathname === "/signup") setFormState(1);
        else if (location.pathname === "/login") setFormState(0);
    }, [location.pathname]);

    const handleToggle = (state) => {
        setFormState(state);
        navigate(state === 0 ? "/login" : "/signup");
    };

    const handleAuth = async () => {
        try {
            showLoader();
            if (formState === 0) {
                const result = await handleLogin(email, password);
                console.log("Login result:", result);
                if (!result) {
                    showNotification("Login failed. Please try again.", "error");
                    hideLoader();
                    return;
                }
                const { message: msg, user: loggedInUser } = result;

                if (!loggedInUser?.verified) {
                    showNotification("Please verify your email before logging in.", "warning");
                    hideLoader();
                    return;
                }

                showNotification(msg || "Login successful!", "success");
                navigate(loggedInUser?.isAdmin ? '/admin/home' : '/');
            }

            if (formState === 1) {
                const msg = await handleRegister(name, username, password, email);
                showNotification(msg || "A verification link has been sent to your email.", "success");
                setFormState(0);
                navigate("/login");
            }
        } catch (err) {
            showNotification(err.message || "An error occurred", "error");
        } finally {
            hideLoader();
        }
    };

    const passChange = async () => {
        if (!email) {
            showNotification("Please enter your email to reset password.", "error");
            return;
        }
        try {
            showLoader();
            const res = await axios.post(`${BASE_URL}/forgotpass`, { email });
            showNotification(res.data.message || "Reset link sent to your email", "success");
        } catch (err) {
            showNotification(err.message || "Something went wrong.", "error");
        } finally {
            hideLoader();
        }
    }



    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 lg:pb-0 pb-10">
            <div className="w-full max-w-md bg-white p-8 rounded shadow">
                <div className="flex flex-col items-center">
                    <div className="bg-sec text-white p-4 rounded-full mb-4">
                        <LockOutlinedIcon className="w-6 h-6" />
                    </div>

                    <div className="flex space-x-4 mb-6">
                        <button
                            onClick={() => handleToggle(0)}
                            className={`px-4 py-2 font-medium ${formState === 0 ? "bg-sec text-white" : "bg-gray-200 text-black"} rounded hover:cursor-pointer`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => handleToggle(1)}
                            className={`px-4 py-2 font-medium ${formState === 1 ? "bg-sec text-white" : "bg-gray-200 text-black"} rounded hover:cursor-pointer`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form className="w-full space-y-4">
                        {formState === 1 && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                />

                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                />
                            </>
                        )}

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />

                        {formState === 0 && (
                            <div className="w-full text-left">
                                <button
                                    type="button"
                                    className="text-blue-600 text-sm hover:underline hover:cursor-pointer"
                                    onClick={passChange}
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}


                        <button
                            type="button"
                            onClick={handleAuth}
                            className="w-full bg-sec text-white py-2 rounded hover:bg-lite transition hover:cursor-pointer"
                        >
                            {formState === 0 ? "Login" : "Register"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
