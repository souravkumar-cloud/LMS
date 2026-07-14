import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import api from "../../services/api";

const defaultSettings = {

    libraryName: "",

    openingTime: "08:00",

    closingTime: "22:00",

    maxDistance: 30,

    attendanceMethod: "gps",

    qrExpiryMinutes: 5,

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

                    ...res.data.settings

                });

            }

        }

        catch (error) {

            console.log(error);

            toast.error("Unable to load settings.");

        }

        finally {

            setLoading(false);

        }

    };

    const handleChange = (e) => {

        const { name, value, checked, type } = e.target;

        setSettings((prev) => ({

            ...prev,

            [name]:

                type === "checkbox"

                    ? checked

                    : value

        }));

    };

    const saveSettings = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            await api.put(

                "/library-settings",

                settings

            );

            toast.success("Settings Updated");

        }

        catch (error) {

            console.log(error);

            toast.error(

                error.response?.data?.message ||

                "Unable to update settings"

            );

        }

        finally {

            setSaving(false);

        }

    };

    if (loading) {

        return <Loader text="Loading Settings..." />;

    }

    return (

        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">

            <h1 className="text-3xl font-bold mb-8">

                Library Settings

            </h1>

            <form
                onSubmit={saveSettings}
                className="space-y-8"
            >

                <div className="grid md:grid-cols-2 gap-6">

                    <Input
                        label="Library Name"
                        name="libraryName"
                        value={settings.libraryName}
                        onChange={handleChange}
                    />

                    <Input
                        label="Maximum GPS Radius (Meters)"
                        type="number"
                        name="maxDistance"
                        value={settings.maxDistance}
                        onChange={handleChange}
                    />

                    <Input
                        label="Opening Time"
                        type="time"
                        name="openingTime"
                        value={settings.openingTime}
                        onChange={handleChange}
                    />

                    <Input
                        label="Closing Time"
                        type="time"
                        name="closingTime"
                        value={settings.closingTime}
                        onChange={handleChange}
                    />

                    <Input
                        label="QR Expiry (Minutes)"
                        type="number"
                        name="qrExpiryMinutes"
                        value={settings.qrExpiryMinutes}
                        onChange={handleChange}
                    />

                    <Input
                        label="Premium Extra Charge"
                        type="number"
                        name="premiumExtraCharge"
                        value={settings.premiumExtraCharge}
                        onChange={handleChange}
                    />

                </div>

                <div>

                    <label className="block mb-2 font-medium">

                        Attendance Method

                    </label>

                    <select

                        name="attendanceMethod"

                        value={settings.attendanceMethod}

                        onChange={handleChange}

                        className="w-full border rounded-lg px-4 py-3"

                    >

                        <option value="gps">

                            GPS Only

                        </option>

                        <option value="qr">

                            QR Only

                        </option>

                        <option value="both">

                            GPS + QR

                        </option>

                    </select>

                </div>

                <div className="space-y-4">

                    <Checkbox
                        label="Allow Seat Change Requests"
                        name="allowSeatChange"
                        checked={settings.allowSeatChange}
                        onChange={handleChange}
                    />

                    <Checkbox
                        label="Allow Hourly Seat Booking"
                        name="allowHourlySeat"
                        checked={settings.allowHourlySeat}
                        onChange={handleChange}
                    />

                </div>

                <button

                    disabled={saving}

                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"

                >

                    {

                        saving

                            ? "Saving..."

                            : "Save Settings"

                    }

                </button>

            </form>

        </div>

    );

};

const Input = ({ label, ...props }) => (

    <div>

        <label className="block mb-2 font-medium">

            {label}

        </label>

        <input

            {...props}

            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"

        />

    </div>

);

const Checkbox = ({ label, ...props }) => (

    <label className="flex items-center gap-3">

        <input

            type="checkbox"

            {...props}

        />

        <span>{label}</span>

    </label>

);

export default LibrarySettings;