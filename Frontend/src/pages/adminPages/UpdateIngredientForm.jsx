import axios from "axios";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../constants/constants";
import httpStatus from "http-status";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";


export default function UpdateIngredientFrom() {

    const client = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
    });

    const { id } = useParams();
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


    useEffect(() => {
        const fetchData = async () => {
            try {
                showLoader();
                const res = await client.get(`/customized-pizzas/updateingridient/${id}?type=${type}`);
                if (res.status === httpStatus.OK) {
                    setFormData({
                        name: res.data.name,
                        price: res.data.price,
                        availableQty: res.data.availableQty,
                        isAvailable: res.data.isAvailable,
                    });
                }
            } catch (err) {
                showNotification("Error Fetching", "error");
            } finally {
                hideLoader();
            }
        }

        fetchData();
    }, [])

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
            const res = await client.put(`/customized-pizzas/updateingridient/${id}?type=${type}`, formData);
            showNotification("Ingredient Updated successfully", "success");
            navigate("/admin/inventory");
        } catch (err) {
            showNotification("Error Updating", "error");
        } finally {
            hideLoader();
        }

    }

    return (
        <div className="w-[85vw] sm:w-full max-w-md mx-auto border border-sec rounded-lg p-6 my-14 overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 capitalize text-center text-sec">
                Update {type} Ingredient
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium text-sec">Name</label>
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
                    <label className="block mb-1 font-medium text-sec">Price (₹)</label>
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
                    <label className="block mb-1 font-medium text-sec">Available Quantity</label>
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
                        className="w-4 h-4 accent-[var(--color-secondary)]"
                    />
                    <label className="text-sec">Is Available?</label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-sec text-white py-2 px-4 rounded-md hover:bg-[var(--color-primary)] hover:cursor-pointer"
                >
                    Update Ingredient
                </button>
            </form>
        </div>

    )
}