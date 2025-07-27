export default function Notification({ message, type, onClose }) {
    const bg = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        info: "bg-blue-500"
    }[type] || "bg-gray-500";

    const displayMessage =
        typeof message === "string"
            ? message
            : message?.message || "Something went wrong";

    return (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow text-white text-sm z-50 ${bg}`}>
            {displayMessage}
            <button onClick={onClose} className="ml-4 text-white font-bold">X</button>
        </div>
    );
}
