import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";
import { useParams } from "react-router-dom";

export default function SingleOrderPage() {
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const [order, setOrder] = useState(null);
    const { id } = useParams();

    const client = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
    });

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                showLoader();
                const response = await client.get(`/orders/order/${id}`);
                setOrder(response.data);
            } catch (error) {
                showNotification("Error fetching order", "error");
            } finally {
                hideLoader();
            }
        };

        fetchOrder();
    }, []);

    if (!order) {
        return (
            <div className="bg-lite text-sec px-6 md:px-20 py-16">
                <h1 className="text-3xl font-extrabold mb-4">Order Details</h1>
                <p className="text-sec">No order found.</p>
            </div>
        );
    }

    return (
        <div className="bg-lite text-sec px-6 md:px-20 py-16">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-2 leading-tight">
                    Order Summary
                </h1>
            </div>

            {/* Ordered Items and Details Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* LEFT: Ordered Items (1/2 width) */}
                <div className="flex flex-col space-y-6">
                    <h2 className="text-center text-2xl font-semibold mb-4">Ordered Items</h2>

                    {order.items.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-primary/30 border border-sec/20 rounded-xl p-5 shadow-lg"
                        >
                            <h3 className="text-lg font-bold mb-4 text-center border-b pb-3">{item.name}</h3>

                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Size:</span>
                                <span>{item.size ? item.size.charAt(0).toUpperCase() + item.size.slice(1) : "N/A"}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Quantity:</span>
                                <span>{item.quantity}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Price:</span>
                                <span>₹{item.price}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Is Custom:</span>
                                <span>{item.isCustom ? "Yes" : "No"}</span>
                            </div>

                            {item.pizzaRef && (
                                <div className="mt-4">
                                    <p className="text-xs text-sec/60 font-semibold mb-1">
                                        Pizza Ref (Populated)
                                    </p>
                                    <pre className="text-xs bg-lite p-3 rounded max-h-40 overflow-auto">
                                        {JSON.stringify(item.pizzaRef, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* RIGHT: Order Details + Shipping Address (1/2 width) */}
                <div className="flex flex-col gap-6">
                    {/* Order Details */}
                    <div>
                        <h2 className="text-center text-2xl font-semibold mb-4">Order Details</h2>
                        <div className="bg-primary/20 border border-sec/20 rounded-2xl shadow p-6 text-sm space-y-3">
                            <div className="flex justify-between mb-2">
                                <h3 className="text-lg font-semibold">Order ID:</h3>
                                <span className="font-mono">{order._id.slice(-6)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Placed on:</span>
                                <span>{new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Price:</span>
                                <span>₹{order.totalPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span>{order.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Payment Method:</span>
                                <span>{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Payment Status:</span>
                                <span>{order.paymentStatus}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>User ID:</span>
                                <span>{order.user}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                        <h2 className="text-center text-2xl font-semibold mb-4">Shipping Address</h2>
                        <div className="bg-primary/20 border border-sec/20 rounded-2xl shadow p-6 text-sm space-y-3">
                            <div className="flex justify-between">
                                <span>Name:</span>
                                <span>{order.shippingAddress.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phone:</span>
                                <span>{order.shippingAddress.phone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Street:</span>
                                <span>{order.shippingAddress.street}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>City:</span>
                                <span>{order.shippingAddress.city}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>State:</span>
                                <span>{order.shippingAddress.state}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Pincode:</span>
                                <span>{order.shippingAddress.pincode}</span>
                            </div>
                            {order.shippingAddress.landmark && (
                                <div className="flex justify-between">
                                    <span>Landmark:</span>
                                    <span>{order.shippingAddress.landmark}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}