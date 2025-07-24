import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";
import httpStatus from "http-status";

export default function UpdateCustomizedPizza() {
    const navigate = useNavigate();
    const { id } = useParams();
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
        const fetchAll = async () => {
            try {
                showLoader();

                // 1. Fetch Inventory First
                const inventoryRes = await client.get("/customized-pizzas/allingridients");
                if (inventoryRes.status !== httpStatus.OK) {
                    throw new Error("Failed to fetch inventory");
                }
                const inventoryData = inventoryRes.data;
                console.log(inventoryData)
                setInventory(inventoryData);

                // 2. Now fetch the Pizza (after inventory is set)
                const pizzaRes = await client.get(`/customized-pizzas/updatedcstpizza/${id}`);
                const pizza = pizzaRes.data;
                console.log(pizza)

                const baseObj = inventoryData.base.find(item => item.name === pizza.baseType.name);
                const cheeseObj = inventoryData.cheese.find(item => item.name === pizza.cheese.name);
                const sauceObj = inventoryData.sauce.find(item => item.name === pizza.sauce.name);
                const veggieObjs = inventoryData.veggie.filter(invVeg =>
                    pizza.veggies.some(pizzaVeg => pizzaVeg.name === invVeg.name)
                );


                console.log("Selected base:", baseObj);
                console.log("Selected cheese:", cheeseObj);
                console.log("Selected sauce:", sauceObj);
                console.log("Selected veggies:", veggieObjs);

                // 4. Set all selections
                setSelectedBase(baseObj || null);
                setSelectedCheese(cheeseObj || null);
                setSelectedSauce(sauceObj || null);
                setSelectedVeggies(veggieObjs || []);
            } catch (err) {
                showNotification("Error Fetching Pizza or Ingredients", "error");
            } finally {
                hideLoader();
            }
        };

        fetchAll();
    }, [id]); // depends only on pizza ID


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

    const handleUpdatePizza = async () => {
        if (!selectedBase || !selectedCheese || !selectedSauce) {
            showNotification("Please select base, cheese, and sauce", "warning");
            return;
        }

        try {
            showLoader();
            const res = await client.put(`/customized-pizzas/updatedcstpizza/${id}`, {
                baseType: selectedBase._id,
                cheese: selectedCheese._id,
                sauce: selectedSauce._id,
                veggies: selectedVeggies.map((v) => v._id),
                totalPrice: total,
            });

            if (res.status === httpStatus.CREATED || res.status === httpStatus.OK) {
                showNotification("Pizza Updated successfully!", "success");
                navigate("/allcustomizedpizza");
            }
        } catch (err) {
            console.error(err);
            showNotification("Failed to Update pizza", "error");
        } finally {
            hideLoader();
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
                🍕 Update Your Custom Pizza
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
                                                        className={`text-xs font-medium ${item.isAvailable
                                                            ? "text-green-600"
                                                            : "text-red-500"
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
                        onClick={handleUpdatePizza}
                        disabled={!selectedBase || !selectedCheese || !selectedSauce}
                    >
                        🍕 Update Pizza
                    </button>
                </div>
            </div>
        </div>
    );
}
