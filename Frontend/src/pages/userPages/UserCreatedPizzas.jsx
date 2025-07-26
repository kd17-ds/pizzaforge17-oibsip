import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { BASE_URL } from "../../constants/constants";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";
import httpStatus from "http-status";
import { useCart } from "../../contexts/CartContext";

export default function CreatePizzaPage() {
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const [inventory, setInventory] = useState({});
    const { addToCart } = useCart();

    const client = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
    });

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                showLoader();
                const res = await client.get("/customized-pizzas/allcustomizedpizza");
                if (res.status === httpStatus.OK) {
                    setInventory(res.data);
                }
            } catch (err) {
                showNotification("Error Fetching", "error");
            } finally {
                hideLoader();
            }
        };

        fetchInventory();
    }, []);

    const handleDelete = async (id) => {
        try {
            showLoader();
            const res = await client.delete(`/customized-pizzas/deletecstpizza/${id}`);
            if (res.status === httpStatus.OK) {
                showNotification("Pizza Deleted", "success");
                let filtered = inventory.filter((pizza) => pizza._id !== id);
                setInventory(filtered);
            }
        } catch (err) {
            showNotification("Error Deleting", "error");
        } finally {
            hideLoader();
        }
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {inventory.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inventory.map((pizza) => (
                        <div key={pizza._id} className="bg-white p-4 rounded-xl shadow-md">
                            <h2 className="text-xl font-bold mb-2"> {`Custom (${pizza.baseType.name.slice(0, 5)}, ${pizza.sauce.name.slice(0, 5)}, ${pizza.cheese.name.slice(0, 5)})`}</h2>
                            <p><strong>Base:</strong> {pizza.baseType.name}</p>
                            <p><strong>Sauce:</strong> {pizza.sauce.name}</p>
                            <p><strong>Cheese:</strong> {pizza.cheese.name}</p>
                            <p><strong>Veggies:</strong> {pizza.veggies.map(v => v.name).join(", ")}</p>
                            <p><strong>Total Price:</strong> ₹{pizza.totalPrice}</p>
                            <div className="flex gap-3 mt-4 flex-wrap">
                                <button
                                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                                    onClick={() =>
                                        addToCart({
                                            isCustom: true,
                                            pizzaRef: pizza._id,
                                            modelRef: "CreatedPizzaModel",
                                            name: `Custom (${pizza.baseType.name.slice(0, 5)}, ${pizza.sauce.name.slice(0, 5)}, ${pizza.cheese.name.slice(0, 5)})`,
                                            price: pizza.totalPrice,
                                            quantity: 1,
                                        })
                                    }
                                >
                                    Add to Cart
                                </button>

                                <Link
                                    to={`/updatedcstpizza/${pizza._id}`}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => handleDelete(pizza._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">No custom pizzas available.</p>
            )}
        </div>
    );
}
