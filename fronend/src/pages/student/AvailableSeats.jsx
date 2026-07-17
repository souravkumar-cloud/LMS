import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    Armchair,
    Filter,
    Sparkles,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    HelpCircle
} from "lucide-react";

import Loader from "../../components/common/Loader";
import seatService from "../../services/seatService";

const AvailableSeats = () => {
    const [loading, setLoading] = useState(true);
    const [seats, setSeats] = useState([]);
    const [floor, setFloor] = useState("All");
    const [category, setCategory] = useState("All");

    const fetchSeats = async () => {
        try {
            const res = await seatService.getAvailableSeats();
            setSeats(res.seats || []);
        } catch (error) {
            console.error(error);
            toast.error("Unable to load seats.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSeats();
    }, []);

    const filteredSeats = useMemo(() => {
        return seats.filter((seat) => {
            const floorMatch = floor === "All" ? true : String(seat.floor) === floor;
            const categoryMatch = category === "All" ? true : seat.category === category;
            return floorMatch && categoryMatch;
        });
    }, [floor, category, seats]);

    const requestSeat = async (seat) => {
        if (seat.status !== "available") {
            toast.error("This seat is not available for request.");
            return;
        }

        if (!window.confirm(`Are you sure you want to request Seat ${seat.seatNumber}?`)) {
            return;
        }

        try {
            await seatService.requestSeat(seat._id);
            toast.success(`Seat request for ${seat.seatNumber} sent successfully!`);
            fetchSeats();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to request seat"
            );
        }
    };

    if (loading) {
        return <Loader text="Loading Seating Grid..." />;
    }

    const availableCount = filteredSeats.filter(s => s.status === "available").length;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-up font-['Outfit',sans-serif]">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 text-indigo-300 rounded-2xl border border-indigo-400/20 shadow-inner">
                        <Armchair size={32} />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-400/20 mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            Seat Allocations
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white">
                            Available Seats
                        </h1>
                        <p className="text-slate-300 mt-1 text-sm max-w-xl">
                            Real-time interactive map of the library desks. Filter by floor or category, select a green desk, and request it.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter & Legend Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Filters card */}
                <div className="lg:col-span-1 glass-panel rounded-3xl p-5 border border-slate-100/80 bg-white/95 shadow-md flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="text-slate-500 w-4 h-4" />
                        <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                            Filter Seating
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Floor</label>
                            <select
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                            >
                                <option value="All">All Floors</option>
                                <option value="1">1st Floor</option>
                                <option value="2">2nd Floor</option>
                                <option value="3">3rd Floor</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                            >
                                <option value="All">All Tiers</option>
                                <option value="regular">Regular</option>
                                <option value="premium">Premium</option>
                                <option value="hourly">Hourly</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Legend & Stats card */}
                <div className="lg:col-span-2 glass-panel rounded-3xl p-5 border border-slate-100/80 bg-white/95 shadow-md flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-3 flex-1 w-full">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Seating Legend</span>
                        <div className="flex flex-wrap gap-5">
                            <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-800">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Available ({availableCount})
                            </div>
                            <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-800">
                                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                Occupied ({filteredSeats.length - availableCount - filteredSeats.filter(s => s.status === "maintenance").length})
                            </div>
                            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-800">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                Maintenance ({filteredSeats.filter(s => s.status === "maintenance").length})
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-auto md:border-l md:border-slate-100 md:pl-6 text-center md:text-left">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Desks</span>
                        <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{filteredSeats.length}</span>
                    </div>
                </div>
            </div>

            {/* Seating Grid */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8">
                {filteredSeats.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <HelpCircle className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p className="font-medium text-sm">No desks match your filter criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                        {filteredSeats.map((seat) => {
                            const isAvail = seat.status === "available";
                            const isOccupied = seat.status === "occupied";
                            const isMaint = seat.status === "maintenance";

                            return (
                                <button
                                    key={seat._id}
                                    disabled={!isAvail}
                                    onClick={() => requestSeat(seat)}
                                    className={`
                                        group relative rounded-2xl p-5 border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 bg-white
                                        ${isAvail 
                                            ? "border-emerald-200/80 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-100/50 hover:-translate-y-1 cursor-pointer" 
                                            : "border-slate-100 opacity-65 cursor-not-allowed"
                                        }
                                    `}
                                >
                                    {/* Icon Container */}
                                    <div className={`
                                        p-3.5 rounded-2xl border transition-all duration-300
                                        ${isAvail 
                                            ? "bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:scale-110" 
                                            : isOccupied
                                            ? "bg-rose-50 border-rose-100 text-rose-500"
                                            : "bg-amber-50 border-amber-100 text-amber-500"
                                        }
                                    `}>
                                        <Armchair size={26} />
                                    </div>

                                    {/* Desk details */}
                                    <div className="mt-1">
                                        <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-slate-900 transition-colors">
                                            Desk {seat.seatNumber}
                                        </h3>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                                            Floor {seat.floor}
                                        </span>
                                    </div>

                                    {/* Category badge */}
                                    <span className={`
                                        inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border uppercase tracking-wider mt-1
                                        ${seat.category === "premium"
                                            ? "bg-purple-50 text-purple-600 border-purple-100"
                                            : seat.category === "hourly"
                                            ? "bg-amber-50 text-amber-600 border-amber-100"
                                            : "bg-blue-50 text-blue-600 border-blue-100"
                                        }
                                    `}>
                                        {seat.category}
                                    </span>

                                    {/* Mini Status Dot */}
                                    <span className={`
                                        absolute top-2.5 right-2.5 w-2 h-2 rounded-full
                                        ${isAvail 
                                            ? "bg-emerald-500 animate-pulse" 
                                            : isOccupied
                                            ? "bg-rose-500"
                                            : "bg-amber-500"
                                        }
                                    `} />
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvailableSeats;