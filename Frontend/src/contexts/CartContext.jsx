import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/constants";
import { useLocation } from "react-router-dom";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const location = useLocation();

    const initiallyOpenPages = ["/showallpizzas", "/allcustomizedpizza"];
    const [isOpen, setIsOpen] = useState(
        initiallyOpenPages.includes(location.pathname)
    );

    const client = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
    });

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await client.get("/orders/cart");
                if (res.data?.items) {
                    setCartItems(res.data.items);
                }
            } catch (err) {
                console.error("Failed to fetch cart from backend", err);
            }
        };

        fetchCart();
    }, []);

    // Helper to sync cart with backend
    const syncCartToBackend = async (updatedCartItems) => {
        try {
            await client.put("/orders/cart", { items: updatedCartItems });
        } catch (err) {
            console.error("Failed to sync cart to backend", err);
        }
    };

    // Add item to cart
    const addToCart = async (item) => {
        const correctedItem = {
            ...item,
            modelRef: item.isCustom ? "CreatedPizzaModel" : "PizzasModel",
        };

        const updatedCart = (() => {
            const exists = cartItems.find(
                i =>
                    i.pizzaRef === correctedItem.pizzaRef &&
                    i.modelRef === correctedItem.modelRef &&
                    i.size === correctedItem.size
            );

            if (exists) {
                return cartItems.map(i =>
                    i.pizzaRef === correctedItem.pizzaRef &&
                        i.modelRef === correctedItem.modelRef &&
                        i.size === correctedItem.size
                        ? { ...i, quantity: i.quantity + correctedItem.quantity }
                        : i
                );
            }

            return [...cartItems, correctedItem];
        })();

        setCartItems(updatedCart);
        setIsOpen(true);
        await syncCartToBackend(updatedCart);
    };

    // Remove item
    const removeFromCart = async (itemToRemove) => {
        const updatedCart = cartItems.filter(
            i =>
                !(
                    i.pizzaRef === itemToRemove.pizzaRef &&
                    i.modelRef === itemToRemove.modelRef &&
                    i.size === itemToRemove.size
                )
        );
        setCartItems(updatedCart);
        await syncCartToBackend(updatedCart);
    };


    //  Clear cart
    const clearCart = async () => {
        setCartItems([]);
        await syncCartToBackend([]);
    };

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, clearCart, isOpen, setIsOpen }}
        >
            {children}
        </CartContext.Provider>
    );
};
