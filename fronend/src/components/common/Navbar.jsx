import { Bell, LogOut, Menu, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../socket/socket";
import seatRequestService from "../../services/seatRequestService";

const Navbar = ({ toggleSidebar }) => {

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const [pendingRequests, setPendingRequests] = useState(0);

    const loadPendingRequests = async () => {

        try {

            const res = await seatRequestService.getPendingRequests();

            setPendingRequests(res.requests?.length || 0);

        }

        catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        if (user?.role === "admin") {

            loadPendingRequests();

            socket.on("newNotification", () => {

                loadPendingRequests();

            });

            socket.on("notification", () => {
                loadPendingRequests();
            });

            return () => {

                socket.off("newNotification");

                socket.off("notification");

            };

        }

    }, [user]);

    const handleLogout = () => {

        logout();

        navigate("/login");

    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 shadow-sm shadow-slate-100/50">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100/80 active:scale-95 transition cursor-pointer"
                >
                    <Menu size={20} />
                </button>
            </div>

            <div className="flex items-center gap-5">
                {user?.role === "admin" && (
                    <button
                        onClick={() => navigate("/admin/Requests")}
                        className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition duration-300 cursor-pointer"
                    >
                        <Bell size={20} />
                        {pendingRequests > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4.5 min-w-4.5 px-1.5 flex items-center justify-center border-2 border-white">
                                {pendingRequests > 99 ? "99+" : pendingRequests}
                            </span>
                        )}
                    </button>
                )}

                <div className="flex items-center gap-3 border-r border-slate-100 pr-5">
                    <div className="h-9 w-9 rounded-full border border-slate-200/80 bg-slate-50 flex items-center justify-center text-slate-500">
                        <User size={18} />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-slate-800 leading-tight">
                            {user?.fullName}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium capitalize mt-0.5">
                            {user?.role}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-slate-50 border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 px-4 py-2 rounded-xl transition duration-300 flex items-center gap-2 text-sm font-medium"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );

};

export default Navbar;