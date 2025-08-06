import React from "react";
import {
    FaWhatsapp,
    FaInstagram,
    FaLinkedin,
    FaXTwitter,
    FaGithub,
} from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className=" border-t border-sec sm:mx-15 px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 items-center  text-center md:text-left py-2">
                {/* Left Section (Logo) */}
                <div className="mx-auto md:mx-0 mb-3 mb:0">
                    <a href="https://ds17portfolio.netlify.app/" alt="Portfolio" target="_blank">
                        <img
                            src="/assets/ds.png"
                            alt="D.S Logo"
                            className="h-[65px]"
                        />
                    </a>
                </div>

                {/* Center Section (Text) */}
                <div className="mb-6 md:mb-0">
                    <p className="font-semibold text-sm mb-1 text-center">
                        &copy; Pizza Forge - {new Date().getFullYear()}
                    </p>
                    <p className="text-xs text-center text-sec">All rights reserved.</p>
                </div>

                {/* Right Section (Social Icons) */}
                <div className="flex justify-center md:justify-end gap-5 text-2xl mb-2 md:mb-0">
                    <a
                        href="https://wa.me/916367248171"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-secondary transition-colors"
                    >
                        <FaWhatsapp />
                    </a>
                    <a
                        href="https://www.instagram.com/kd17_02/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-secondary transition-colors"
                    >
                        <FaInstagram />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/divyansh-sharma-1a7a24276/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-secondary transition-colors"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href="https://twitter.com/I_am_DS_17"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-secondary transition-colors"
                    >
                        <FaXTwitter />
                    </a>
                    <a
                        href="https://github.com/kd17-ds"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-secondary transition-colors"
                    >
                        <FaGithub />
                    </a>
                </div>
            </div>
        </footer>

    );
}
