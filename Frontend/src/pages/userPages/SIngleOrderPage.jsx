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
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Order Details</h1>
                <p className="text-gray-600">No order found.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Order Details</h1>

            <div className="border p-4 rounded-xl bg-white shadow-sm mb-6">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>User ID:</strong> {order.user}</p>
                <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                <p><strong>Placed At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </div>

            <h2 className="text-xl font-semibold mb-2">Items:</h2>
            <div className="grid gap-4">
                {order.items.map((item, idx) => (
                    <div key={idx} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                        <p><strong>Name:</strong> {item.name}</p>
                        <p><strong>Size:</strong> {item.size || "N/A"}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>Price:</strong> ₹{item.price}</p>
                        <p><strong>Is Custom:</strong> {item.isCustom ? "Yes" : "No"}</p>
                        {item.pizzaRef && (
                            <div className="mt-2">
                                <strong>Pizza Ref (Populated):</strong>
                                <pre className="text-xs bg-white p-2 mt-1 rounded overflow-x-auto">
                                    {JSON.stringify(item.pizzaRef, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Address:</h2>
            <div className="border p-4 rounded-lg bg-white shadow-sm">
                <p><strong>Name:</strong> {order.shippingAddress.fullName}</p>
                <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
                <p><strong>Street:</strong> {order.shippingAddress.street}</p>
                <p><strong>City:</strong> {order.shippingAddress.city}</p>
                <p><strong>State:</strong> {order.shippingAddress.state}</p>
                <p><strong>Pincode:</strong> {order.shippingAddress.pincode}</p>
                {order.shippingAddress.landmark && (
                    <p><strong>Landmark:</strong> {order.shippingAddress.landmark}</p>
                )}
            </div>
        </div>
    );
}
