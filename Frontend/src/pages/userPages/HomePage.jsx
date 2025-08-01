import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="bg-lite text-sec">
            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 gap-8 bg-lite">
                <div className="flex-1 space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                        Savor the Flavor <br /> at <span className="text-primary">Pizza Forge</span>
                    </h1>
                    <p className="text-lg">
                        Crafted with fire. Delivered with love. Discover handcrafted pizzas with bold ingredients & unforgettable taste.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/showallpizzas" className="bg-primary text-lite px-6 py-3 rounded-full hover:shadow-lg transition-all">
                            Explore Menu
                        </Link>
                        <Link to="/custompizza" className="border border-primary text-primary px-6 py-3 rounded-full hover:bg-primary hover:text-lite transition-all">
                            Customize Pizza
                        </Link>
                    </div>
                </div>

                <div className="flex-1">
                    <img
                        src="/assets/hero-pizza.png"
                        alt="Pizza Hero"
                        className="w-full max-w-md mx-auto"
                    />
                </div>
            </section>

            <section className="relative bg-sec border-2 rounded-xl text-lite py-16 px-6 md:mx-16 overflow-hidden">
                {/* Decorative Background Circles */}
                <div className="absolute -left-10 -top-10 w-48 h-48 bg-primary/20 rounded-full blur-2xl z-0"></div>
                <div className="absolute -right-10 bottom-0 w-64 h-64 bg-primary/10 rounded-full blur-2xl z-0"></div>

                <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold">Join the Pizza Revolution</h2>
                    <p className="text-lg">
                        Be part of the community where cravings meet craft. Track your orders in real-time, unlock spicy deals, and build pizzas the way legends do.
                    </p>

                    {/* Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left text-sm text-lite/90 max-w-4xl w-full">
                        <div className="bg-primary/10 border border-lite/20 rounded-xl p-4">
                            <h4 className="text-base font-semibold mb-1">🔥 Real-Time Tracking</h4>
                            <p>Know exactly when your pizza hits the fire — and when it reaches your door.</p>
                        </div>
                        <div className="bg-primary/10 border border-lite/20 rounded-xl p-4">
                            <h4 className="text-base font-semibold mb-1">🍕 Custom Creations</h4>
                            <p>Choose your dough, sauce, cheese, and toppings — every slice your signature.</p>
                        </div>
                        <div className="bg-primary/10 border border-lite/20 rounded-xl p-4">
                            <h4 className="text-base font-semibold mb-1">🎁 Member-Only Offers</h4>
                            <p>Get early access to combos, seasonal specials, and exclusive discounts.</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center gap-4 flex-wrap pt-4">
                        <Link
                            to="/login"
                            className="bg-lite text-sec px-6 py-3 rounded-full border border-lite hover:bg-transparent hover:text-lite transition"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-primary text-lite px-6 py-3 rounded-full hover:bg-lite hover:text-sec transition"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </section>


            {/* Popular Picks */}
            <section className="py-12 px-6 md:px-20 bg-lite">
                <h2 className="text-3xl font-bold text-center mb-10">🔥 Popular Picks</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { name: "Spicy Veggie Blast", img: "/assets/pizza1.png" },
                        { name: "Cheesy Overload", img: "/assets/pizza2.png" },
                        { name: "Farmhouse Delight", img: "/assets/pizza3.png" },
                    ].map((pizza, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4">
                            <img src={pizza.img} alt={pizza.name} className="rounded-lg mb-4 w-full h-52 object-cover" />
                            <h4 className="text-xl font-semibold text-sec">{pizza.name}</h4>
                        </div>
                    ))}
                </div>
            </section>

            {/* Brand Trust Section */}
            <section className="bg-[#f8e7b1] py-16 px-6 md:px-20 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-sec mb-4">Forged with Fire, Loved by All</h2>
                <p className="text-base md:text-lg max-w-3xl mx-auto text-sec mb-10">
                    At Pizza Forge, every slice tells a story — of heat, heart, and handcrafted perfection. Join thousands who’ve made us a part of their cravings.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-primary font-semibold text-lg">
                    <div>
                        <h3 className="text-3xl font-extrabold">50K+</h3>
                        <p>Orders Delivered</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-extrabold">4.8★</h3>
                        <p>Average Rating</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-extrabold">30+</h3>
                        <p>Exclusive Recipes</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-extrabold">24/7</h3>
                        <p>Order Support</p>
                    </div>
                </div>
            </section>

        </div>
    );
}
