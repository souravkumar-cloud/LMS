import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const StudentLayout = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {

        setIsSidebarOpen((prev) => !prev);

    };

    const closeSidebar = () => {

        setIsSidebarOpen(false);

    };

    return (

        <div className="flex h-screen bg-slate-100">

            {/* Sidebar */}

            <Sidebar

                isOpen={isSidebarOpen}

                closeSidebar={closeSidebar}

            />

            {/* Main Content */}

            <div className="flex flex-1 flex-col overflow-hidden">

                <Navbar

                    toggleSidebar={toggleSidebar}

                />

                <main className="flex-1 overflow-y-auto bg-slate-100 p-6">

                    <Outlet />

                </main>

            </div>

        </div>

    );

};

export default StudentLayout;