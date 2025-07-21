import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../constants/constants";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";
import httpStatus from "http-status";

export default function InventoryManagementPage() {

    const [inventory, setInventory] = useState({});
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();

    const client = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
    });

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                showLoader();
                const res = await client.get("/customized-pizzas/allingridients");
                if (res.status === httpStatus.OK) {
                    console.log(res.data);

                    setInventory(res.data);
                    console.log(inventory.base[3].price)


                }
            } catch (err) {
                showNotification("Error Fetching", "error");
            } finally {
                hideLoader();
            }
        }

        fetchInventory();
    }, [])

    const handleDelete = async (id, type) => {
        const confirm = window.confirm("Are you sure you want to delete this Ingridient?");
        if (!confirm) return;
        try {
            showLoader();
            const res = await client.delete(`${BASE_URL}/customized-pizzas/deleteingridient/${id}?type=${type}`);
            if (res.status === httpStatus.OK) {
                setInventory((prev) => ({
                    ...prev,
                    [type]: prev[type].filter((ingredient) => ingredient._id !== id),
                }));
                showNotification(`${type} deleted successfully`, "success");
            }
        } catch (err) {
            console.error("Error deleting Ingridient:", err);
        } finally {
            hideLoader();
        }
    };
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

    const typeLabels = {
        base: "Base",
        cheese: "Cheeses",
        sauce: "Sauces",
        veggie: "Veggies"
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center">🍕 Inventory Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["base", "cheese", "sauce", "veggie"].map((type) => (
                    inventory[type]?.length > 0 && (
                        <div key={type} className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4 text-indigo-600">{typeLabels[type]}</h2>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                                {inventory[type].map((ingredient) => (
                                    <div key={ingredient._id} className="border p-3 rounded-lg flex flex-col gap-1 bg-gray-50">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-800">{ingredient.name}</span>
                                            <span className="text-sm text-gray-500">{formatDate(ingredient.createdAt)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>💰 Price: ₹{ingredient.price}</span>
                                            <span>📦 Qty: {ingredient.availableQty}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Status: {ingredient.isAvailable ? (
                                                <span className="text-green-600 font-semibold">In Stock</span>
                                            ) : (
                                                <span className="text-red-600 font-semibold">Out of Stock</span>
                                            )}</span>

                                            <div className="flex gap-2">
                                                <Link
                                                    to={`updateingridient/${ingredient._id}?type=${type}`}
                                                    className="text-blue-600 hover:underline text-sm font-semibold"
                                                >
                                                    ✏️ Update
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(ingredient._id, type)}
                                                    className="text-red-600 hover:underline text-sm font-semibold"
                                                >
                                                    🗑 Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link
                                to={`addingridient?type=${type}`}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                            >
                                Add {typeLabels[type]}
                            </Link>
                        </div>
                    )
                ))}
            </div>

            {Object.values(inventory).every((arr) => !arr || arr.length === 0) && (
                <div className="text-center text-gray-500 mt-10">No inventory data available.</div>
            )}
        </div>
    );
}