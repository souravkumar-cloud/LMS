import { useEffect, useState } from "react";
import { 
    Clock3, 
    Search, 
    Sparkles, 
    User, 
    CheckCircle2, 
    DollarSign,
    CreditCard,
    X,
    TrendingDown,
    UserCheck
} from "lucide-react";
import toast from "react-hot-toast";
import paymentService from "../../services/paymentService";
import Loader from "../../components/common/Loader";

const PendingFees = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [collectingPayment, setCollectingPayment] = useState(null); // stores payment object when collecting
    const [paymentMethod, setPaymentMethod] = useState("cash");

    const fetchPendingPayments = async () => {
        try {
            const res = await paymentService.paymentHistory();
            // Filter only pending status
            const pending = (res.payments || []).filter(
                (p) => p.paymentStatus === "pending"
            );
            setPayments(pending);
        } catch (error) {
            console.error("Error fetching pending fees:", error);
            toast.error("Unable to load pending fees list.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const handleCollectSubmit = async (e) => {
        e.preventDefault();
        if (!collectingPayment) return;

        const toastId = toast.loading("Recording fee collection...");
        try {
            await paymentService.collectPayment(collectingPayment._id, paymentMethod);
            toast.success("Payment recorded successfully!", { id: toastId });
            setCollectingPayment(null);
            fetchPendingPayments();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to collect payment", { id: toastId });
        }
    };

    if (loading) {
        return <Loader text="Loading Outstanding Dues..." />;
    }

    const filteredPayments = payments.filter((payment) => {
        const studentName = payment.student?.fullName || "";
        const studentEmail = payment.student?.email || "";
        const studentPhone = payment.student?.phone || "";
        const planName = payment.plan?.name || "";

        const query = search.toLowerCase();
        return (
            studentName.toLowerCase().includes(query) ||
            studentEmail.toLowerCase().includes(query) ||
            studentPhone.includes(query) ||
            planName.toLowerCase().includes(query)
        );
    });

    const totalOutstanding = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-up font-['Outfit',sans-serif]">
            {/* Header banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 text-indigo-300 rounded-2xl border border-indigo-400/20 shadow-inner">
                        <Clock3 size={32} />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-400/20 mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            Financial Center
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white">
                            Pending Fees
                        </h1>
                        <p className="text-slate-300 mt-1 text-sm max-w-xl">
                            Track outstanding dues, expired subscription fees, and collect pending payments from students.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats and Search grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {/* Search Bar */}
                <div className="md:col-span-2 relative flex items-center">
                    <Search className="absolute left-4 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by student name, email, phone or plan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-4 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 shadow-sm"
                    />
                </div>

                {/* Outstanding Dues Summary Card */}
                <div className="bg-gradient-to-br from-rose-50 to-red-50/50 border border-rose-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                    <div>
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-1">
                            Outstanding Dues
                        </span>
                        <span className="text-3xl font-extrabold text-slate-900">
                            ₹{totalOutstanding.toLocaleString()}
                        </span>
                    </div>
                    <div className="p-3.5 bg-rose-500/10 text-rose-600 rounded-2xl border border-rose-200/40">
                        <TrendingDown size={24} />
                    </div>
                </div>
            </div>

            {/* Pending Fees Table */}
            <div className="table-container shadow-xl shadow-slate-100/50 bg-white border border-slate-100 rounded-3xl">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="table-header">
                            <th className="px-6 py-4">Student Details</th>
                            <th className="px-6 py-4">Contact Phone</th>
                            <th className="px-6 py-4">Subscription Plan</th>
                            <th className="px-6 py-4">Pending Amount</th>
                            <th className="px-6 py-4">Date Generated</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredPayments.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-16 text-slate-400">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="p-4 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100/80">
                                            <CheckCircle2 size={36} />
                                        </div>
                                        <div>
                                            <p className="text-slate-700 font-bold text-base">All Fees Settled</p>
                                            <p className="text-xs text-slate-400 mt-1">There are no outstanding dues from active or expired student accounts.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredPayments.map((payment) => (
                                <tr key={payment._id} className="table-row">
                                    {/* Student details */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500 shadow-sm">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <h2 className="font-bold text-slate-900 text-sm">
                                                    {payment.student?.fullName || "Deleted Student"}
                                                </h2>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {payment.student?.email || "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Phone */}
                                    <td className="table-cell font-medium">
                                        {payment.student?.phone || "—"}
                                    </td>

                                    {/* Plan Name */}
                                    <td className="table-cell">
                                        <span className="font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg text-xs border border-indigo-100">
                                            {payment.plan?.name || "N/A"}
                                        </span>
                                    </td>

                                    {/* Pending Amount */}
                                    <td className="table-cell text-slate-900 font-extrabold text-sm">
                                        ₹{payment.amount}
                                    </td>

                                    {/* Date Generated */}
                                    <td className="table-cell font-medium text-slate-400 text-xs">
                                        {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => setCollectingPayment(payment)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition active:scale-[0.98]"
                                        >
                                            <UserCheck size={14} />
                                            Collect Fee
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Collect Fee Modal */}
            {collectingPayment && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-fade-up">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white relative">
                            <button
                                onClick={() => setCollectingPayment(null)}
                                className="absolute top-4 right-4 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
                            >
                                <X size={16} />
                            </button>
                            <h2 className="text-xl font-bold flex items-center gap-2.5">
                                <DollarSign size={20} className="text-indigo-300" />
                                Record Collection
                            </h2>
                            <p className="text-xs text-indigo-200 mt-1">
                                Settle dues for student: <span className="font-semibold text-white">{collectingPayment.student?.fullName}</span>
                            </p>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleCollectSubmit} className="p-6 space-y-6">
                            {/* Stats */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Amount Due</p>
                                    <p className="text-2xl font-extrabold text-slate-800">₹{collectingPayment.amount}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 text-right">Plan Name</p>
                                    <p className="text-sm font-semibold text-slate-700 text-right">{collectingPayment.plan?.name}</p>
                                </div>
                            </div>

                            {/* Payment Method Select */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                                    Payment Method
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("cash")}
                                        className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-bold transition ${
                                            paymentMethod === "cash"
                                                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        <DollarSign size={16} />
                                        Cash
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("upi")}
                                        className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-bold transition ${
                                            paymentMethod === "upi"
                                                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        <CreditCard size={16} />
                                        UPI
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCollectingPayment(null)}
                                    className="flex-1 px-4 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/10 transition"
                                >
                                    Confirm Collection
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingFees;
