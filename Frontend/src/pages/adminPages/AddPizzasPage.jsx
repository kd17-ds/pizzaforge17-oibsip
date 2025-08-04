import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "../../constants/constants";
import httpStatus from "http-status";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";

export default function AddPizzasPage() {

    const client = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
    });

    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "Veg",
        image_url: "",
        availability: true,
        prices: {
            small: "",
            medium: "",
            large: ""
        }
    })

    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === "availability") {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else if (name in formData.prices) {
            setFormData(prev => ({
                ...prev,
                prices: {
                    ...prev.prices,
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            showLoader();
            const res = await client.post("/pizzas/addpizza", formData);
            if (res.status === httpStatus.CREATED) {
                showNotification("Pizza added successfully!", "success");
                navigate("/showallpizzas")
            } else {
                showNotification("Failed to add pizza. Try again.", "error");
            }

        } catch (err) {
            showNotification(err.response?.data?.message || "Something went wrong.", "error");
        } finally {
            hideLoader();
        }
    }

    return (
        <div className="min-h-[calc(100vh-225px)] pt-[50px] flex items-center  justify-center px-4 ">
            <div className="w-full max-w-3xl bg-primary/25 rounded-3xl shadow-xl overflow-hidden border-sec border-2">
                {/* Header */}
                <div className=" text-sec text-center py-6 px-4 border-b-2">
                    <h2 className="text-2xl md:text-3xl font-semibold">Add a New Pizza</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 ">

                    {/* Pizza Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Pizza Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. Spicy Veggie Overload"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 w-full border border-sec rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            placeholder="Short description of the pizza"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 w-full border border-sec rounded-lg px-4 py-2 resize-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            rows={3}
                            required
                        />
                    </div>

                    {/* Category + Image URL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="mt-1 w-full border border-sec rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                required
                            >
                                <option value="Veg">Veg</option>
                                <option value="Non-Veg">Non-Veg</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Image URL</label>
                            <input
                                type="text"
                                name="image_url"
                                placeholder="https://example.com/pizza.jpg"
                                value={formData.image_url}
                                onChange={handleChange}
                                className="mt-1 w-full border border-sec rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                required
                            />
                        </div>
                    </div>

                    {/* Price Grid */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Prices</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <input
                                type="number"
                                name="small"
                                placeholder="Small"
                                value={formData.prices.small}
                                onChange={handleChange}
                                className="w-full border border-sec rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                required
                            />
                            <input
                                type="number"
                                name="medium"
                                placeholder="Medium"
                                value={formData.prices.medium}
                                onChange={handleChange}
                                className="w-full border border-sec rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                required
                            />
                            <input
                                type="number"
                                name="large"
                                placeholder="Large"
                                value={formData.prices.large}
                                onChange={handleChange}
                                className="w-full border border-sec rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                required
                            />
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="availability"
                            checked={formData.availability}
                            onChange={handleChange}
                            className="accent-[var(--color-secondary)] h-5 w-5"
                        />
                        <label className="text-sm text-gray-700">Available for order</label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full hover:cursor-pointer hover:bg-[var(--color-primary)] text-white text-lg font-medium py-3 rounded-xl bg-sec transition"
                    >
                        Add Pizza
                    </button>
                </form>
            </div>
        </div>

    );
};
