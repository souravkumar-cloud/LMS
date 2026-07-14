import {
    LayoutDashboard,
    Users,
    Armchair,
    ClipboardList,
    CreditCard,
    Bell,
    FileText,
    Settings,
    User,
    BookOpen,
    X,
    Crown,
    BarChart3,
    // ClipboardList 
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

        {
            name: "Attendance",
            path: "/admin/attendance-report",
            icon: <ClipboardList size={20} />
        },

        {
            name: "Payments",
            path: "/admin/payment",
            icon: <CreditCard size={20} />
        },

        {
            name: "Reports",
            path: "/admin/reports",
            icon: <FileText size={20} />
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
            name: "Profile",
            path: "/student/profile",
            icon: <User size={20} />
        },

    ];

    const menus =

        user?.role === "admin"

            ? adminMenus

            : studentMenus;

    return (

        <>

            {/* Mobile Background */}

            {

                isOpen && (

                    <div

                        className="fixed inset-0 bg-black/40 z-30 lg:hidden"

                        onClick={closeSidebar}

                    />

                )

            }

            <aside

                className={`

                fixed

                lg:static

                top-0

                left-0

                z-40

                h-screen

                w-64

                bg-slate-900

                text-white

                transform

                transition-transform

                duration-300

                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}

                `}

            >

                {/* Logo */}

                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700">

                    <h1 className="text-xl font-bold">

                        📚 Library LMS

                    </h1>

                    <button

                        className="lg:hidden"

                        onClick={closeSidebar}

                    >

                        <X />

                    </button>

                </div>

                {/* Menu */}

                <nav className="p-4 space-y-2">

                    {

                        menus.map((menu) => (

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

                                    rounded-lg

                                    transition-all

                                    ${

                                        isActive

                                            ? "bg-blue-600"

                                            : "hover:bg-slate-800"

                                    }

                                    `

                                }

                            >

                                {menu.icon}

                                <span>

                                    {menu.name}

                                </span>

                            </NavLink>

                        ))

                    }

                </nav>

            </aside>

        </>

    );

};

export default Sidebar;