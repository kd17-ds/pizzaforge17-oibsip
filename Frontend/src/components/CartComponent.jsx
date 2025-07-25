import React from "react";
import { useCart } from "../contexts/CartContext";
import { BASE_URL } from "../constants/constants";
import httpStatus from "http-status";
import axios from "axios";
import { useLoader } from "../contexts/LoadingContext";
import { useNotification } from "../contexts/NotificationContext";
export default function CartPanel() {
    const client = axios.create({
        baseURL: BASE_URL,
        withCredentials: true
    });

    const { cartItems, removeFromCart, clearCart, setIsOpen } = useCart();
    const isOpen = true; // force cart open always
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();


    const calculateTotal = (items) =>
        items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const placeOrder = async () => {


        try {
            showLoader();

            const shippingAddress = {
                fullName: "D.S Sharma",
                phone: "9999999999",
                pincode: "305001",
                city: "Ajmer",
                state: "Rajasthan",
                street: "College Road",
                landmark: "Near Market",
            };

            const sanitizedCart = cartItems.map(item => ({
                ...item,
                modelRef: item.isCustom ? "CreatedPizzaModel" : "PizzasModel", // ✅ FIXED HERE
            }));


            const payload = {
                items: sanitizedCart,
                totalPrice: calculateTotal(sanitizedCart),
                shippingAddress,
                paymentMethod: "COD",
            };


            console.table(cartItems.map(item => ({
                name: item.name,
                modelRef: item.modelRef,
                isCustom: item.isCustom,
            })));



            const res = await client.post("/orders/create", payload);
            console.log("Order Response:", res.data);

            if (res.status === httpStatus.CREATED) {
                showNotification("Order placed successfully!", "success");
                clearCart();
                setIsOpen(false);
            }
        } catch (err) {
            console.error("Place Order Error:", err);
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
        <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-4 z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
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
                    <ul className="space-y-2 overflow-y-auto max-h-[60vh]">
                        {cartItems.map((item, idx) => (
                            <li key={idx} className="border p-2 rounded">
                                <p>{item.name}</p>
                                <p>Qty: {item.quantity}</p>
                                <button className="text-red-500 text-sm" onClick={() => removeFromCart(item.pizzaRef)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4">
                        <p className="font-semibold">Total: ₹{calculateTotal(cartItems)}</p>
                        <button onClick={placeOrder} className="w-full mt-2 bg-green-600 text-white px-4 py-2 rounded">
                            Place Order
                        </button>
                        <button onClick={clearCart} className="w-full mt-2 text-red-600 text-sm">
                            Clear Cart
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
