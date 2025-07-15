import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "../constants/constants";
import httpStatus from "http-status";
import { useLoader } from "../contexts/LoadingContext";
import { useNotification } from "../contexts/NotificationContext";

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
                navigate("/admin/home")
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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-center mb-6 text-sec">Add New Pizza</h2>



                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Pizza Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none"
                        rows={3}
                        required
                    />

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        required
                    >
                        <option value="Veg">Veg</option>
                        <option value="Non-veg">Non-Veg</option>
                    </select>

                    <input
                        type="text"
                        name="image_url"
                        placeholder="Image URL"
                        value={formData.image_url}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                            type="number"
                            name="small"
                            placeholder="Price (Small)"
                            value={formData.prices.small}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            required
                        />
                        <input
                            type="number"
                            name="medium"
                            placeholder="Price (Medium)"
                            value={formData.prices.medium}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            required
                        />
                        <input
                            type="number"
                            name="large"
                            placeholder="Price (Large)"
                            value={formData.prices.large}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="availability"
                            checked={formData.availability}
                            onChange={handleChange}
                            className="accent-sec"
                        />
                        <label className="text-sm">Available</label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-sec text-white py-2 rounded-lg hover:bg-lite transition"
                    >
                        Add Pizza
                    </button>
                </form>
            </div>
        </div>
    );
};
