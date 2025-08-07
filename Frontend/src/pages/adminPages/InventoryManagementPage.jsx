import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../constants/constants";
import { useLoader } from "../../contexts/LoadingContext";
import { useNotification } from "../../contexts/NotificationContext";
import httpStatus from "http-status";
import { FaBoxes, FaPlusCircle, FaEdit, FaTrashAlt } from "react-icons/fa";

export default function InventoryManagementPage() {
    const [inventory, setInventory] = useState({});
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();

    const client = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
    });

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                showLoader();
                const res = await client.get("/customized-pizzas/allingridients");
                if (res.status === httpStatus.OK) {
                    setInventory(res.data);
                }
            } catch (err) {
                showNotification(err, "error");
            } finally {
                hideLoader();
            }
        };

        fetchInventory();
    }, []);

    const handleDelete = async (id, type) => {
        const confirm = window.confirm("Are you sure you want to delete this Ingridient?");
        if (!confirm) return;
        try {
            showLoader();
            const res = await client.delete(`/customized-pizzas/deleteingridient/${id}?type=${type}`);
            if (res.status === httpStatus.OK) {
                setInventory((prev) => ({
                    ...prev,
                    [type]: prev[type].filter((ingredient) => ingredient._id !== id),
                }));
                showNotification(`${type} deleted successfully`, "success");
            }
        } catch (err) {
            console.error("Error deleting Ingridient:", err);
        } finally {
            hideLoader();
        }
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

    const typeLabels = {
        base: "Base",
        cheese: "Cheeses",
        sauce: "Sauces",
        veggie: "Veggies"
    };

    const renderTable = (type) => (
        <div key={type} className="mb-10 rounded-xl border border-sec/40 p-4 shadow-sm text-sec">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold tracking-wide uppercase pl-3">
                    {typeLabels[type]}
                </h2>
                <Link
                    to={`addingridient?type=${type}`}
                    className="text-sec text-base underline-offset-8 flex items-center gap-1 hover:underline pr-3"
                >
                    <FaPlusCircle />
                    Add
                </Link>
            </div>

            {/* Table */}
            {/* Table wrapper */}
            <div className="w-full">
                {/* Desktop table */}
                <table className="hidden sm:table w-full text-sm border-separate border-spacing-y-2 table-fixed">
                    <thead>
                        <tr className="text-sec/60 text-center">
                            <th className="w-[18%] text-left pl-3">Name</th>
                            <th className="w-[12%]">₹</th>
                            <th className="w-[12%]">Qty</th>
                            <th className="w-[18%]">Status</th>
                            <th className="w-[20%]">Added</th>
                            <th className="w-[10%] pr-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory[type].map((ingredient) => (
                            <tr
                                key={ingredient._id}
                                className="hover:bg-lite/5 border border-lite/10 rounded-xl text-center"
                            >
                                <td className="pl-3 py-2 rounded-l-xl w-[18%] truncate text-left">{ingredient.name}</td>
                                <td className="w-[12%]">₹{ingredient.price}</td>
                                <td className="w-[12%]">{ingredient.availableQty}</td>
                                <td className="w-[18%]">
                                    <span className={`font-medium ${ingredient.isAvailable ? "text-green-400" : "text-red-400"}`}>
                                        {ingredient.isAvailable ? "In Stock" : "Out of Stock"}
                                    </span>
                                </td>
                                <td className="w-[20%]">{formatDate(ingredient.createdAt)}</td>
                                <td className="w-[20%] text-right pr-3 rounded-r-xl space-x-3">
                                    <Link
                                        to={`updateingridient/${ingredient._id}?type=${type}`}
                                        className="text-sec hover:cursor-pointer hover:scale-110 transition inline-block"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(ingredient._id, type)}
                                        className="text-red-400 hover:cursor-pointer hover:scale-110 transition inline-block"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


                {/* Mobile card layout */}
                <div className="space-y-4 sm:hidden">
                    {inventory[type].map((ingredient) => (
                        <div
                            key={ingredient._id}
                            className="border border-sec/30 rounded-xl px-4 py-3 bg-lite/5 text-sec shadow-sm space-y-3"
                        >
                            {/* Top: Name + Status */}
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold capitalize truncate w-2/3">{ingredient.name}</h3>
                                <span className={`text-sm font-medium ${ingredient.isAvailable ? "text-green-500" : "text-red-400"}`}>
                                    {ingredient.isAvailable ? "In Stock" : "Out of Stock"}
                                </span>
                            </div>

                            {/* Info + Buttons in same row */}
                            <div className="flex justify-between items-center text-sm">
                                <div>
                                    <p className="text-xs text-sec/60">Price</p>
                                    <p className="font-medium">₹{ingredient.price}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-sec/60">Qty</p>
                                    <p className="font-medium">{ingredient.availableQty}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Link
                                        to={`updateingridient/${ingredient._id}?type=${type}`}
                                        className="text-sec hover:scale-110 transition"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(ingredient._id, type)}
                                        className="text-red-400 hover:cursor-pointer hover:scale-110 transition"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );

    return (
        <div className="bg-lite text-sec px-4 md:px-20 py-16">
            {/* Intro */}
            <div className="mb-12 max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Inventory Management</h1>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Left: base, cheese, sauce */}
                <div className="space-y-8">
                    {["base", "cheese", "sauce"].map(
                        (type) => inventory[type]?.length > 0 && renderTable(type)
                    )}
                </div>

                {/* Right: veggies */}
                <div className="space-y-8">
                    {inventory["veggie"]?.length > 0 && renderTable("veggie")}
                </div>
            </div>

            {/* Fallback */}
            {Object.values(inventory).every((arr) => !arr || arr.length === 0) && (
                <div className="text-center text-lite/80 mt-10 text-sm">
                    No inventory data available.
                </div>
            )}
        </div>
    );
}
