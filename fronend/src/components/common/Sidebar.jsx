import {
    LayoutDashboard,
    Users,
    Armchair,
    ClipboardList,
    CreditCard,
    Bell,
    Settings,
    User,
    BookOpen,
    X,
    Crown,
    Clock3
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, closeSidebar }) => {

    const { user } = useAuth();

    const adminMenus = [

        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: <LayoutDashboard size={20} />
        },

                {
            name: "Requests",
            path: "/admin/Requests",
            icon: <ClipboardList size={20} />
        },

        {
            name: "Students",
            path: "/admin/students",
            icon: <Users size={20} />
        },

        {
            name: "Add Student",
            path: "/admin/add-student",
            icon: <User size={20} />
        },

        {
            name: "Seats",
            path: "/admin/manage-seats",
            icon: <Armchair size={20} />
        },

        {
            name: "Add Seat",
            path: "/admin/add-seat",
            icon: <Armchair size={20} />
        },

        // {
        //     name: "Attendance",
        //     path: "/admin/attendance-report",
        //     icon: <ClipboardList size={20} />
        // },

        {
            name: "Payments",
            path: "/admin/payment",
            icon: <CreditCard size={20} />
        },

        {
            name: "Pending Fees",
            path: "/admin/pending-fees",
            icon: <Clock3 size={20} />
        },



        {
            name: "Settings",
            path: "/admin/library-settings",
            icon: <Settings size={20} />
        },

        {
            name:"Subscriptions",
            path:"/admin/subscriptions",
            icon:<Crown size={20}/>
        },

        {
            name: "Notifications",
            path: "/admin/notifications",
            icon: <Bell size={20} />
        },

    ];

    const studentMenus = [

        {
            name: "Dashboard",
            path: "/student/dashboard",
            icon: <LayoutDashboard size={20} />
        },

        {
            name: "Recipts",
            path: "/student/recipts",
            icon: <ClipboardList size={20} />
        },

        {
            name: "Available Seats",
            path: "/student/available-seats",
            icon: <Armchair size={20} />
        },

        {
            name: "My Seat",
            path: "/student/my-seat",
            icon: <BookOpen size={20} />
        },

        {
            name: "Change Password",
            path: "/student/change-password",
            icon: <Settings size={20} />
        },

        // {
        //     name: "Notifications",
        //     path: "/student/notifications",
        //     icon: <Bell size={20} />
        // },

        // {
        //     name: "Profile",
        //     path: "/student/profile",
        //     icon: <User size={20} />
        // },

    ];

    const menus =

        user?.role === "admin"

            ? adminMenus

            : studentMenus;

    return (
        <>
            {/* Mobile Background */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm transition-all"
                    onClick={closeSidebar}
                />
            )}

            <aside
                className={`
                fixed
                lg:static
                top-0
                left-0
                z-40
                h-screen
                w-64
                bg-slate-950
                border-r border-slate-900
                text-white
                transform
                transition-transform
                duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-900">
                    <h1 className="text-xl font-bold flex items-center gap-2 text-white">
                        <span>📚</span>
                        <span className="bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
                            Library LMS
                        </span>
                    </h1>
                    <button
                        className="lg:hidden text-slate-400 hover:text-white transition-colors"
                        onClick={closeSidebar}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Menu */}
                <nav className="p-4 space-y-1.5 overflow-y-auto h-[calc(100vh-4rem)]">
                    {menus.map((menu) => (
                        <NavLink
                            key={menu.path}
                            to={menu.path}
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                `
                                flex
                                items-center
                                gap-3
                                px-4
                                py-3
                                rounded-xl
                                text-sm
                                font-medium
                                transition-all
                                duration-200
                                ${
                                    isActive
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/15"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                                }
                                `
                            }
                        >
                            <span className="transition-transform duration-200 group-hover:scale-110">
                                {menu.icon}
                            </span>
                            <span>{menu.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );

};

export default Sidebar;