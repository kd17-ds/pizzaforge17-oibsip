import { Outlet } from "react-router-dom";
import Navbar from "../components/navigtional/Navbar";
import Footer from '../components/navigtional/Footer'

export default function MainLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}