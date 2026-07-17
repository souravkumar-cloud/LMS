import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { 
    Library, 
    Clock, 
    MapPin, 
    Armchair, 
    Save, 
    Compass,
    Sparkles
} from "lucide-react";

import Loader from "../../components/common/Loader";
import api from "../../services/api";

const defaultSettings = {
    libraryName: "",
    address: "",
    openingTime: "08:00",
    closingTime: "22:00",
    gpsRadius: 50,
    latitude: 0,
    longitude: 0,
    attendanceGraceMinutes: 15,
    maxSeatChangeRequestsPerMonth: 5,
    allowGPSAttendance: true,
    allowQRAttendance: false,
    allowSeatChange: true,
    allowHourlySeat: true,
    premiumExtraCharge: 500
};

const LibrarySettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState(defaultSettings);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await api.get("/library-settings");
            if (res.data.settings) {
                setSettings({
                    ...defaultSettings,
                    ...res.data.settings,
                    allowQRAttendance: false, // QR is now removed
                    allowGPSAttendance: true
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to load settings.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        toast.promise(
            new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setSettings(prev => ({
                            ...prev,
                            latitude: Number(position.coords.latitude.toFixed(6)),
                            longitude: Number(position.coords.longitude.toFixed(6))
                        }));
                        resolve();
                    },
                    (err) => reject(err),
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            }),
            {
                loading: "Detecting current coordinates...",
                success: "Coordinates updated successfully!",
                error: (err) => `Failed to get location: ${err.message || "Permission denied"}`
            }
        );
    };

    const saveSettings = async (e) => {
        e.preventDefault();

        if (!settings.libraryName.trim()) {
            toast.error("Library Name is required");
            return;
        }

        const dataToSave = {
            ...settings,
            gpsRadius: Number(settings.gpsRadius) || 0,
            latitude: Number(settings.latitude) || 0,
            longitude: Number(settings.longitude) || 0,
            attendanceGraceMinutes: Number(settings.attendanceGraceMinutes) || 0,
            maxSeatChangeRequestsPerMonth: Number(settings.maxSeatChangeRequestsPerMonth) || 0,
            premiumExtraCharge: Number(settings.premiumExtraCharge) || 0,
            allowQRAttendance: false,
            allowGPSAttendance: true
        };

        try {
            setSaving(true);
            await api.put("/library-settings", dataToSave);
            toast.success("Settings updated successfully");
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                "Unable to update settings"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loader text="Loading Settings..." />;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-400/20 mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        Admin Controls
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                        Library settings
                    </h1>
                    <p className="text-slate-300 mt-1 text-sm max-w-xl">
                        Manage your library profile, hours of operation, precise GPS coordinates, and seat booking limits from this panel.
                    </p>
                </div>
            </div>

            <form onSubmit={saveSettings} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Section 1: General Settings */}
                    <SectionCard 
                        icon={<Library className="w-5 h-5 text-blue-600" />} 
                        title="Library Profile"
                    >
                        <InputField
                            label="Library Name"
                            name="libraryName"
                            value={settings.libraryName}
                            onChange={handleChange}
                            placeholder="e.g. Central City Library"
                        />
                        <InputField
                            label="Physical Address"
                            name="address"
                            value={settings.address}
                            onChange={handleChange}
                            placeholder="Street, District, State"
                        />
                    </SectionCard>

                    {/* Section 2: Hours & Grace Period */}
                    <SectionCard 
                        icon={<Clock className="w-5 h-5 text-indigo-600" />} 
                        title="Operating Hours"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Opening Time"
                                type="time"
                                name="openingTime"
                                value={settings.openingTime}
                                onChange={handleChange}
                            />
                            <InputField
                                label="Closing Time"
                                type="time"
                                name="closingTime"
                                value={settings.closingTime}
                                onChange={handleChange}
                            />
                        </div>
                        <InputField
                            label="Attendance Grace Period (Minutes)"
                            type="number"
                            name="attendanceGraceMinutes"
                            min="0"
                            value={settings.attendanceGraceMinutes}
                            onChange={handleChange}
                            subtext="Buffer time allowed for students to check-in late"
                        />
                    </SectionCard>

                    {/* Section 3: GPS Geofencing Settings */}
                    <SectionCard 
                        icon={<MapPin className="w-5 h-5 text-emerald-600" />} 
                        title="Location & GPS Geofencing"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Latitude"
                                type="number"
                                step="any"
                                name="latitude"
                                value={settings.latitude}
                                onChange={handleChange}
                                placeholder="e.g. 28.744425"
                            />
                            <InputField
                                label="Longitude"
                                type="number"
                                step="any"
                                name="longitude"
                                value={settings.longitude}
                                onChange={handleChange}
                                placeholder="e.g. 77.181455"
                            />
                        </div>
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <InputField
                                    label="Allowed Radius (Meters)"
                                    type="number"
                                    name="gpsRadius"
                                    min="1"
                                    value={settings.gpsRadius}
                                    onChange={handleChange}
                                    subtext="Maximum distance allowed for marking attendance"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleGetLocation}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-50 hover:text-slate-900 h-[46px]"
                            >
                                <Compass className="w-4 h-4 text-slate-500 animate-spin-slow" />
                                Detect Location
                            </button>
                        </div>
                    </SectionCard>

                    {/* Section 4: Policies & Fees */}
                    <SectionCard 
                        icon={<Armchair className="w-5 h-5 text-amber-600" />} 
                        title="Booking Policies"
                    >
                        <ToggleSwitch
                            label="Allow Seat Change Requests"
                            description="Allows students to apply for seat reallocations"
                            name="allowSeatChange"
                            checked={settings.allowSeatChange}
                            onChange={handleChange}
                        />
                        <ToggleSwitch
                            label="Allow Hourly Booking"
                            description="Allows booking on an hourly base system"
                            name="allowHourlySeat"
                            checked={settings.allowHourlySeat}
                            onChange={handleChange}
                        />
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <InputField
                                label="Max Seat Changes / Month"
                                type="number"
                                name="maxSeatChangeRequestsPerMonth"
                                min="0"
                                value={settings.maxSeatChangeRequestsPerMonth}
                                onChange={handleChange}
                            />
                            <InputField
                                label="Premium Extra Charge ($)"
                                type="number"
                                name="premiumExtraCharge"
                                min="0"
                                value={settings.premiumExtraCharge}
                                onChange={handleChange}
                            />
                        </div>
                    </SectionCard>

                </div>

                {/* Form Actions */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="primary-button inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/35 active:translate-y-0 disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4.5 h-4.5" />
                                Save Settings
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

const SectionCard = ({ icon, title, children }) => (
    <div className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100/80 bg-white/95">
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-slate-50 flex items-center justify-center">
                {icon}
            </div>
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        </div>
        <div className="space-y-5">
            {children}
        </div>
    </div>
);

const InputField = ({ label, icon, subtext, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            {icon && <span className="text-slate-400">{icon}</span>}
            {label}
        </label>
        <input
            {...props}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
        {subtext && <p className="text-[11px] text-slate-400 font-medium">{subtext}</p>}
    </div>
);

const ToggleSwitch = ({ label, description, name, checked, onChange }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
        <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            {description && <span className="text-xs text-slate-400 font-medium">{description}</span>}
        </div>
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange({ target: { name, type: "checkbox", checked: !checked } })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                checked ? "bg-blue-600" : "bg-slate-200"
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    checked ? "translate-x-6" : "translate-x-1"
                }`}
            />
        </button>
    </div>
);

export default LibrarySettings;
