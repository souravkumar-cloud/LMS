import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6">

            <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-lg w-full text-center">

                <div className="flex justify-center">
                    <div className="bg-red-100 p-6 rounded-full">
                        <SearchX
                            size={70}
                            className="text-red-600"
                        />
                    </div>
                </div>

                <h1 className="text-7xl font-extrabold text-gray-800 mt-6">
                    404
                </h1>

                <h2 className="text-3xl font-bold mt-4 text-gray-700">
                    Page Not Found
                </h2>

                <p className="text-gray-500 mt-4 leading-relaxed">
                    The page you are looking for doesn't exist,
                    may have been moved, or the URL is incorrect.
                </p>

                <Link
                    to="/"
                    className="mt-8 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition duration-300 shadow-lg"
                >
                    <Home size={20} />
                    Back to Home
                </Link>

            </div>

        </div>
    );
};

export default NotFound;