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
        <div className="min-h-screen bg-slate-50 flex font-['Outfit',sans-serif]">
            {/* Left Section */}
            <div className="hidden lg:flex w-1/2 relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-950 via-slate-900 to-black text-white flex-col items-center justify-center p-16 overflow-hidden">
                {/* Decorative Glowing Blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
                
                {/* Glassmorphic Logo Container */}
                <div className="relative z-10 bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-2xl mb-8 animate-float-card">
                    <LibraryBig size={72} className="text-blue-400" />
                </div>

                <div className="relative z-10 text-center max-w-lg">
                    <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                        Library Management System
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto my-6 rounded-full animate-pulse-line"></div>
                    <p className="text-slate-400 text-lg xl:text-xl font-normal leading-relaxed">
                        Manage students, seat allocations, real-time attendance, subscription plans, and invoice payments in one elegant interface.
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
                <div className="bg-white/80 border border-slate-100/80 shadow-2xl shadow-slate-200/50 backdrop-blur-md rounded-2xl p-8 sm:p-10 w-full max-w-md animate-fade-up">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            Welcome Back
                        </h2>
                        <p className="text-slate-500 mt-2 text-sm">
                            Log in to your dashboard to continue
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/35 hover:brightness-110 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

};

export default Login;