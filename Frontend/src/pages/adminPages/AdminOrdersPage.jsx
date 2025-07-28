import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";

export default function AdminOrdersPage() {
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");

    const client = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                showLoader();
                const response = await client.get("/orders/allorders");
                const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sorted);
            } catch (error) {
                showNotification("Error fetching orders", "error");
            } finally {
                hideLoader();
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            showLoader();
            await client.put(`/orders/${orderId}/status`, { status: newStatus });
            showNotification("Order status updated", "success");
            setOrders((prev) =>
                prev.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            showNotification("Failed to update order status", "error");
        } finally {
            hideLoader();
        }
    };

    const filteredOrders =
        statusFilter === "All"
            ? orders
            : orders.filter((order) => order.status === statusFilter);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Orders</h1>

            {/* 🔍 Filter Dropdown */}
            <div className="mb-4">
                <label className="font-semibold mr-2">Filter by Status:</label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    <option value="All">All</option>
                    <option value="Placed">Placed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {filteredOrders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="border rounded p-4 shadow">
                            <div className="mb-2">
                                <span className="font-semibold">Order ID:</span> {order._id}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">User:</span> {order.user?.email || "Guest"}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Address:</span>{" "}
                                {order.shippingAddress
                                    ? `${order.shippingAddress.street}, ${order.shippingAddress.landmark ? order.shippingAddress.landmark + ", " : ""}${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
                                    : "N/A"}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Payment:</span> {order.paymentMethod}
                            </div>

                            <div className="mb-2">
                                <span className="font-semibold">Status:</span>{" "}
                                <span className="text-blue-600">{order.status}</span>
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Items:</span>
                                <ul className="list-disc ml-6">
                                    {order.items.map((item, idx) => (
                                        <li key={idx}>
                                            {item.quantity} x {item.pizzaRef?.name || "Customized Pizza"}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Dropdown to update status */}
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                className="border rounded px-2 py-1 mt-2"
                            >
                                <option value="Placed">Placed</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
