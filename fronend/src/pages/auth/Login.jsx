import { useState } from "react";
import { Eye, EyeOff, LibraryBig } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({

        email: "",

        password: ""

    });

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.email || !formData.password) {

            return toast.error("Please fill all fields");

        }

        try {

            setLoading(true);

            const data = await loginUser(formData);

            login(data.user, data.token);

            toast.success("Login Successful");

            if (data.user.role === "admin") {

                navigate("/admin/dashboard");

            } else {

                navigate("/student/dashboard");

            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-slate-100 flex">

            {/* Left Section */}

            <div className="hidden lg:flex w-1/2 bg-blue-700 text-white flex-col items-center justify-center p-12">

                <LibraryBig size={80} />

                <h1 className="text-5xl font-bold mt-8">

                    Library Management System

                </h1>

                <p className="text-xl mt-6 text-center max-w-lg">

                    Manage students, subscriptions, attendance,

                    seat allocation and payments in one place.

                </p>

            </div>

            {/* Right Section */}

            <div className="flex-1 flex items-center justify-center p-8">

                <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

                    <h2 className="text-3xl font-bold text-center">

                        Welcome Back

                    </h2>

                    <p className="text-gray-500 text-center mt-2">

                        Login to continue

                    </p>

                    <form

                        className="mt-8 space-y-5"

                        onSubmit={handleSubmit}

                    >

                        <div>

                            <label className="block mb-2 text-sm">

                                Email

                            </label>

                            <input

                                type="email"

                                name="email"

                                value={formData.email}

                                onChange={handleChange}

                                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"

                                placeholder="Enter Email"

                            />

                        </div>

                        <div>

                            <label className="block mb-2 text-sm">

                                Password

                            </label>

                            <div className="relative">

                                <input

                                    type={showPassword ? "text" : "password"}

                                    name="password"

                                    value={formData.password}

                                    onChange={handleChange}

                                    className="w-full border rounded-lg px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-600"

                                    placeholder="Enter Password"

                                />

                                <button

                                    type="button"

                                    onClick={() => setShowPassword(!showPassword)}

                                    className="absolute right-4 top-3"

                                >

                                    {

                                        showPassword ?

                                            <EyeOff size={20} />

                                            :

                                            <Eye size={20} />

                                    }

                                </button>

                            </div>

                        </div>

                        <button

                            disabled={loading}

                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 transition"

                        >

                            {

                                loading ?

                                    "Signing In..."

                                    :

                                    "Login"

                            }

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

};

export default Login;