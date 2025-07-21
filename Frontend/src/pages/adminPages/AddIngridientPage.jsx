import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../constants/constants";
import httpStatus from "http-status";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";


export default function AddIngridientPage() {

    const client = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
    });

    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        availableQty: "",
        isAvailable: true,
    })

    const validTypes = ["base", "cheese", "sauce", "veggie"];

    useEffect(() => {
        if (!validTypes.includes(type)) {
            showNotification("Invalid or missing ingredient type", "error");
            navigate("/admin/inventory");
        }
    }, [type]);

    const handleChange = (e) => {

        const { name, value, checked } = e.target;
        if (name === "isAvailable") {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validTypes = ["base", "cheese", "sauce", "veggie"];
        if (!validTypes.includes(type)) {
            showNotification("Invalid ingredient type", "error");
            return;
        }

        try {
            showLoader();
            const res = await client.post(`/customized-pizzas/addingredient?type=${type}`, formData);
            if (res.status === httpStatus.CREATED) {
                showNotification("Ingredient added successfully", "success");
                navigate("/admin/inventory");
            }
        } catch (err) {
            showNotification("Error Updating", "error");
        } finally {
            hideLoader();
        }

    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-2xl font-bold mb-4 capitalize text-center">
                Add {type} Ingredient
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Price (₹)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Available Quantity</label>
                    <input
                        type="number"
                        name="availableQty"
                        value={formData.availableQty}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="isAvailable"
                        checked={formData.isAvailable}
                        onChange={handleChange}
                        className="w-4 h-4"
                    />
                    <label className="text-gray-700">Is Available?</label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                    Add Ingredient
                </button>
            </form>
        </div>
    )
}