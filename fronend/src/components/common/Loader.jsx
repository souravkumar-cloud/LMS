import { LibraryBig } from "lucide-react";

const Loader = ({ text = "Loading..." }) => {

    return (

        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">

            <div className="flex flex-col items-center">

                {/* Logo */}

                <div className="bg-blue-600 p-5 rounded-full shadow-lg animate-pulse">

                    <LibraryBig className="text-white" size={45} />

                </div>

                {/* Title */}

                <h2 className="mt-6 text-2xl font-bold text-gray-800">

                    Library Management System

                </h2>

                {/* Loading Text */}

                <p className="text-gray-500 mt-2">

                    {text}

                </p>

                {/* Spinner */}

                <div className="mt-6 h-10 w-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>

            </div>

        </div>

    );

};

export default Loader;