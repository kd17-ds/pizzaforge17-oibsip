import { Link } from "react-router-dom";
import { FaPizzaSlice, FaPlusCircle, FaBoxes } from "react-icons/fa";

export default function AdminHomePage() {
    return (
        <div className="bg-lite text-sec px-6 md:px-20 py-16">
            {/* Intro */}
            <div className="mb-12 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                    PizzaForge <span className="text-primary">Admin</span> Portal
                </h1>
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-8xl mx-auto">
                {/* Left Section: Image + Text */}
                <div className="lg:col-span-2 border-2 border-sec rounded-2xl text-sec p-6 md:p-8 shadow-md flex flex-col justify-center">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Image */}
                        <img
                            src="/assets/heroPizza.png"
                            alt="Pizza"
                            className="w-32 sm:w-40 md:w-52 lg:w-56"
                        />

                        {/* Text */}
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                Master the Forge
                            </h2>
                            <p className="text-base md:text-lg leading-relaxed opacity-90">
                                Welcome to the command center of PizzaForge. From firing up new pizza creations to managing the heart of your kitchen — the inventory — everything starts here. This portal empowers you to lead with precision, flavor, and fire. Keep the operation smooth, the slices perfect, and the stock under control.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section: Action Cards */}
                <div className="space-y-6">
                    <Link
                        to="/admin/addpizza"
                        className="group bg-sec text-white rounded-xl p-5 flex items-center justify-between hover:brightness-110 transition-all shadow-md"
                    >
                        <div>
                            <h2 className="text-lg font-semibold">Add Pizza</h2>
                            <p className="text-base leading-7">Upload a new pizza to the menu.</p>
                        </div>
                        <FaPizzaSlice className="text-3xl ml-4 opacity-80 group-hover:scale-110 transition" />
                    </Link>

                    <Link
                        to="/admin/inventory/addingridient"
                        className="group bg-lite text-sec border border-sec/60 rounded-xl p-5 flex items-center justify-between hover:brightness-95 transition-all shadow-sm"
                    >
                        <div>
                            <h2 className="text-lg font-semibold">Add Ingredient</h2>
                            <p className="text-base leading-7">Insert raw ingredients into inventory.</p>
                        </div>
                        <FaPlusCircle className="text-3xl ml-4 opacity-70 group-hover:scale-110 transition" />
                    </Link>

                    <Link
                        to="/admin/inventory"
                        className="group bg-sec text-white rounded-xl p-5 flex items-center justify-between hover:brightness-110 transition-all shadow-md"
                    >
                        <div>
                            <h2 className="text-lg font-semibold">View Inventory</h2>
                            <p className="text-base leading-7">Check & update current stock levels.</p>
                        </div>
                        <FaBoxes className="text-3xl ml-4 opacity-80 group-hover:scale-110 transition" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
