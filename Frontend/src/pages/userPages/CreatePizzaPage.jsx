import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";
import httpStatus from "http-status";
import { useNavigate } from "react-router-dom";

export default function CreatePizzaPage() {
    const navigate = useNavigate();
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
                navigate("/allcustomizedpizza");
            }
        } catch (err) {
            console.error(err);
            showNotification("Failed to create pizza", "error");
        } finally {
            hideLoader();
        }
    };

    return (
        <div className="bg-lite min-h-screen py-10 px-4 md:px-10">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-sec p-8 space-y-10">
                <h1 className="text-3xl font-bold text-center text-primary"> Build Your Pizza</h1>

                {/* Base Selection */}
                <section>
                    <h2 className="text-xl font-semibold text-sec mb-3">1. Choose a Base</h2>
                    <div className="flex flex-wrap gap-3">
                        {inventory.base?.map((item) => (
                            <button
                                key={item._id}
                                onClick={() => item.isAvailable && setSelectedBase(item)}
                                disabled={!item.isAvailable}
                                className={`border px-4 py-2 rounded-lg text-sm transition 
                            ${selectedBase?._id === item._id ? "bg-sec text-white border-sec" : "border-gray-300 bg-lite"}
                            ${item.isAvailable
                                        ? "hover:bg-primary hover:text-white cursor-pointer"
                                        : "opacity-50 cursor-not-allowed"}
                        `}
                            >
                                {item.name} – ₹{item.price}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Cheese Selection */}
                <section>
                    <h2 className="text-xl font-semibold text-sec mb-3">2. Select Cheese</h2>
                    <div className="flex flex-wrap gap-3">
                        {inventory.cheese?.map((item) => (
                            <button
                                key={item._id}
                                onClick={() => item.isAvailable && setSelectedCheese(item)}
                                disabled={!item.isAvailable}
                                className={`border px-4 py-2 rounded-lg text-sm transition 
                            ${selectedCheese?._id === item._id ? "bg-sec text-white border-sec" : "border-gray-300 bg-lite"}
                            ${item.isAvailable
                                        ? "hover:bg-primary hover:text-white cursor-pointer"
                                        : "opacity-50 cursor-not-allowed"}
                        `}
                            >
                                {item.name} – ₹{item.price}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Sauce Selection */}
                <section>
                    <h2 className="text-xl font-semibold text-sec mb-3">3. Pick Your Sauce</h2>
                    <div className="flex flex-wrap gap-3">
                        {inventory.sauce?.map((item) => (
                            <button
                                key={item._id}
                                onClick={() => item.isAvailable && setSelectedSauce(item)}
                                disabled={!item.isAvailable}
                                className={`border px-4 py-2 rounded-lg text-sm transition 
                            ${selectedSauce?._id === item._id ? "bg-sec text-white border-sec" : "border-gray-300 bg-lite"}
                            ${item.isAvailable
                                        ? "hover:bg-primary hover:text-white cursor-pointer"
                                        : "opacity-50 cursor-not-allowed"}
                        `}
                            >
                                {item.name} – ₹{item.price}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Veggie Selection */}
                <section>
                    <h2 className="text-xl font-semibold text-sec mb-3">4. Add Veggies</h2>
                    <div className="flex flex-wrap gap-3">
                        {inventory.veggie?.map((item) => {
                            const isSelected = selectedVeggies.some((v) => v._id === item._id);
                            return (
                                <button
                                    key={item._id}
                                    onClick={() => item.isAvailable && handleVeggieToggle(item)}
                                    disabled={!item.isAvailable}
                                    className={`border px-4 py-2 rounded-lg text-sm transition 
                                ${isSelected ? "bg-sec text-white border-sec" : "border-gray-300 bg-lite"}
                                ${item.isAvailable
                                            ? "hover:bg-primary hover:text-white cursor-pointer"
                                            : "opacity-50 cursor-not-allowed"}
                            `}
                                >
                                    {item.name} – ₹{item.price}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Summary */}
                <section className="bg-lite border border-sec p-5 rounded-2xl">
                    <h3 className="text-lg font-bold text-sec mb-4">📋 Order Summary</h3>
                    <div className="text-sm text-gray-800 space-y-1">
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
                        {selectedVeggies.map((veg) => (
                            <div key={veg._id} className="flex justify-between">
                                <span>🥬 {veg.name}</span>
                                <span>₹{veg.price}</span>
                            </div>
                        ))}
                        <hr className="my-3 border-sec" />
                        <div className="flex justify-between font-medium">
                            <span>Subtotal:</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>GST (5%):</span>
                            <span>₹{gst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-primary text-base">
                            <span>Total:</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                </section>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        onClick={handleCreatePizza}
                        disabled={!selectedBase || !selectedCheese || !selectedSauce}
                        className="w-full mt-4 bg-sec hover:cursor-pointer hover:bg-primary text-white font-semibold py-3 rounded-xl text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create Pizza
                    </button>
                </div>
            </div>
        </div>

    );
}
