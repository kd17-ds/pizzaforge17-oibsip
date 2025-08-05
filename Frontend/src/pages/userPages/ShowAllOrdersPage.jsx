import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";
import { Link } from "react-router-dom";
import { MdLocalPizza } from "react-icons/md"

export default function ShowAllOrdersPage() {
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const [orders, setOrders] = useState([]);

    const client = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                showLoader();
                const response = await client.get("/orders/myorders");
                setOrders(response.data.reverse());
            } catch (error) {
                showNotification("Error fetching orders", "error");
            } finally {
                hideLoader();
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="bg-lite text-sec px-6 md:px-20 py-16">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-sec mb-2 leading-tight">
                    Your Orders
                </h1>
            </div>

            {/* Empty State */}
            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-6 py-18">
                    <p className="text-xl text-sec">You haven’t ordered anything yet.</p>
                    <Link
                        to="/showallpizzas"
                        className="px-6 py-2 border-2 border-sec text-sec rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-200"
                    >
                        Explore Menu
                    </Link>
                </div>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-primary/30 text-sec rounded-2xl border border-sec/20 shadow hover:shadow-md transition p-6 flex flex-col justify-between"
                        >
                            {/* Top: Order ID + Date */}
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="font-bold text-lg">
                                    Order #{order._id.slice(-6)}
                                </h2>
                                <p className="text-sm text-right text-sec">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Mid: Total + Status in Row */}
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-sm font-medium">
                                    Total: ₹{order.totalPrice}
                                </p>
                                <span
                                    className={`text-xs font-semibold px-3 py-1.5 text-lite rounded-full ${order.status === "Delivered"
                                        ? "bg-green-500"
                                        : order.status === "Preparing"
                                            ? "bg-yellow-500 text-sec"
                                            : order.status === "Cancelled"
                                                ? "bg-red-500"
                                                : "bg-sec"
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            {/* CTA Button */}
                            <Link to={`/orders/${order._id}`} className="w-full">
                                <button className="w-full px-4 py-2 bg-sec text-white text-sm font-semibold rounded-full hover:bg-primary transition-all cursor-pointer">
                                    View Details
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
