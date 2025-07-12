import { createContext, useState } from "react";
import axios from "axios";
import httpStatus from "http-status";
import { BASE_URL } from "../constants/constants";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${BASE_URL}`,
    withCredentials: true
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (name, username, password, email) => {
        try {
            const res = await client.post("/signup", {
                name,
                username,
                password,
                email,
            });

            if (res.status === httpStatus.CREATED) {
                return res.data.message;
            }
        } catch (err) {
            throw err;
        }
    };


    const handleLogin = async (email, password) => {
        try {
            const res = await client.post("/login", { email, password });
            console.log("Login response:", res);

            if (res.status === httpStatus.OK) {
                // Extract token from cookie
                const token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("token="))
                    ?.split("=")[1];

                let tokenData = {};

                if (token) {
                    const decoded = jwtDecode(token);
                    tokenData = { id: decoded.id, isAdmin: decoded.isAdmin };
                }

                const fullUser = {
                    ...res.data.user,
                    ...tokenData,
                };

                setUser(fullUser);
                return { message: res.data.message, user: fullUser };
            }

            return null;
        } catch (err) {
            console.error("Login error:", err);
            return null;
        }
    };

    const data = {
        user,
        setUser,
        handleRegister,
        handleLogin,
    };

    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
