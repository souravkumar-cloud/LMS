import { Bell, LogOut, Menu } from "lucide-react";
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

            setPendingRequests(res.total);

        }

        catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {
        console.log(user)

        if (user?.role === "admin") {

            loadPendingRequests();

        }

        socket.on("seatRequestCreated", (data) => {
            setPendingRequests(data.pendingCount);
        });

        socket.on("seatRequestApproved", (data) => {
            setPendingRequests(data.pendingCount);
        });

        socket.on("seatRequestRejected", (data) => {
            setPendingRequests(data.pendingCount);
        });

        return () => {

            socket.off("seatRequestCreated");

            socket.off("seatRequestApproved");

            socket.off("seatRequestRejected");

        };

        console.log(user);

    }, [user]);

    const handleLogout = () => {

        socket.disconnect();

        logout();

        navigate("/");

    };

    return (

        <header className="h-16 bg-white shadow-sm border-b flex items-center justify-between px-6">

            <div className="flex items-center gap-4">

                <button
                    onClick={toggleSidebar}
                    className="lg:hidden"
                >
                    <Menu />
                </button>

                <h2 className="text-xl font-semibold">

                    Welcome,

                    <span className="text-blue-600 ml-2">

                        {user?.fullName}

                    </span>

                </h2>

            </div>

            <div className="flex items-center gap-6">

                {

                    user?.role === "admin" && (

                        <button
                            onClick={() => navigate("/admin/requests")}
                            className="relative"
                        >

                            <Bell size={22} />

                            {

                                pendingRequests > 0 && (

                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center">

                                        {

                                            pendingRequests > 99

                                                ? "99+"

                                                : pendingRequests

                                        }

                                    </span>

                                )

                            }

                        </button>

                    )

                }

                <div className="flex items-center gap-3">

                    <img
                        src={
                            user?.profilePhoto?.url ||
                            "https://ui-avatars.com/api/?name=User"
                        }
                        alt="Profile"
                        className="h-10 w-10 rounded-full border"
                    />

                    <div className="hidden md:block">

                        <p className="font-semibold">

                            {user?.fullName}

                        </p>

                        <p className="text-sm text-gray-500 capitalize">

                            {user?.role}

                        </p>

                    </div>

                </div>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >

                    <LogOut size={18} />

                    Logout

                </button>

            </div>

        </header>

    );

};

export default Navbar;