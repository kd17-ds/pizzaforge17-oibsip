import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../constants/constants";
import httpStatus from "http-status";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

export default function ShowPizzasPage() {

    const client = axios.create({
        baseURL: BASE_URL,
        withCredentials: true
    });

    const { showLoader, hideLoader } = useLoader();
    const { showNotification, hideNotification } = useNotification();
    const [pizzas, setPizzas] = useState([]);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const { user } = useAuth();

    const fetchData = async () => {
        try {
            showLoader();
            const pizzaData = await client.get(`/pizzas/showallpizzas`);
            setPizzas(pizzaData.data);
            if (user.isAdmin) {
                setShowUpdate(true);
                setShowDelete(true);
            }
        } catch (err) {
            showNotification(err || "An error Occured", "error")
        } finally {
            hideLoader();
        }
    }

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this transaction?");
        if (!confirm) return;
        try {
            showLoader();
            const res = await client.delete(`${BASE_URL}/pizzas/deletepizza/${id}`);
            if (res.status === httpStatus.OK) {
                setPizzas(pizzas.filter((pizza) => pizza._id !== id));
                showNotification("Pizza deleted successfully", "success");
            }
        } catch (err) {
            console.error("Error deleting pizza:", err);
        } finally {
            hideLoader();
        }
    };

    return (
        <>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pizzas.map((pizza) => (
                    <div
                        key={pizza._id}
                        className="bg-white rounded-2xl shadow-md p-4 flex flex-col justify-between"
                    >
                        <img
                            src={pizza.image_url}
                            alt={pizza.name}
                            className="w-full h-40 object-cover rounded-xl mb-3"
                        />
                        <h2 className="text-lg font-bold">{pizza.name}</h2>
                        <p className="text-sm text-gray-600">{pizza.description}</p>
                        <p className="text-sm mt-1">Category: {pizza.category}</p>
                        <div className="mt-2 text-sm text-gray-700">
                            <p>Small: ₹{pizza.prices?.small}</p>
                            <p>Medium: ₹{pizza.prices?.medium}</p>
                            <p>Large: ₹{pizza.prices?.large}</p>
                        </div>
                        <div className="flex justify-between mt-4">
                            {showUpdate && (
                                <Link
                                    to={`pizzas/updatepizza/${pizza._id}`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                                >
                                    Update
                                </Link>
                            )}
                            {showDelete && (
                                <button
                                    onClick={() => handleDelete(pizza._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}