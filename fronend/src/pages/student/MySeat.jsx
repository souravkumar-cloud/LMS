import { useEffect, useState } from "react";
import {
    Armchair,
    Clock3,
    Crown,
    RefreshCcw,
    Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import seatService from "../../services/seatService";
import api from "../../services/api";

const MySeat = () => {
    const [loading, setLoading] = useState(true);
    const [seat, setSeat] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [requests, setRequests] = useState([]);

    const fetchSeatAndRequests = async () => {
        try {
            const seatRes = await seatService.getMySeat();
            setSeat(seatRes.seat);
            setSubscription(seatRes.subscription);

            const reqRes = await api.get("/seat/my-requests");
            setRequests(reqRes.data.requests || []);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Unable to fetch seat details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSeatAndRequests();
    }, []);

    const handleCancelRequest = async (requestId) => {
        if (!window.confirm("Are you sure you want to cancel this booking request?")) return;

        try {
            await api.put(`/seat/cancel/${requestId}`);
            toast.success("Request cancelled successfully!");
            fetchSeatAndRequests();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel request.");
        }
    };

    if (loading) {
        return <Loader text="Loading Seat Details..." />;
    }

    const daysLeft = subscription?.endDate
        ? Math.ceil((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24))
        : 0;

    if (!seat) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-up font-['Outfit',sans-serif]">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/20 text-indigo-300 rounded-2xl border border-indigo-400/20 shadow-inner">
                            <Armchair size={32} />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-400/20 mb-2">
                                <Sparkles className="w-3.5 h-3.5" />
                                Seat Center
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-white">My Seat</h1>
                            <p className="text-slate-300 mt-1 text-sm">
                                View your assigned library seat and check change requests.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-12 text-center flex flex-col items-center justify-center">
                    <div className="p-5 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100 mb-6">
                        <Armchair size={64} className="stroke-[1.5]" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">No Allotted Seat</h2>
                    <p className="text-slate-500 text-sm max-w-sm mt-2">
                        You do not have a seat assignment yet. Browse available seats and submit a request to the library manager.
                    </p>
                    <Link
                        to="/student/available-seats"
                        className="primary-button inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold mt-8 shadow-md"
                    >
                        Find Available Seats
                    </Link>
                </div>

                {/* History Section */}
                {requests.length > 0 && (
                    <RequestsHistoryTable requests={requests} onCancel={handleCancelRequest} />
                )}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-up font-['Outfit',sans-serif]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 text-indigo-300 rounded-2xl border border-indigo-400/20 shadow-inner">
                        <Armchair size={32} />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-400/20 mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            Seat Center
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white">My Seat</h1>
                        <p className="text-slate-300 mt-1 text-sm">
                            Manage your active library desk allotment and view change history.
                        </p>
                    </div>
                </div>
            </div>

            {/* Split layout (2 columns on desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Side: Seat Details Card (col-span-2) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Visual Seat Badge */}
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-3xl text-white p-8 relative overflow-hidden shadow-xl shadow-indigo-100">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_40%)]" />
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="space-y-4">
                                <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest block">Your Allotted Seat</span>
                                <h1 className="text-7xl font-black tracking-tight">{seat.seatNumber}</h1>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    <span className="bg-white/10 text-white px-3 py-1 rounded-xl text-xs font-semibold border border-white/10">
                                        Floor {seat.floor}
                                    </span>
                                    <span className="bg-white/10 text-white px-3 py-1 rounded-xl text-xs font-semibold border border-white/10 capitalize">
                                        {seat.category} Seat
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur text-indigo-100">
                                <Armchair size={48} />
                            </div>
                        </div>
                    </div>

                    {/* Stats Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoCard
                            icon={<Crown size={20} />}
                            title="Seat Tier"
                            value={seat.category}
                            color="bg-purple-50 text-purple-600 border-purple-100"
                        />
                        <InfoCard
                            icon={<Clock3 size={20} />}
                            title="Access Timing"
                            value={subscription?.plan?.accessType === "hourly" ? "Hourly Access" : "Full-Day (8 AM - 10 PM)"}
                            color="bg-blue-50 text-blue-600 border-blue-100"
                        />
                    </div>
                </div>

                {/* Right Side: Active Subscription Card (col-span-1) */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6 flex flex-col justify-between h-full min-h-[300px]">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Active Membership</h2>
                                    <p className="text-slate-400 text-xs mt-0.5">Your library subscription plan</p>
                                </div>
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                                    <Crown size={20} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-slate-50 pb-3">
                                    <span className="text-slate-400 text-xs font-semibold">Plan Name</span>
                                    <span className="text-slate-800 text-xs font-bold">{subscription?.plan?.name || "Regular Plan"}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-50 pb-3">
                                    <span className="text-slate-400 text-xs font-semibold">Access Period</span>
                                    <span className="text-slate-800 text-xs font-bold">
                                        {subscription?.plan?.accessType === "hourly" ? "Hourly Access" : "Full-Day"}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-slate-50 pb-3">
                                    <span className="text-slate-400 text-xs font-semibold">Expiry Date</span>
                                    <span className="text-slate-800 text-xs font-bold">
                                        {subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString() : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time Remaining</span>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">
                                {daysLeft > 0 ? `${daysLeft} Days` : "Expired / N/A"}
                            </div>
                            <Link
                                to="/student/available-seats"
                                className="primary-button w-full text-center py-2.5 text-xs font-bold rounded-xl mt-6 shadow-md flex items-center justify-center gap-2"
                            >
                                <RefreshCcw size={14} />
                                Request Seat Change
                            </Link>
                        </div>
                    </div>
                </div>

            </div>

            {/* Requests history section */}
            {requests.length > 0 && (
                <RequestsHistoryTable requests={requests} onCancel={handleCancelRequest} />
            )}
        </div>
    );
};

const InfoCard = ({ icon, title, value, color }) => (
    <div className="bg-white rounded-2xl border border-slate-100/80 shadow-md shadow-slate-100/30 p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl border ${color} shrink-0`}>
            {icon}
        </div>
        <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{title}</span>
            <span className="text-sm font-extrabold text-slate-800 mt-0.5 capitalize block">{value}</span>
        </div>
    </div>
);

const RequestsHistoryTable = ({ requests, onCancel }) => (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/40">
            <h2 className="text-lg font-bold text-slate-800">Seat Booking Requests</h2>
            <p className="text-slate-400 text-xs mt-0.5">Track your pending and past seat assignments</p>
        </div>
        <div className="table-container">
            <table className="min-w-full divide-y divide-slate-100">
                <thead>
                    <tr className="table-header">
                        <th className="py-4 px-6 text-left">Requested Seat</th>
                        <th className="py-4 px-6 text-center">Previous Seat</th>
                        <th className="py-4 px-6 text-center">Request Type</th>
                        <th className="py-4 px-6 text-center">Request Date</th>
                        <th className="py-4 px-6 text-center">Status</th>
                        <th className="py-4 px-6 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-medium">
                    {requests.map((req) => (
                        <tr key={req._id} className="table-row">
                            <td className="py-4 px-6 text-left font-bold text-slate-800">
                                Desk {req.requestedSeat?.seatNumber || "N/A"}
                            </td>
                            <td className="py-4 px-6 text-center text-slate-500">
                                {req.currentSeat ? `Desk ${req.currentSeat.seatNumber}` : "None"}
                            </td>
                            <td className="py-4 px-6 text-center capitalize text-slate-500">
                                {req.requestType === "seat-change" ? "Seat Change" : "New Seat"}
                            </td>
                            <td className="py-4 px-6 text-center text-slate-500">
                                {new Date(req.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border capitalize ${
                                    req.status === "approved"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        : req.status === "rejected"
                                        ? "bg-rose-50 text-rose-700 border-rose-100"
                                        : "bg-amber-50 text-amber-700 border-amber-100"
                                }`}>
                                    {req.status}
                                </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                {req.status === "pending" && (
                                    <button
                                        onClick={() => onCancel(req._id)}
                                        className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-xl border border-rose-100 font-bold transition active:scale-95 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default MySeat;