import React, { useEffect, useState, useMemo } from "react";
import {
    Armchair,
    CreditCard,
    Calendar,
    Bell,
    Clock,
    Loader2,
    Trash2,
    MessageSquare,
    Sparkles,
    Send
} from "lucide-react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

import Loader from "../../components/common/Loader";
import api from "../../services/api";
import toast from "react-hot-toast";
import notificationService from "../../services/notificationService";

const StudentDashboard = () => {

    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState(null);
    const [marking, setMarking] = useState(false);
    const [adminMessage, setAdminMessage] = useState("");
    const [sendingMessage, setSendingMessage] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!adminMessage.trim()) return;

        try {
            setSendingMessage(true);
            await notificationService.sendMessageToAdmin(adminMessage);
            toast.success("Message sent to admin successfully!");
            setAdminMessage("");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to send message.");
        } finally {
            setSendingMessage(false);
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            await api.delete(`/notification/${id}`);
            toast.success("Notification deleted successfully");
            setDashboard(prev => ({
                ...prev,
                notifications: prev.notifications.filter(item => item._id !== id)
            }));
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to delete notification");
        }
    };

    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    startDate.setDate(startDate.getDate() + 1);

    const attendanceValues = useMemo(() => {
        if (!dashboard?.attendanceHistory) return [];
        return dashboard.attendanceHistory.map(item => ({
            date: item.attendanceDate.split("T")[0],
            status: item.status
        }));
    }, [dashboard]);

    const fetchDashboard = async () => {
        try {
            const res = await api.get("/dashboard/student");
            setDashboard(res.data.dashboard);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const markAttendance = async () => {
        if (dashboard?.attendance || marking) return;

        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            return;
        }

        setMarking(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    await api.post("/attendance/entry", {
                        verificationMethod: "gps",
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    toast.success("Entry Marked successfully!");
                    fetchDashboard();
                } catch (error) {
                    console.error(error.response?.data);
                    toast.error(
                        error.response?.data?.message ||
                        "Unable to mark attendance"
                    );
                } finally {
                    setMarking(false);
                }
            },
            (err) => {
                toast.error(`Please enable location: ${err.message || "Permission denied"}`);
                setMarking(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const markExit = async () => {
        try {
            setMarking(true);
            await api.post("/attendance/exit");
            toast.success("Exit marked successfully!");
            fetchDashboard();
        } catch (error) {
            console.error(error.response?.data);
            toast.error(
                error.response?.data?.message ||
                "Unable to mark exit"
            );
        } finally {
            setMarking(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    if (loading) {
        return <Loader text="Loading Dashboard..." />;
    }

    if (!dashboard) {
        return (
            <div className="text-center py-16 text-slate-500 font-['Outfit',sans-serif]">
                Couldn't load your dashboard. Please refresh the page.
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-up font-['Outfit',sans-serif]">
            <style>{`
                .attendance-heatmap-wrap {
                    width: 100%;
                    overflow-x: auto;
                }
                .attendance-heatmap-wrap .react-calendar-heatmap {
                    width: max-content;
                    min-width: 100%;
                }
                .attendance-heatmap-wrap svg {
                    width: auto !important;
                    height: auto !important;
                    max-width: none !important;
                    display: block;
                }
                .attendance-heatmap-wrap .react-calendar-heatmap text {
                    font-size: 9px;
                    fill: #94a3b8;
                }
                .attendance-heatmap-wrap .react-calendar-heatmap rect {
                    rx: 2px;
                    ry: 2px;
                }
                .attendance-heatmap-wrap .react-calendar-heatmap .color-empty {
                    fill: #f1f5f9;
                }
                .attendance-heatmap-wrap .react-calendar-heatmap .color-present {
                    fill: #10b981;
                }
                .attendance-heatmap-wrap .react-calendar-heatmap .color-absent {
                    fill: #f43f5e;
                }
                .attendance-heatmap-wrap .react-calendar-heatmap rect:hover {
                    stroke: #64748b;
                    stroke-width: 1px;
                    cursor: pointer;
                }
            `}</style>

            {/* Welcome Greeting Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-400/20 mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        Student Portal
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                        {getGreeting()},{" "}
                        <span className="bg-gradient-to-r from-indigo-200 via-indigo-100 to-blue-300 bg-clip-text text-transparent">
                            {dashboard?.user?.fullName || "Student"}
                        </span>
                    </h1>
                    <p className="text-slate-300 mt-1 text-sm max-w-xl">
                        Welcome to your dashboard. Track check-ins, manage active memberships, and contact administration.
                    </p>
                </div>
            </div>

            {/* Quick Summary Cards (At the Top) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    icon={<Armchair size={24} />}
                    title="Allotted Seat"
                    value={dashboard.seat ? `Seat ${dashboard.seat.seatNumber}` : "Not Assigned"}
                    color="from-blue-500 to-indigo-600 shadow-blue-500/20"
                />
                <DashboardCard
                    icon={<CreditCard size={24} />}
                    title="Active Plan"
                    value={dashboard.subscription ? dashboard.subscription.plan.name : "None"}
                    color="from-emerald-500 to-teal-600 shadow-emerald-500/20"
                />
                <DashboardCard
                    icon={<Calendar size={24} />}
                    title="Expiration Date"
                    value={
                        dashboard.subscription
                            ? new Date(dashboard.subscription.endDate).toLocaleDateString()
                            : "N/A"
                    }
                    color="from-amber-500 to-orange-600 shadow-amber-500/20"
                />
                <DashboardCard
                    icon={<Clock size={24} />}
                    title="Today's Status"
                    value={dashboard.todayAttendance ? "Checked In" : "Not Marked"}
                    color="from-purple-500 to-pink-600 shadow-purple-500/20"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Attendance Activity heatmap (col-span-2) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-100/80 rounded-3xl shadow-xl shadow-slate-100/30 p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Attendance Activity</h2>
                                <p className="text-slate-400 text-xs mt-1">Your daily library check-in history.</p>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={markAttendance}
                                    disabled={marking || !!dashboard?.attendance}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition duration-300 shadow-md ${
                                        dashboard?.attendance
                                            ? "bg-emerald-600/95 shadow-emerald-500/10 cursor-not-allowed"
                                            : marking
                                                ? "bg-blue-400/95 cursor-wait"
                                                : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 cursor-pointer"
                                    }`}
                                >
                                    {marking && <Loader2 size={14} className="animate-spin" />}
                                    {dashboard?.attendance ? "Entry Marked" : marking ? "Marking..." : "Mark Entry"}
                                </button>

                                <button
                                    onClick={markExit}
                                    disabled={
                                        marking ||
                                        !dashboard?.todayAttendance ||
                                        dashboard?.todayAttendance?.exitTime
                                    }
                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition duration-300 shadow-md ${
                                        dashboard?.todayAttendance?.exitTime
                                            ? "bg-slate-400 shadow-slate-500/10 cursor-not-allowed"
                                            : marking
                                                ? "bg-rose-400/95 cursor-wait"
                                                : "bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/20 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 cursor-pointer"
                                    }`}
                                >
                                    {marking && <Loader2 size={14} className="animate-spin" />}
                                    {dashboard?.todayAttendance?.exitTime ? "Exit Marked" : marking ? "Marking..." : "Mark Exit"}
                                </button>
                            </div>
                        </div>

                        {/* Calendar Heatmap Container */}
                        <div className="overflow-x-auto border border-slate-100 rounded-2xl p-4 bg-slate-50/40">
                            <div className="attendance-heatmap-wrap">
                                <CalendarHeatmap
                                    startDate={startDate}
                                    endDate={endDate}
                                    values={attendanceValues}
                                    showWeekdayLabels
                                    showMonthLabels
                                    gutterSize={3}
                                    classForValue={(value) => {
                                        if (!value) return "color-empty";
                                        if (value.status === "present" || value.status === "inside" || value.status === "completed") return "color-present";
                                        return "color-absent";
                                    }}
                                    transformDayElement={(rect, value, index) => {
                                        const label = value?.date
                                            ? `${value.date}: ${value.status === "absent" ? "Absent" : "Present"}`
                                            : "No record";
                                        return (
                                            <g key={index}>
                                                {React.cloneElement(rect, {
                                                    width: 11,
                                                    height: 11,
                                                    rx: 2,
                                                    ry: 2
                                                })}
                                                <title>{label}</title>
                                            </g>
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        {/* Stats Info Footer */}
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                                    Present
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-sm bg-slate-200"></div>
                                    No Record
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Announcements & Contact Admin (col-span-1) */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Latest Announcements */}
                    <div className="bg-white border border-slate-100/80 rounded-3xl shadow-xl shadow-slate-100/30 p-6">
                        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
                            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                                <Bell size={18} />
                            </div>
                            <h2 className="text-base font-bold text-slate-800">Latest Announcements</h2>
                        </div>
                        
                        {dashboard?.notifications?.length === 0 ? (
                            <p className="text-slate-400 text-xs py-2 font-medium">No new announcements at this time.</p>
                        ) : (
                            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                                {dashboard.notifications.map((item) => (
                                    <div key={item._id} className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-100/80 flex justify-between items-start gap-3 hover:bg-slate-50 transition">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-800 text-xs leading-normal">{item.title}</h3>
                                            <p className="text-slate-500 text-xs mt-1 leading-normal font-medium">{item.message}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteNotification(item._id)}
                                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition cursor-pointer"
                                            title="Dismiss"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Contact Admin Form */}
                    <div className="bg-white border border-slate-100/80 rounded-3xl shadow-xl shadow-slate-100/30 p-6">
                        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
                            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                                <MessageSquare size={18} />
                            </div>
                            <h2 className="text-base font-bold text-slate-800">Contact Admin</h2>
                        </div>
                        <form onSubmit={handleSendMessage} className="space-y-4">
                            <div>
                                <textarea
                                    rows={3}
                                    value={adminMessage}
                                    onChange={(e) => setAdminMessage(e.target.value)}
                                    placeholder="Type your question, request or feedback here..."
                                    className="w-full border border-slate-200 bg-slate-50/40 rounded-xl p-3.5 text-xs text-slate-800 outline-none transition duration-300 resize-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={sendingMessage || !adminMessage.trim()}
                                    className="primary-button inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl"
                                >
                                    {sendingMessage ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            <Send size={13} />
                                            SendMessage
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

const DashboardCard = ({ icon, title, value, color }) => (
    <div className="bg-white rounded-3xl border border-slate-100/80 shadow-md shadow-slate-100/30 p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
        <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-400 tracking-wide uppercase">{title}</p>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{value}</h2>
        </div>
        <div className={`bg-gradient-to-br ${color} text-white p-3 rounded-2xl shadow-md`}>
            {icon}
        </div>
    </div>
);

export default StudentDashboard;