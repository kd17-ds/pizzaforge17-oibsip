import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../constants/constants";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";
import httpStatus from "http-status";

export default function CreatePizzaPage() {
    const [inventory, setInventory] = useState({});
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const [selectedBase, setSelectedBase] = useState(null);
    const [selectedCheese, setSelectedCheese] = useState(null);
    const [selectedSauce, setSelectedSauce] = useState(null);
    const [selectedVeggies, setSelectedVeggies] = useState([]);

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

    const handleVeggieToggle = (veggie) => {
        if (selectedVeggies.find((v) => v._id === veggie._id)) {
            setSelectedVeggies((prev) => prev.filter((v) => v._id !== veggie._id));
        } else {
            setSelectedVeggies((prev) => [...prev, veggie]);
        }
    };

    const calculateTotal = () => {
        const basePrice = selectedBase?.price || 0;
        const cheesePrice = selectedCheese?.price || 0;
        const saucePrice = selectedSauce?.price || 0;
        const veggiesPrice = selectedVeggies.reduce((sum, v) => sum + v.price, 0);
        const subtotal = basePrice + cheesePrice + saucePrice + veggiesPrice;
        const gst = subtotal * 0.05;
        const total = subtotal + gst;
        return { subtotal, gst, total };
    };

    const { subtotal, gst, total } = calculateTotal();

    const typeLabels = {
        base: "Base",
        cheese: "Cheeses",
        sauce: "Sauces",
        veggie: "Veggies",
    };

    const handleCreatePizza = async () => {
        if (!selectedBase || !selectedCheese || !selectedSauce) {
            showNotification("Please select base, cheese, and sauce", "warning");
            return;
        }

        try {
            showLoader();
            const res = await client.post("/customized-pizzas/customizepizza", {
                baseType: selectedBase._id,
                cheese: selectedCheese._id,
                sauce: selectedSauce._id,
                veggies: selectedVeggies.map((v) => v._id),
                totalPrice: total,
            });

            if (res.status === httpStatus.CREATED || res.status === httpStatus.OK) {
                showNotification("Pizza created successfully!", "success");
            }
        } catch (err) {
            console.error(err);
            showNotification("Failed to create pizza", "error");
        } finally {
            hideLoader();
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
                🍕 Create Your Custom Pizza
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ingredient Selection */}
                <div className="lg:col-span-2 space-y-6">
                    {["base", "cheese", "sauce", "veggie"].map(
                        (type) =>
                            inventory[type]?.length > 0 && (
                                <div key={type}>
                                    <h2 className="text-xl font-semibold text-indigo-600 mb-2">
                                        {typeLabels[type]}
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {inventory[type].map((item) => {
                                            const isSelected =
                                                type === "veggie"
                                                    ? selectedVeggies.find((v) => v._id === item._id)
                                                    : (type === "base" &&
                                                        selectedBase?._id === item._id) ||
                                                    (type === "cheese" &&
                                                        selectedCheese?._id === item._id) ||
                                                    (type === "sauce" &&
                                                        selectedSauce?._id === item._id);

                                            const toggleSelect = () => {
                                                if (type === "veggie") handleVeggieToggle(item);
                                                else if (type === "base") setSelectedBase(item);
                                                else if (type === "cheese") setSelectedCheese(item);
                                                else if (type === "sauce") setSelectedSauce(item);
                                            };

                                            return (
                                                <div
                                                    key={item._id}
                                                    className={`
                                                               border rounded-xl p-3 bg-white shadow-md transition 
                                                              ${isSelected
                                                            ? "border-indigo-500 ring-2 ring-indigo-300"
                                                            : "border-gray-300"
                                                        }
                                                       ${item.isAvailable
                                                            ? "cursor-pointer hover:shadow-lg"
                                                            : "opacity-50 cursor-not-allowed"
                                                        }
                                                      `}
                                                    onClick={() => {
                                                        if (!item.isAvailable) return;
                                                        toggleSelect();
                                                    }}
                                                >
                                                    <div className="font-medium text-gray-800">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        ₹{item.price}
                                                    </div>
                                                    <div
                                                        className={`text-xs font-medium ${item.isAvailable ? "text-green-600" : "text-red-500"
                                                            }`}
                                                    >
                                                        {item.isAvailable ? "Available" : "Unavailable"}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )
                    )}
                </div>

                {/* Summary Section */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 sticky top-10 h-fit">
                    <h3 className="text-xl font-bold text-indigo-600 mb-4">
                        📋 Your Selection
                    </h3>

                    <div className="space-y-2 text-sm text-gray-700">
                        {selectedBase && (
                            <div className="flex justify-between">
                                <span>Base: {selectedBase.name}</span>
                                <span>₹{selectedBase.price}</span>
                            </div>
                        )}
                        {selectedCheese && (
                            <div className="flex justify-between">
                                <span>Cheese: {selectedCheese.name}</span>
                                <span>₹{selectedCheese.price}</span>
                            </div>
                        )}
                        {selectedSauce && (
                            <div className="flex justify-between">
                                <span>Sauce: {selectedSauce.name}</span>
                                <span>₹{selectedSauce.price}</span>
                            </div>
                        )}
                        {selectedVeggies.length > 0 && (
                            <div>
                                <div className="font-semibold mb-1">Veggies:</div>
                                {selectedVeggies.map((veg) => (
                                    <div key={veg._id} className="flex justify-between ml-2">
                                        <span>🥬 {veg.name}</span>
                                        <span>₹{veg.price}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <hr className="my-4" />

                    <div className="text-sm text-gray-800 space-y-1">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>GST (5%):</span>
                            <span>₹{gst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-indigo-700">
                            <span>Total:</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition"
                        onClick={handleCreatePizza}
                        disabled={!selectedBase || !selectedCheese || !selectedSauce}
                    >
                        🍕 Create Pizza
                    </button>
                </div>
            </div>
        </div>
    );
}
