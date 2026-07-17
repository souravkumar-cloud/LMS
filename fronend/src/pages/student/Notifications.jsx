import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Bell,
    CheckCircle,
    Trash2,
    Armchair,
    CreditCard,
    Crown,
    Calendar,
    Megaphone,
    Mail,
    AlertCircle,
    Inbox
} from "lucide-react";

import notificationService from "../../services/notificationService";
import socket from "../../socket/socket";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("all"); // "all", "unread", "read"

    const loadNotifications = async () => {
        try {
            const res = await notificationService.getMyNotifications();
            setNotifications(res.notifications || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadNotifications();

        socket.on("newNotification", (notification) => {
            setNotifications(prev => [notification, ...prev]);
            toast.success(`New announcement: ${notification.title}`, {
                icon: "🔔",
                duration: 4000
            });
        });

        return () => {
            socket.off("newNotification");
        };
    }, []);

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            toast.success("Notification dismissed");
            setNotifications(prev => prev.filter(item => item._id !== id));
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to mark notification as read");
        }
    };

    const deleteNotification = async (id) => {
        try {
            await notificationService.deleteNotification(id);
            toast.success("Notification deleted successfully");
            setNotifications(prev => prev.filter(item => item._id !== id));
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to delete notification");
        }
    };

    // Filter logic
    const filteredNotifications = notifications.filter(item => {
        if (filter === "unread") return !item.isRead;
        if (filter === "read") return item.isRead;
        return true;
    });

    const getIcon = (type) => {
        switch (type) {
            case "seat":
                return <Armchair className="text-blue-500" size={20} />;
            case "payment":
                return <CreditCard className="text-emerald-500" size={20} />;
            case "subscription":
                return <Crown className="text-purple-500" size={20} />;
            case "attendance":
                return <Calendar className="text-orange-500" size={20} />;
            case "announcement":
                return <Megaphone className="text-pink-500" size={20} />;
            default:
                return <Bell className="text-slate-500" size={20} />;
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case "high":
                return (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md border border-rose-100 flex items-center gap-1 shrink-0">
                        <AlertCircle size={10} /> High
                    </span>
                );
            case "medium":
                return (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md border border-amber-100 shrink-0">
                        Medium
                    </span>
                );
            case "low":
            default:
                return (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-50 text-slate-500 rounded-md border border-slate-100 shrink-0">
                        Low
                    </span>
                );
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="space-y-8 font-['Outfit',sans-serif] max-w-4xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl relative">
                        <Bell size={26} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-xs font-bold flex items-center justify-center animate-bounce">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            Notifications
                        </h1>
                        <p className="text-slate-500 font-medium mt-0.5">
                            Stay updated with alerts, announcements, and transactions.
                        </p>
                    </div>
                </div>

                {/* Filter buttons */}
                <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/50 shrink-0">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition duration-200 cursor-pointer ${
                            filter === "all"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter("unread")}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition duration-200 cursor-pointer ${
                            filter === "unread"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        Unread
                    </button>
                    <button
                        onClick={() => setFilter("read")}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition duration-200 cursor-pointer ${
                            filter === "read"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        Read
                    </button>
                </div>
            </div>

            {/* Notification list container */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-100/50 border border-slate-100 p-12 text-center">
                        <Inbox size={64} className="mx-auto text-slate-300" />
                        <h3 className="mt-5 text-xl font-bold text-slate-800">
                            No notifications to show
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">
                            We'll let you know when there's an update.
                        </p>
                    </div>
                ) : (
                    filteredNotifications.map((item) => (
                        <div
                            key={item._id}
                            className={`group bg-white rounded-2xl shadow-lg shadow-slate-100/30 p-5 sm:p-6 border border-slate-100/80 border-l-4 transition duration-300 hover:translate-x-1 ${
                                item.isRead
                                    ? "border-l-slate-300 opacity-75"
                                    : "border-l-blue-600"
                            }`}
                        >
                            <div className="flex gap-4">
                                {/* Type icon representation wrapper */}
                                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-slate-100/80 transition-colors shrink-0 flex items-center justify-center self-start">
                                    {getIcon(item.type)}
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-base font-extrabold text-slate-950">
                                                {item.title}
                                            </h3>
                                            {!item.isRead && (
                                                <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            {getPriorityBadge(item.priority)}
                                            {item.adminOnly && (
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200">
                                                    Admin Only
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                        {item.message}
                                    </p>

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-xs text-slate-400 font-medium">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </span>

                                        <div className="flex gap-2">
                                            {item.adminOnly ? (
                                                <span className="text-xs text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                                    Admin Deletion Only
                                                </span>
                                            ) : (
                                                <>
                                                    {!item.isRead && (
                                                        <button
                                                            onClick={() => markAsRead(item._id)}
                                                            className="text-xs font-bold text-emerald-600 hover:text-white hover:bg-emerald-600 border border-emerald-100 bg-emerald-50 px-3 py-1.5 rounded-lg active:scale-95 transition cursor-pointer flex items-center gap-1.5"
                                                            title="Mark as Read"
                                                        >
                                                            <CheckCircle size={14} />
                                                            Dismiss
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(item._id)}
                                                        className="text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-100 bg-rose-50 p-1.5 rounded-lg active:scale-95 transition cursor-pointer flex items-center justify-center"
                                                        title="Delete Notification"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;