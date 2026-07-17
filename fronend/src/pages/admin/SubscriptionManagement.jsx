import { useEffect, useState } from "react";
import {
    Crown,
    Pencil,
    Trash2,
    Clock,
    IndianRupee,
    Tag,
    Layers,
    Info,
    X,
    Sparkles
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import subscriptionService from "../../services/subscriptionService";

const SubscriptionManagement = () => {
    const [loading, setLoading] = useState(true);
    const [plans, setPlans] = useState([]);
    const [editingPlanId, setEditingPlanId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        category: "regular",
        accessType: "full-day",
        durationInDays: 30,
        hoursPerDay: 14,
        price: ""
    });

    const fetchPlans = async () => {
        try {
            const res = await subscriptionService.getPlans();
            setPlans(res.plans || []);
        } catch {
            toast.error("Unable to load plans.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData = {
            ...formData,
            [name]: value
        };

        if (name === "category") {
            if (value === "not fixed") {
                newFormData.accessType = "hourly";
            } else {
                newFormData.accessType = "full-day";
                newFormData.hoursPerDay = 14; 
            }
        }

        setFormData(newFormData);
    };

    const handleReset = () => {
        setFormData({
            name: "",
            category: "regular",
            accessType: "full-day",
            durationInDays: 30,
            hoursPerDay: 14,
            price: ""
        });
        setEditingPlanId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Plan Name is required");
            return;
        }

        const dataToSave = {
            ...formData,
            durationInDays: Number(formData.durationInDays) || 30,
            hoursPerDay: Number(formData.hoursPerDay) || 14,
            price: Number(formData.price) || 0
        };

        try {
            if (editingPlanId) {
                await subscriptionService.updatePlan(editingPlanId, dataToSave);
                toast.success("Plan updated successfully");
            } else {
                await subscriptionService.createPlan(dataToSave);
                toast.success("Plan created successfully");
            }
            fetchPlans();
            handleReset();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to process plan request.");
        }
    };

    const deletePlan = async (id) => {
        if (!window.confirm("Are you sure you want to delete this subscription plan?")) return;

        try {
            await subscriptionService.deletePlan(id);
            toast.success("Plan deleted successfully");
            fetchPlans();
        } catch {
            toast.error("Unable to delete subscription plan.");
        }
    };

    const startEdit = (plan) => {
        setEditingPlanId(plan._id);
        setFormData({
            name: plan.name,
            category: plan.category,
            accessType: plan.accessType,
            durationInDays: plan.durationInDays || 30,
            hoursPerDay: plan.hoursPerDay || 14,
            price: plan.price
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return <Loader text="Loading Plans..." />;
    }

    const getCategoryDescription = () => {
        switch (formData.category) {
            case "premium":
                return "Premium Tier: Full-day access with premium seat assignments and extra amenities.";
            case "not fixed":
                return "Hourly Tier: Flexible hourly access, no dedicated seat assignment required.";
            case "regular":
            default:
                return "Regular Tier: Full-day access with dedicated seat assignment.";
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-up font-['Outfit',sans-serif]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 text-indigo-300 rounded-2xl border border-indigo-400/20 shadow-inner">
                        <Crown size={32} />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-400/20 mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            Plan Manager
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white">
                            Subscription Plans
                        </h1>
                        <p className="text-slate-300 mt-1 text-sm max-w-xl">
                            Manage admission packages, seat categories, and hourly access pricing models.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                
                {/* Form Card */}
                <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-100/80 bg-white/95 shadow-xl shadow-slate-100/30">
                    <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                {editingPlanId ? "Edit Plan Specs" : "Create Plan"}
                            </h2>
                            <p className="text-slate-400 text-xs mt-0.5">
                                Set pricing tiers and limits.
                            </p>
                        </div>
                        {editingPlanId && (
                            <button
                                onClick={handleReset}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
                                title="Cancel Edit"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Info Tier */}
                        <div className="flex items-start gap-2.5 bg-blue-50/50 rounded-xl p-3 border border-blue-100/60">
                            <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
                            <span className="text-xs font-medium text-slate-600 leading-normal">
                                {getCategoryDescription()}
                            </span>
                        </div>

                        {/* Input Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Name */}
                            <InputField
                                label="Plan Name"
                                name="name"
                                placeholder="e.g. Monthly Regular"
                                value={formData.name}
                                onChange={handleChange}
                                icon={<Tag className="w-4 h-4" />}
                                required
                            />

                            {/* Category */}
                            <SelectField
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                icon={<Layers className="w-4 h-4" />}
                            >
                                <option value="regular">Regular (Seat required)</option>
                                <option value="premium">Premium (Seat required)</option>
                                <option value="not fixed">Hourly (No seat required)</option>
                            </SelectField>

                            {/* Access Type */}
                            <SelectField
                                label="Access Mode"
                                name="accessType"
                                value={formData.accessType}
                                icon={<Clock className="w-4 h-4" />}
                                disabled
                                subtext="Determined by category selection"
                            >
                                <option value="full-day">Full Day</option>
                                <option value="hourly">Hourly</option>
                            </SelectField>

                            {/* Daily Facility Hours */}
                            <InputField
                                label="Daily Facility Hours"
                                type="number"
                                name="hoursPerDay"
                                min="1"
                                max="24"
                                placeholder="Hours per day"
                                value={formData.hoursPerDay}
                                onChange={handleChange}
                                disabled={formData.category !== "not fixed"}
                                icon={<Clock className="w-4 h-4" />}
                                subtext="Only editable for Hourly packages"
                            />

                            {/* Price */}
                            <InputField
                                label="Price (INR)"
                                type="number"
                                name="price"
                                min="0"
                                placeholder="Price in ₹"
                                value={formData.price}
                                onChange={handleChange}
                                icon={<IndianRupee className="w-4 h-4" />}
                                required
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            {editingPlanId && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="secondary-button px-6 py-2.5 text-xs font-bold rounded-xl"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                className="primary-button px-6 py-2.5 text-xs font-bold rounded-xl"
                            >
                                {editingPlanId ? "Update Plan" : "Create Plan"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table container */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/40 border border-slate-100/80 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/40">
                        <h2 className="text-lg font-bold text-slate-800">Active Admission Plans</h2>
                        <p className="text-slate-400 text-xs mt-0.5">Overview of registered subscription tiers.</p>
                    </div>
                    <div className="table-container">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead>
                                <tr className="table-header">
                                    <th className="py-4 px-6 text-left">Plan Name</th>
                                    <th className="py-4 px-6 text-center">Category</th>
                                    <th className="py-4 px-6 text-center">Access Mode</th>
                                    <th className="py-4 px-6 text-center">Hours</th>
                                    <th className="py-4 px-6 text-right">Pricing</th>
                                    <th className="py-4 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-medium">
                                {plans.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12 text-slate-400">
                                            No subscription plans have been created yet.
                                        </td>
                                    </tr>
                                ) : (
                                    plans.map((plan) => (
                                        <tr key={plan._id} className="table-row">
                                            <td className="py-4 px-6 font-bold text-slate-900">{plan.name}</td>
                                            <td className="py-4 px-6 text-center">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border capitalize ${
                                                    plan.category === "premium"
                                                        ? "bg-purple-50 text-purple-700 border-purple-100"
                                                        : plan.category === "not fixed"
                                                        ? "bg-amber-50 text-amber-700 border-amber-100"
                                                        : "bg-blue-50 text-blue-700 border-blue-100"
                                                }`}>
                                                    {plan.category === "not fixed" ? "Hourly" : plan.category}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center capitalize text-slate-500">{plan.accessType}</td>
                                            <td className="py-4 px-6 text-center text-slate-500">
                                                {plan.category === "not fixed" ? `${plan.hoursPerDay} hrs/day` : "Unlimited"}
                                            </td>
                                            <td className="py-4 px-6 text-right text-slate-900 font-extrabold text-base">₹{plan.price}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => startEdit(plan)}
                                                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-xl transition cursor-pointer active:scale-95 flex items-center justify-center border border-blue-100"
                                                        title="Edit Plan"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deletePlan(plan._id)}
                                                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition cursor-pointer active:scale-95 flex items-center justify-center border border-red-100"
                                                        title="Delete Plan"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

const InputField = ({ label, icon, subtext, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            {label}
        </label>
        <div className="relative flex items-center">
            {icon && <span className="absolute left-3.5 text-slate-400">{icon}</span>}
            <input
                {...props}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/40 py-2.5 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 ${
                    icon ? "pl-11 pr-4" : "px-4"
                } ${props.disabled ? "bg-slate-100/60 text-slate-400 cursor-not-allowed border-slate-200" : ""}`}
            />
        </div>
        {subtext && <p className="text-[11px] text-slate-400 font-medium">{subtext}</p>}
    </div>
);

const SelectField = ({ label, icon, subtext, children, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            {label}
        </label>
        <div className="relative flex items-center">
            {icon && <span className="absolute left-3.5 text-slate-400">{icon}</span>}
            <select
                {...props}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/40 py-2.5 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 cursor-pointer ${
                    icon ? "pl-11 pr-4" : "px-4"
                } ${props.disabled ? "bg-slate-100/60 text-slate-400 cursor-not-allowed border-slate-200" : ""}`}
            >
                {children}
            </select>
        </div>
        {subtext && <p className="text-[11px] text-slate-400 font-medium">{subtext}</p>}
    </div>
);

export default SubscriptionManagement;