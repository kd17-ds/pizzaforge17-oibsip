import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";
import { Link } from "react-router-dom";

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
                setOrders(response.data);
            } catch (error) {
                showNotification("Error fetching orders", "error");
            } finally {
                hideLoader();
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
            {orders.length === 0 ? (
                <p className="text-gray-600">No orders found.</p>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="border rounded-xl p-4 shadow-md bg-white"
                        >
                            <p className="text-sm text-gray-700 mb-1">
                                <span className="font-semibold">Order ID:</span> {order._id}
                            </p>
                            <p className="text-sm text-gray-700 mb-1">
                                <span className="font-semibold">Total:</span> ₹{order.totalPrice}
                            </p>
                            <p className="text-sm text-gray-700 mb-1">
                                <span className="font-semibold">Status:</span> {order.status}
                            </p>
                            <p className="text-sm text-gray-700 mb-3">
                                <span className="font-semibold">Placed on:</span>{" "}
                                {new Date(order.createdAt).toLocaleString()}
                            </p>

                            <Link to={`/orders/${order._id}`}>
                                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
                                    View Order
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
