import { useEffect, useState } from "react";
import {
    Users,
    Armchair,
    IndianRupee,
    ClipboardCheck
} from "lucide-react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip
} from "recharts";
import { Bell, Send, Megaphone, FileSpreadsheet } from "lucide-react";
import notificationService from "../../services/notificationService";
import studentService from "../../services/studentService";
import reportService from "../../services/reportService";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/common/Loader";

const COLORS = ["#2563eb", "#22c55e"];
const AdminDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [notification, setNotification] = useState({
        title: "",
        message: "",
        recipient: "",
        priority:""
    });
    const fetchDashboard = async () => {
        try {
            const res = await api.get("/dashboard/admin");
            setDashboard(res.data);
            console.log(res.data)
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };
    const loadStudent=async()=>{
        try {
            const res=await studentService.getStudents();
            setStudents(res.students);
        } catch (error) {
            console.log(error);
        }
    };
    const sendNotification=async()=>{
        try {
            if(!notification || !notification.message || !notification.recipient){
                return toast.error("Fill all fields");
            }
            console.log(notification);
            await notificationService.createNotification(notification);
            toast.success("Notification Sent");
            setNotification({
                title:"",
                message:"",
                recipient:"",
                priority:""
            });
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Unable to send"
            );
        }
    }
    const broadcastNotification=async()=>{
        try {
            if(!notification.title || !notification.message){
                return toast.error("Fill title & message");
            }
            await notificationService.broadcastNotification({
                title:notification.title,
                message:notification.message
            });
            toast.success("Broadcast Successfull");
            setNotification({
                title:"",
                message:"",
                recipient:"",
            });
        } catch (error) {
            toast.error("Unable to Broadcast");
        }
    };
    const handleChange=(e)=>{
        setNotification({
            ...notification,
            [e.target.name]:e.target.value
        });
    };
    useEffect(() => {
        fetchDashboard();
        loadStudent();
    }, []);

    if (loading) {
        return <Loader text="Loading Dashboard..." />;
    }

    if (!dashboard) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 font-['Outfit',sans-serif]">
                <div className="p-4 bg-rose-50 text-rose-500 rounded-full border border-rose-100 mb-4 animate-bounce">
                    <Megaphone size={36} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Connection Failed</h3>
                <p className="text-slate-500 text-sm max-w-sm mt-2">
                    Could not establish a connection to the backend API server. Please make sure the service is online and try again.
                </p>
                <button 
                    onClick={() => { setLoading(true); fetchDashboard(); loadStudent(); }}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold rounded-xl shadow-md active:scale-95 transition"
                >
                    Retry Connection
                </button>
            </div>
        );
    }
    const chartData = [
        {
            name: "Occupied",
            value: dashboard.occupiedSeats
        },
        {
            name: "Available",
            value: dashboard.availableSeats
        }
    ];
    return (
        <div className="space-y-8 font-['Outfit',sans-serif]">
            {/* Heading */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    Admin Dashboard
                </h1>
                <p className="text-slate-500 font-medium">
                    Welcome back 👋 Here's an overview of the library today.
                </p>
            </div>
             {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <Card
                    title="Active Students"
                    value={dashboard.dashboard.activeStudents}
                    gradient="from-blue-500 to-indigo-600 shadow-blue-500/20"
                    icon={<Users size={24} />}
                />
                <Card
                    title="Occupied Seats"
                    value={`${dashboard.dashboard.occupiedSeats}/${dashboard.dashboard.totalSeats}`}
                    gradient="from-emerald-500 to-teal-600 shadow-emerald-500/20"
                    icon={<Armchair size={24} />}
                />
                <Card
                    title="Today's Attendance"
                    value={dashboard.dashboard.todayAttendance}
                    gradient="from-amber-500 to-orange-600 shadow-amber-500/20"
                    icon={<ClipboardCheck size={24} />}
                />
                <Card
                    title="Today's Revenue"
                    value={`₹${dashboard.dashboard.todayRevenue}`}
                    gradient="from-rose-500 to-red-600 shadow-rose-500/20"
                    icon={<IndianRupee size={24} />}
                />
            </div>

            {/* Download Today's Attendance Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                        <FileSpreadsheet size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Today's Attendance Report</h3>
                        <p className="text-blue-100 text-sm mt-0.5">Export a detailed Excel spreadsheet of all students who checked in today.</p>
                    </div>
                </div>
                <button
                    onClick={() => reportService.todayAttendanceExcel()}
                    className="w-full sm:w-auto px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-xl text-sm transition duration-300 shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                    <FileSpreadsheet size={16} />
                    Download Excel
                </button>
            </div>

            {/* Quick Notifications */}
            <div className="bg-white border border-slate-100/80 rounded-2xl shadow-xl shadow-slate-100/30 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                        <Bell size={22} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Quick Announcements
                    </h2>
                </div>

                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Announcement Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={notification.title}
                                onChange={handleChange}
                                placeholder="Enter announcement title"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Target Recipient
                            </label>
                            <select
                                name="recipient"
                                value={notification.recipient}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            >
                                <option value="">
                                    Select Student
                                </option>
                                <option value="all">
                                    📢 All Students
                                </option>
                                {
                                    students.map(student => (
                                        <option
                                            key={student._id}
                                            value={student._id}
                                        >
                                            {student.fullName}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Priority Level
                            </label>
                            <select
                                name="priority"
                                value={notification.priority}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            >
                                <option value="">
                                    Select Priority
                                </option>
                                <option value="low">
                                    Low
                                </option>
                                <option value="medium">
                                    Medium
                                </option>
                                <option value="high">
                                    High
                                </option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Message Content
                        </label>
                        <textarea
                            rows="4"
                            name="message"
                            value={notification.message}
                            onChange={handleChange}
                            placeholder="Type details here..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                    </div>
                    <div className="flex gap-4 pt-2">
                        {
                            notification.recipient === "all" ? (
                                <button
                                    onClick={broadcastNotification}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/35 hover:brightness-110 active:scale-[0.99]"
                                >
                                    <Megaphone size={16} />
                                    <span>Broadcast announcement</span>
                                </button>
                            ) : (
                                <button
                                    onClick={sendNotification}
                                    disabled={!notification.recipient}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/35 hover:brightness-110 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
                                >
                                    <Send size={16} />
                                    <span>Send direct notification</span>
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

const Card = ({
    title,
    value,
    icon,
    gradient
}) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-100/40 p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
            <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-400 tracking-wide uppercase">
                    {title}
                </p>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {value}
                </h2>
            </div>
            <div className={`bg-gradient-to-br ${gradient} text-white p-3.5 rounded-2xl shadow-lg`}>
                {icon}
            </div>
        </div>
    );
};

export default AdminDashboard;