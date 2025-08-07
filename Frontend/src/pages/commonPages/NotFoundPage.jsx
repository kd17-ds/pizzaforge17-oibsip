import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="bg-lite text-sec min-h-screen flex flex-col justify-center items-center px-6 py-16">
            {/* Big Error Message */}
            <div className="text-center space-y-6 max-w-xl">
                <h1 className="text-6xl md:text-7xl font-extrabold text-primary">404</h1>
                <h2 className="text-2xl md:text-3xl font-bold">Page Not Found</h2>
                <p className="text-base md:text-lg">
                    Uh-oh! Looks like you've wandered off the delicious path. The page you're looking for doesn’t exist or was moved.
                </p>

                {/* CTA Buttons */}
                <div className="flex justify-center gap-4 flex-wrap pt-4">
                    <Link
                        to="/"
                        className="bg-primary text-lite px-6 py-3 rounded-full hover:shadow-lg transition-all"
                    >
                        Back to Home
                    </Link>
                    <Link
                        to="/showallpizzas"
                        className="border border-primary text-primary px-6 py-3 rounded-full hover:bg-primary hover:text-lite transition"
                    >
                        Explore Menu
                    </Link>
                </div>
            </div>
        </div>
    );
}
