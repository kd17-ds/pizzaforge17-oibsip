import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem("cartItems");
            return stored ? JSON.parse(stored) : [];
        } catch (err) {
            console.error("Failed to parse cart items from localStorage", err);
            return [];
        }
    });

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        } catch (err) {
            console.error("Failed to save cart items to localStorage", err);
        }
    }, [cartItems]);

    const addToCart = (item) => {
        const correctedItem = {
            ...item,
            modelRef: item.isCustom ? "CreatedPizzaModel" : "PizzasModel",
        };
        setCartItems((prev) => {
            const exists = prev.find((i) => i.pizzaRef === correctedItem.pizzaRef);
            if (exists) {
                return prev.map((i) =>
                    i.pizzaRef === correctedItem.pizzaRef
                        ? { ...i, quantity: i.quantity + correctedItem.quantity }
                        : i
                );
            }
            return [...prev, correctedItem];
        });

        setIsOpen(true);
    };


    const removeFromCart = (pizzaRef) => {
        setCartItems((prev) => prev.filter((i) => i.pizzaRef !== pizzaRef));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("cartItems");
    };


    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, clearCart, isOpen, setIsOpen }}
        >
            {children}
        </CartContext.Provider>
    );
};
