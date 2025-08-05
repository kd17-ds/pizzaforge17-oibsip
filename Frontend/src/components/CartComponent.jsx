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

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    const calculateTotal = (items) =>
        items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const sanitizeCart = () => {
        return cartItems.map(item => ({
            ...item,
            modelRef: item.isCustom ? "CreatedPizzaModel" : "PizzasModel",
        }));
    };

    const placeOrderWithRazorpay = async () => {
        showLoader();
        try {
            const total = calculateTotal(cartItems);
            const sanitizedCart = sanitizeCart();

            const orderRes = await client.post("/orders/razorpay", { amount: total });
            const { id: razorpayOrderId, amount } = orderRes.data;

            const options = {
                key: razorpayKey,
                amount,
                currency: "INR",
                name: "Pizza Delivery App",
                description: "Order Payment",
                order_id: razorpayOrderId,
                handler: async function (response) {
                    try {
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
                    } catch (err) {
                        showNotification("Payment succeeded but order failed. Contact support.", "error");
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
                "Failed to initiate Razorpay order";
            showNotification(message, "error");
        } finally {
            hideLoader();
        }
    };

    const placeOrderWithCOD = async () => {
        showLoader();
        try {
            const total = calculateTotal(cartItems);
            const sanitizedCart = sanitizeCart();

            const payload = {
                items: sanitizedCart,
                totalPrice: total,
                shippingAddress,
            };

            const res = await client.post("/orders/cod/placeorder", payload);
            if (res.status === httpStatus.CREATED) {
                showNotification("Order placed with Cash on Delivery!", "success");
                clearCart();
                setIsOpen(false);
            }
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to place COD order";
            showNotification(message, "error");
        } finally {
            hideLoader();
        }
    };

    const isShippingAddressValid = () => {
        const { fullName, phone, pincode, city, state, street } = shippingAddress;
        return (
            fullName.trim() &&
            phone.trim() &&
            pincode.trim() &&
            city.trim() &&
            state.trim() &&
            street.trim()
        );
    };

    const formatSize = (size) => {
        return size ? size.charAt(0).toUpperCase() + size.slice(1) : "Custom";
    };


    return (
        <div
            className={`fixed top-0 right-0 h-full w-full sm:w-[90vw] md:w-[25rem] bg-cart shadow-lg px-4 md:px-6 py-4 z-50 transform transition-transform duration-300 overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"
                }`}
        >

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-sec">Your Cart</h2>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-xl text-sec font-bold hover:cursor-pointer"
                >
                    ✕
                </button>
            </div>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-gray-600 py-10 px-4">
                    <p className="text-lg md:text-xl font-medium text-gray-700 mb-6">
                        No items in cart.
                    </p>

                    <div className="space-y-3 w-full max-w-xs">
                        <a
                            href="/showallpizzas"
                            className="block w-full bg-sec text-white text-sm md:text-base px-5 py-2.5 rounded-lg shadow-md hover:opacity-90 transition"
                        >
                            🍕 Order Regular Pizzas
                        </a>

                        <a
                            href="/allcustomizedpizza"
                            className="block w-full bg-sec text-white text-sm md:text-base px-5 py-2.5 rounded-lg shadow-md hover:opacity-90 transition"
                        >
                            🎨 Order Customized Pizzas
                        </a>
                    </div>
                </div>

            ) : (
                <>
                    {/* Cart Items Table Format */}
                    <div
                        className="max-h-[45vh] overflow-y-auto pr-4 py-3 mb-3"
                        style={{
                            scrollbarWidth: "none",            // Firefox
                            msOverflowStyle: "none",           // IE/Edge
                        }}
                    >
                        {/* Header Row */}
                        <div className="grid grid-cols-[1fr_auto_auto_auto] text-sm font-semibold text-primary  py-2">
                            <div className="text-left">Item</div>
                            <div className="text-center w-[60px]">Qty</div>
                            <div className="text-center w-[80px]">Price</div>
                            <div className="text-right w-[70px]">Remove</div>
                        </div>

                        {/* Items */}
                        {cartItems.map((item, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-[1fr_auto_auto_auto] items-center text-sm  py-2  rounded transition"
                            >
                                {/* Name + Size */}
                                <div className="text-left">
                                    <div className="font-medium text-[var(--color-secondary)] leading-snug line-clamp-2">
                                        {item.name}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {formatSize(item.size)}
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="text-center w-[60px]">{item.quantity}</div>

                                {/* Price */}
                                <div className="text-center w-[80px]">₹{item.price}</div>

                                {/* Remove Button */}
                                <div className="text-right w-[70px]">
                                    <button
                                        onClick={() => removeFromCart(item)}
                                        className="text-red-600 text-xs hover:underline hover:cursor-pointer underline-offset-4"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        <style>
                            {`
      div::-webkit-scrollbar {
        display: none; /* Chrome, Safari */
      }
    `}
                        </style>
                    </div>

                    {/* Clear Cart & Total in One Row */}
                    <div className="flex justify-between mb-3 gap-4">
                        {/* Clear Cart Button */}
                        <div className="w-1/2 flex justify-start">
                            <button
                                onClick={clearCart}
                                className="text-red-600 text-lg hover:underline hover:cursor-pointer underline-offset-4"
                            >
                                Clear Cart
                            </button>
                        </div>

                        {/* Total */}
                        <div className="w-1/2 flex justify-end">
                            <p className="font-semibold text-sec text-base">
                                Total: ₹{calculateTotal(cartItems)}
                            </p>
                        </div>
                    </div>


                    {/* Shipping Form */}
                    <h3 className="font-semibold text-[var(--color-primary)] mt-4">Shipping Address</h3>

                    <form className="mt-2 space-y-2">
                        {[
                            ["Full Name", "fullName"],
                            ["Phone", "phone"],
                            ["Street", "street"],
                            ["Landmark (optional)", "landmark"],
                            ["City", "city"],
                            ["State", "state"],
                            ["Pincode", "pincode"],
                        ].map(([placeholder, key]) => (
                            <input
                                key={key}
                                type={key === "phone" || key === "pincode" ? "tel" : "text"}
                                placeholder={placeholder}
                                required={key !== "landmark"}
                                className="w-full bg-[var(--color-lite)] border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                                value={shippingAddress[key]}
                                onChange={(e) =>
                                    setShippingAddress({ ...shippingAddress, [key]: e.target.value })
                                }
                            />
                        ))}

                        {/* Payment Buttons */}
                        <button
                            type="button"
                            onClick={placeOrderWithRazorpay}
                            disabled={!isShippingAddressValid()}
                            className={`w-full mt-2 px-4 py-2 rounded hover:cursor-pointer transition ${isShippingAddressValid()
                                ? "bg-sec text-white hover:opacity-90"
                                : "bg-sec text-white cursor-not-allowed"
                                }`}
                        >
                            Pay with Razorpay
                        </button>


                        <button
                            type="button"
                            onClick={placeOrderWithCOD}
                            className="w-full mt-2 bg-sec text-white px-4 py-2 rounded hover:opacity-90 hover:cursor-pointer"
                        >
                            Cash on Delivery
                        </button>
                    </form>
                </>
            )}
        </div>

    );
}