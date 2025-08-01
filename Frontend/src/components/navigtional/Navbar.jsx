import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // adjust path if needed
import axios from "axios";
import { BASE_URL } from "../../constants/constants"; // adjust path if needed

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const profileRefMobile = useRef();
    const profileRefDesktop = useRef();
    const toggleButtonRef = useRef();

    const navLinks = [
        { name: "Menu", path: "/showallpizzas" },
        { name: "My Pizzas", path: "/allcustomizedpizza" },
        { name: "Orders", path: "/myorders" },
    ];

    const getInitials = (name, username) => {
        const str = name?.trim() || username?.trim() || "";
        if (!str) return "";
        const parts = str.split(" ");
        if (parts.length === 1) {
            return (parts[0][0] || "").toUpperCase() + (parts[0][1] || "").toUpperCase();
        }
        return (parts[0][0] || "").toUpperCase() + (parts[1][0] || "").toUpperCase();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen) {
                const mobileMenu = document.getElementById("mobile-menu");
                if (
                    mobileMenu &&
                    !mobileMenu.contains(event.target) &&
                    toggleButtonRef.current &&
                    !toggleButtonRef.current.contains(event.target)
                ) {
                    setIsOpen(false);
                }
            }

            if (
                showProfileDropdown &&
                !(
                    (profileRefDesktop.current && profileRefDesktop.current.contains(event.target)) ||
                    (profileRefMobile.current && profileRefMobile.current.contains(event.target))
                )
            ) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, showProfileDropdown]);

    const handleLogout = async () => {
        try {
            await axios.get(`${BASE_URL}/logout`, { withCredentials: true });
            setUser(null);
            setShowProfileDropdown(false);
            setIsOpen(false);
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <nav className="shadow-md h-[75px] bg-sec w-full sticky top-0 z-50 text-lite">
            <div className="flex justify-between items-center h-full px-4 sm:px-6">
                <NavLink to="/" onClick={() => setIsOpen(false)}>
                    <img
                        src="/assets/logo.png"
                        alt="Pizza Forge Logo"
                        className="h-[50px]"
                    />
                </NavLink>

                {/* Mobile: toggle + profile */}
                <div className="md:hidden flex items-center space-x-4">
                    {user && (
                        <div
                            className="w-9 h-9 rounded-full bg-lite text-sec flex items-center justify-center cursor-pointer font-semibold uppercase text-sm relative"
                            ref={profileRefMobile}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowProfileDropdown((prev) => !prev);
                            }}
                        >
                            {getInitials(user.name, user.username)}

                            {showProfileDropdown && (
                                <div className="absolute right-0 top-[60px] mt-2 w-64 bg-lite text-sec shadow-lg rounded-md z-50 px-4 py-3 text-left">
                                    <p className="text-sm font-semibold mb-1">{user.name}</p>
                                    <p className="text-sm mb-1 lowercase">{user.username?.toLowerCase()}</p>
                                    <p className="text-sm text-gray-600 mb-3 lowercase">{user.email?.toLowerCase()}</p>
                                    <button
                                        onClick={handleLogout}
                                        className=" hover:cursor-pointer text-sm bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded w-full transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        ref={toggleButtonRef}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsOpen((prev) => !prev);
                        }}
                        className="text-lite hover:cursor-pointer"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8 px-4">
                    {navLinks.map((link, index) => (
                        <NavLink
                            key={index}
                            to={link.path}
                            onMouseEnter={() => setHoveredLink(index)}
                            onMouseLeave={() => setHoveredLink(null)}
                            className={({ isActive }) =>
                                `text-base font-medium transition-colors duration-200 ${isActive || hoveredLink === index ? "text-primary underline underline-offset-6" : "text-lite"
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}

                    {user && (
                        <div
                            className="ml-4 w-9 h-9 rounded-full bg-lite text-sec flex items-center justify-center cursor-pointer font-semibold uppercase text-sm relative"
                            ref={profileRefDesktop}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowProfileDropdown((prev) => !prev);
                            }}
                        >
                            {getInitials(user.name, user.username)}

                            {showProfileDropdown && (
                                <div className="absolute right-0 top-[60px] mt-2 w-64 bg-lite text-sec shadow-lg rounded-md z-50 px-4 py-3 text-left">
                                    <p className="text-sm font-semibold mb-1">{user.name}</p>
                                    <p className="text-sm mb-1 lowercase">{user.username}</p>
                                    <p className="text-sm text-gray-600 mb-3 lowercase">{user.email}</p>
                                    <button
                                        onClick={handleLogout}
                                        className="hover:cursor-pointer text-sm bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded w-full transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div
                    id="mobile-menu"
                    className="md:hidden pt-2 pb-2 text-center bg-lite text-sec shadow-lg"
                >
                    {navLinks.map((link, index) => (
                        <NavLink
                            key={index}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-base font-medium transition-colors duration-200 hover:bg-secondary hover:text-primary"
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>
            )}
        </nav>
    );
}