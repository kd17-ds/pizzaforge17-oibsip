import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { BASE_URL } from "../../constants/constants";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";
import httpStatus from "http-status";
import { useCart } from "../../contexts/CartContext";
import { MdEdit, MdDelete } from "react-icons/md";


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
        <div className="bg-lite text-sec px-6 md:px-20 py-16">
            {/* Header */}
            <div className="flex flex-col gap-6 mb-16 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                        Explore <span className="text-primary">Delicious Flavors</span> <br />
                        Like Never Before <br /> at <span className="text-primary">Pizza Forge</span>
                    </h1>
                </div>

                <div className="w-full md:w-fit">
                    <Link
                        to="/customizepizza"
                        className="block w-full md:w-fit text-center border-2 border-sec text-lg text-sec px-6 py-2 rounded-full font-semibold hover:border-primary hover:bg-primary hover:text-white transition-all duration-200"
                    >
                        + Create New Pizza
                    </Link>
                </div>
            </div>


            {/* Pizza Grid */}
            {inventory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10">
                    {inventory.map((pizza) => (
                        <div
                            key={pizza._id}
                            className="bg-primary/20 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-lg transition duration-300 overflow-hidden flex flex-col"
                        >
                            <div className="relative h-36 w-full overflow-hidden">
                                <img
                                    src="/assets/pizza1.jpg"
                                    alt="Custom Pizza"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute bottom-0 w-full bg-black/40 text-white px-3 py-2 backdrop-blur-sm text-xs sm:text-sm">
                                    <h2 className="font-bold">{`Custom (${pizza.baseType.name.slice(0, 5)}, ${pizza.sauce.name.slice(0, 5)}, ${pizza.cheese.name.slice(0, 5)})`}</h2>
                                </div>
                            </div>

                            <div className="p-4 flex flex-col justify-between flex-grow space-y-2">
                                <div className="space-y-1 text-sm text-gray-800">
                                    <p><strong>Base:</strong> {pizza.baseType.name}</p>
                                    <p><strong>Sauce:</strong> {pizza.sauce.name}</p>
                                    <p><strong>Cheese:</strong> {pizza.cheese.name}</p>
                                    <p><strong>Veggies:</strong> {pizza.veggies.map(v => v.name).join(", ")}</p>
                                </div>

                                <hr className="border-t border-gray-300" />

                                <div className="flex items-center justify-between border-t pt-4">
                                    <div className="text-lg font-semibold text-right text-sec">
                                        ₹{pizza.totalPrice}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            className="text-xs text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-primary)] px-3 py-1.5 rounded-full transition cursor-pointer w-fit"
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
                                            Add
                                        </button>

                                        <Link
                                            to={`/updatedcstpizza/${pizza._id}`}
                                            className="text-sec hover:text-primary transition hover:cursor-pointer"
                                            title="Edit"
                                        >
                                            <MdEdit className="w-5 h-5" />
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(pizza._id)}
                                            className="text-rose-600 hover:text-rose-800 transition hover:cursor-pointer"
                                            title="Delete"
                                        >
                                            <MdDelete className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xl text-center font-semibold text-sec">No custom pizzas created yet.</p>
            )}
        </div>
    );
}
