import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="">
            Hello user
            <br />
            <Link
                to={`/showallpizzas`}
                className="text-black hover:text-blue-600"
            >
                Add a transaction
            </Link>
        </div>
    );
}
