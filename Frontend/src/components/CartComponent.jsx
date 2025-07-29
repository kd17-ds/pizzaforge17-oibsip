import React, { useState } from "react";
import axios from "axios";
import { useCart } from "../contexts/CartContext";
import { BASE_URL } from "../constants/constants";
import httpStatus from "http-status";
import { useLoader } from "../contexts/LoadingContext";
import { useNotification } from "../contexts/NotificationContext";

export default function CartPanel() {
    const client = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
    });

    const { cartItems, removeFromCart, clearCart, setIsOpen, isOpen } = useCart();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();

    const [shippingAddress, setShippingAddress] = useState({
        fullName: "",
        phone: "",
        pincode: "",
        city: "",
        state: "",
        street: "",
        landmark: "",
    });

    const calculateTotal = (items) =>
        items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const razorpayKey = "fake_key"; // <-- Replace with your actual test key

    const placeOrder = async (e) => {
        e.preventDefault();
        showLoader();

        try {
            const total = calculateTotal(cartItems);
            const sanitizedCart = cartItems.map(item => ({
                ...item,
                modelRef: item.isCustom ? "CreatedPizzaModel" : "PizzasModel",
            }));

            // Step 1: Create Razorpay Order
            const orderRes = await client.post("/orders/razorpay", { amount: total });
            const { id: razorpayOrderId, amount } = orderRes.data;

            // Step 2: Open Razorpay Checkout
            const options = {
                key: razorpayKey,
                amount,
                currency: "INR",
                name: "Pizza Delivery App",
                description: "Order Payment",
                order_id: razorpayOrderId,
                handler: async function (response) {
                    // Step 3: Send final order placement to backend
                    const payload = {
                        items: sanitizedCart,
                        totalPrice: total,
                        shippingAddress,
                        razorpayDetails: response,
                    };

                    const finalRes = await client.post("/orders/razorpay/placeorder", payload);
                    if (finalRes.status === httpStatus.CREATED) {
                        showNotification("Order placed successfully!", "success");
                        clearCart();
                        setIsOpen(false);
                    }
                },
                prefill: {
                    name: shippingAddress.fullName,
                    contact: shippingAddress.phone,
                },
                theme: { color: "#F37254" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "An error occurred while placing the order";
            showNotification(message, "error");
        } finally {
            hideLoader();
        }
    };

    return (
        <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-4 z-50 transform transition-transform duration-300 overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Cart</h2>
                <button onClick={() => setIsOpen(false)}>✕</button>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center text-gray-600">
                    <p>No items in cart.</p>
                    <div className="mt-4 space-y-2">
                        <a href="/showallpizzas" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Order Regular Pizzas
                        </a>
                        <br />
                        <a href="/allcustomizedpizza" className="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                            Order Customized Pizzas
                        </a>
                    </div>
                </div>
            ) : (
                <>
                    <ul className="space-y-2 overflow-y-auto max-h-[50vh]">
                        {cartItems.map((item, idx) => (
                            <li key={idx} className="border p-2 rounded">
                                <p className="font-semibold">{item.name}</p>
                                <p>Qty: {item.quantity}</p>
                                <p>Price: ₹{item.price}</p>
                                <button onClick={() => removeFromCart(item)} className="text-red-500 text-sm mt-1">
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <form onSubmit={placeOrder} className="mt-4 space-y-2">
                        <p className="font-semibold">Total: ₹{calculateTotal(cartItems)}</p>

                        <h3 className="font-semibold">Shipping Address</h3>
                        <input type="text" placeholder="Full Name" required className="w-full border px-2 py-1 rounded"
                            value={shippingAddress.fullName}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                        />
                        <input type="tel" placeholder="Phone" required className="w-full border px-2 py-1 rounded"
                            value={shippingAddress.phone}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        />
                        <input type="text" placeholder="Street" required className="w-full border px-2 py-1 rounded"
                            value={shippingAddress.street}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                        />
                        <input type="text" placeholder="Landmark (optional)" className="w-full border px-2 py-1 rounded"
                            value={shippingAddress.landmark}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, landmark: e.target.value })}
                        />
                        <input type="text" placeholder="City" required className="w-full border px-2 py-1 rounded"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        />
                        <input type="text" placeholder="State" required className="w-full border px-2 py-1 rounded"
                            value={shippingAddress.state}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        />
                        <input type="text" placeholder="Pincode" required className="w-full border px-2 py-1 rounded"
                            value={shippingAddress.pincode}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                        />

                        <button type="submit" className="w-full mt-2 bg-green-600 text-white px-4 py-2 rounded hover:cursor-pointer hover:bg-green-700">
                            Place Order
                        </button>
                        <button type="button" onClick={clearCart} className="w-full mt-2 text-red-600 text-sm hover:underline">
                            Clear Cart
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
