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
        withCredentials: true
    });

    const { showLoader, hideLoader } = useLoader();
    const { showNotification, hideNotification } = useNotification();
    const [pizzas, setPizzas] = useState([]);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const { user } = useAuth();
    const [filter, setFilter] = useState(``);
    const { addToCart } = useCart();

    const fetchData = async () => {
        try {
            showLoader();
            const pizzaData = await client.get(`/pizzas/showallpizzas`);
            if (filter === `Veg`) {
                const filteredPizzas = pizzaData.data.filter(pizza => pizza.category === "Veg");
                setPizzas(filteredPizzas);
            } else if (filter === 'Non-Veg') {
                const filteredPizzas = pizzaData.data.filter(pizza => pizza.category === "Non-Veg");
                setPizzas(filteredPizzas);
            } else {
                setPizzas(pizzaData.data);
            }
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
        fetchData();
    }, [filter]);

    const filterPizzas = (e) => {
        setFilter(e.target.value);
    };

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
        <div className="bg-lite text-sec md:px-20 py-16">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-[var(--color-primary)]">
                Explore Our Delicious Pizzas
            </h1>
            {/* Filter Buttons */}
            <div className="flex justify-center gap-4 mb-10">
                {["All", "Veg", "Non-Veg"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type === "All" ? "" : type)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 
          ${filter === type || (filter === "" && type === "All")
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                : "border-gray-300 hover:bg-[var(--color-lite)]"
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Pizza Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 px-6 mt-10">
                {pizzas.map((pizza) => (
                    <div
                        key={pizza._id}
                        className="bg-lite backdrop-blur-sm border border-[var(--color-lite)] rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col"
                    >
                        {/* Pizza Image + Overlay */}
                        <div className="relative h-36 w-full overflow-hidden">
                            <img
                                src={pizza.image_url}
                                alt={pizza.name}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute bottom-0 w-full bg-black/40 text-white px-3 py-2 backdrop-blur-sm flex justify-between items-center text-xs sm:text-sm">
                                <h2 className="font-bold">{pizza.name}</h2>
                                <span
                                    className={`font-medium flex items-center gap-1 ${pizza.category === "Veg" ? "text-green-400" : "text-red-400"
                                        }`}
                                >
                                    <span className="text-lg leading-none">
                                        {pizza.category === "Veg" ? "🟢" : "🔴"}
                                    </span>
                                    {pizza.category}
                                </span>
                            </div>
                        </div>

                        {/* Lower Card Content */}
                        <div className="p-4 flex flex-col justify-between flex-grow space-y-4">
                            <p className="text-sm text-gray-600 leading-5 line-clamp-3">{pizza.description}</p>

                            {/* Price + Cart */}
                            <div className="flex flex-col space-y-2">
                                {["small", "medium", "large"].map((size) => (
                                    <div
                                        key={size}
                                        className="flex justify-between items-center text-sm"
                                    >
                                        <span className="text-gray-700 font-medium capitalize">{size}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-800">₹{pizza.prices[size]}</span>
                                            <button
                                                onClick={() =>
                                                    addToCart({
                                                        isCustom: false,
                                                        pizzaRef: pizza._id,
                                                        modelRef: "PizzasModel",
                                                        name: `${pizza.name} (${size})`,
                                                        price: pizza.prices[size],
                                                        quantity: 1,
                                                        size,
                                                    })
                                                }
                                                className="border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white px-3 py-1 rounded-full text-xs transition cursor-pointer"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Admin Controls */}
                            {(showUpdate || showDelete) && (
                                <div className="flex justify-between pt-3 border-t mt-3">
                                    {showUpdate && (
                                        <Link
                                            to={`/pizzas/updatepizza/${pizza._id}`}
                                            className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
                                        >
                                            Update
                                        </Link>
                                    )}
                                    {showDelete && (
                                        <button
                                            onClick={() => handleDelete(pizza._id)}
                                            className="text-sm font-medium text-red-600 hover:underline cursor-pointer"
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