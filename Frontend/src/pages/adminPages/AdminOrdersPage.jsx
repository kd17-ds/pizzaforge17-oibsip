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
        <div className="bg-lite text-sec px-4 sm:px-6 md:px-20 py-16">
            {/* Header + Filter */}
            <div className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                    Order <span className="text-primary">Management</span> System
                </h1>

                {/* Filter Dropdown */}
                <div className="flex items-center gap-4 text-sec border border-sec rounded-xl px-6 py-3 shadow-sm">
                    <label className="font-medium text-sec text-lg">Filter:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-sec text-lg bg-lite focus:outline-none text-center pr-2"
                    >
                        <option value="All">All</option>
                        <option value="Placed">Placed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders */}
            {filteredOrders.length === 0 ? (
                <p className="text-gray-600">No orders found.</p>
            ) : (
                <div className="grid sm:grid-cols-2 gap-12">
                    {filteredOrders.map((order) => (
                        <div
                            key={order._id}
                            className="border border-sec rounded-xl p-6 flex flex-col justify-between gap-4"
                        >
                            {/* TOP SECTION */}
                            <div className="flex flex-col sm:flex-row justify-between gap-6">
                                {/* LEFT: Shipping + Payment Info */}
                                <div className="basis-2/3 space-y-2 text-sm sm:text-base">
                                    <div className="flex gap-1">
                                        <span className="font-semibold text-sec">Address:</span>
                                        <span>
                                            {order.shippingAddress
                                                ? `${order.shippingAddress.street}, ${order.shippingAddress.landmark ? order.shippingAddress.landmark + ", " : ""
                                                }${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
                                                : "N/A"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sec">Order ID:</span> {order._id}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sec">User:</span> {order.user?.email || "Guest"}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sec">Payment:</span> {order.paymentMethod}
                                    </div>
                                </div>

                                {/* RIGHT: Items */}
                                <div className="basis-1/3 text-right text-sm sm:text-base space-y-1 sm:pr-2">
                                    <div>
                                        <span className="font-semibold text-sec block">Items:</span>
                                        <ul className="mt-1 sm:space-y-1">
                                            {order.items.map((item, idx) => (
                                                <li key={idx}>
                                                    {item.quantity} × {item.pizzaRef?.name || "Customized Pizza"}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM: Total + Status */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 pt-4 border-t border-dashed border-sec">
                                {/* Total */}
                                <div className="text-sm sm:text-base font-semibold text-sec">
                                    Total: ₹{order.totalPrice.toFixed(2)}
                                </div>

                                {/* Status Dropdown */}
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <label className="font-semibold text-sec text-base sm:text-lg">Change Status:</label>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className={`rounded-md px-4 py-2 text-sm sm:text-base font-semibold outline-none ring-0 border-none bg-lite
                                    ${order.status === "Placed"
                                                ? "text-yellow-500"
                                                : order.status === "Preparing"
                                                    ? "text-blue-500"
                                                    : order.status === "Delivered"
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                            }`}

                                    >
                                        <option value="Placed">Placed</option>
                                        <option value="Preparing">Preparing</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
