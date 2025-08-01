import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../constants/constants";
import httpStatus from "http-status";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";

export default function ShowPizzasPage() {
    const client = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
    });

    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { user } = useAuth();
    const { addToCart } = useCart();

    const [allPizzas, setAllPizzas] = useState([]);
    const [pizzas, setPizzas] = useState([]);
    const [filter, setFilter] = useState("");
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    // Fetch only once
    useEffect(() => {
        const fetchData = async () => {
            try {
                showLoader();
                const pizzaData = await client.get(`/pizzas/showallpizzas`);
                setAllPizzas(pizzaData.data);
                setPizzas(pizzaData.data);
                if (user.isAdmin) {
                    setShowUpdate(true);
                    setShowDelete(true);
                }
            } catch (err) {
                showNotification(err?.message || "An error occurred", "error");
            } finally {
                hideLoader();
            }
        };

        fetchData();
    }, []);

    // Filter pizzas locally
    useEffect(() => {
        if (filter === "Veg") {
            setPizzas(allPizzas.filter((pizza) => pizza.category === "Veg"));
        } else if (filter === "Non-Veg") {
            setPizzas(allPizzas.filter((pizza) => pizza.category === "Non-Veg"));
        } else {
            setPizzas(allPizzas);
        }
    }, [filter, allPizzas]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this pizza?");
        if (!confirmDelete) return;

        try {
            showLoader();
            const res = await client.delete(`${BASE_URL}/pizzas/deletepizza/${id}`);
            if (res.status === httpStatus.OK) {
                const updatedPizzas = pizzas.filter((pizza) => pizza._id !== id);
                const updatedAll = allPizzas.filter((pizza) => pizza._id !== id);
                setPizzas(updatedPizzas);
                setAllPizzas(updatedAll);
                showNotification("Pizza deleted successfully", "success");
            }
        } catch (err) {
            console.error("Error deleting pizza:", err);
            showNotification("Failed to delete pizza", "error");
        } finally {
            hideLoader();
        }
    };

    return (
        <div className="bg-lite text-sec px-6 md:px-20 py-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-15">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                    Explore Delicious <br /> Flavours at <span className="text-primary">Pizza Forge</span>
                </h1>

                <div className="flex gap-3 md:gap-4 mt-2 md:mt-0">
                    {["All", "Veg", "Non-Veg"].map((type) => {
                        const isActive = filter === type || (filter === "" && type === "All");
                        const baseClasses =
                            "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-[1px] cursor-pointer";

                        const colorClasses = (() => {
                            if (isActive) {
                                if (type === "Veg") return "bg-green-500 text-white border-green-500";
                                if (type === "Non-Veg") return "bg-red-500 text-white border-red-500";
                                return "bg-[var(--color-primary)] text-white border-[var(--color-primary)]";
                            } else {
                                if (type === "Veg") return "border-green-500 text-green-600 hover:bg-green-100";
                                if (type === "Non-Veg") return "border-red-500 text-red-600 hover:bg-red-100";
                                return "border-gray-300 text-gray-700 hover:bg-[var(--color-lite)]";
                            }
                        })();

                        return (
                            <button
                                key={type}
                                onClick={() => setFilter(type === "All" ? "" : type)}
                                className={`${baseClasses} ${colorClasses}`}
                            >
                                {type}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10">
                {pizzas.map((pizza) => (
                    <div
                        key={pizza._id}
                        className="bg-primary/20 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-lg transition duration-300 overflow-hidden flex flex-col"
                    >
                        <div className="relative h-36 w-full overflow-hidden">
                            <img
                                src={pizza.image_url}
                                alt={pizza.name}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute bottom-0 w-full bg-black/40 text-white px-3 py-2 backdrop-blur-sm flex justify-between items-center text-xs sm:text-sm">
                                <h2 className="font-bold">{pizza.name}</h2>
                                <span
                                    className={`font-medium flex items-center gap-1 ${pizza.category === "Veg" ? "text-green-400" : "text-red-400"}`}
                                >
                                    <span className="text-lg leading-none">
                                        {pizza.category === "Veg" ? "🟢" : "🔴"}
                                    </span>
                                    {pizza.category}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 flex flex-col justify-between flex-grow space-y-4">
                            <p className="text-sm text-gray-600 leading-5 line-clamp-3">{pizza.description}</p>

                            <div className="space-y-2 text-sm">
                                {["small", "medium", "large"].map((sizeKey, idx) => {
                                    const labels = ["Small", "Medium", "Large"];
                                    const slices = ["4 slices", "6 slices", "8 slices"];
                                    return (
                                        <div key={sizeKey} className="grid grid-cols-4 items-center gap-2">
                                            <div className="text-left text-gray-800 font-medium">{labels[idx]}</div>
                                            <div className="text-center text-gray-500 text-xs">{slices[idx]}</div>
                                            <div className="text-center text-gray-700 font-semibold">
                                                ₹{pizza.prices[sizeKey]}
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() =>
                                                        addToCart({
                                                            isCustom: false,
                                                            pizzaRef: pizza._id,
                                                            modelRef: "PizzasModel",
                                                            name: pizza.name,
                                                            price: pizza.prices[sizeKey],
                                                            quantity: 1,
                                                            size: sizeKey,
                                                        })
                                                    }
                                                    className="text-xs text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-primary)] px-3 py-[2px] rounded-full transition cursor-pointer w-fit"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>


                            {(showUpdate || showDelete) && (
                                <div className="flex justify-between pt-3 border-t mt-3">
                                    {showUpdate && (
                                        <Link
                                            to={`/pizzas/updatepizza/${pizza._id}`}
                                            className="text-sm font-medium text-[var(--color-primary)] hover:underline underline-offset-4 cursor-pointer"
                                        >
                                            Update
                                        </Link>
                                    )}
                                    {showDelete && (
                                        <button
                                            onClick={() => handleDelete(pizza._id)}
                                            className="text-sm font-medium text-rose-600 underline-offset-4 hover:underline cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
