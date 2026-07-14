import React, { useEffect, useState, useMemo } from "react";
import {
    Armchair,
    CreditCard,
    Calendar,
    Bell,
    Clock,
    CheckCircle,
    Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import Loader from "../../components/common/Loader";
import api from "../../services/api";
import toast from "react-hot-toast";

const StudentDashboard = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState(null);
    const [marking, setMarking] = useState(false);

    

    // const startDate = new Date(
    //     new Date().getFullYear(),
    //     new Date().getMonth(),
    //     1
    // );

    // const endDate = new Date(
    //     new Date().getFullYear(),
    //     new Date().getMonth() + 1,
    //     0
    // );

    // Date range: last 12 months, like LeetCode's yearly view
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
            console.log(res.data.dashboard)
            setDashboard(res.data.dashboard);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

  const markAttendance = async () => {

    if (dashboard?.attendance || marking) return;

    if (!navigator.geolocation) {

        toast.error("Geolocation is not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            try {

                setMarking(true);

                await api.post("/attendance/entry", {

                    verificationMethod: "gps",

                    latitude: position.coords.latitude,

                    longitude: position.coords.longitude

                });

                toast.success("Attendance Marked");

                fetchDashboard();

            } catch (error) {

                console.log(error.response?.data);

                toast.error(

                    error.response?.data?.message ||

                    "Unable to mark attendance"

                );

            } finally {

                setMarking(false);

            }

        },

        () => {

            toast.error("Please enable location.");

        }

    );

};

const markExit = async () => {

    try {

        setMarking(true);

        await api.post("/attendance/exit");

        toast.success("Exit marked successfully");

        fetchDashboard();

    }

    catch (error) {

        console.log(error.response?.data);

        toast.error(
            error.response?.data?.message ||
            "Unable to mark exit"
        );

    }

    finally {

        setMarking(false);

    }

};

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return <Loader text="Loading Dashboard..." />;
    }

    // console.log("this is histroy",dashboard?.attendanceHistory)
    if (!dashboard) {
        return (
            <div className="text-center py-16 text-gray-500">
                Couldn't load your dashboard. Please refresh the page.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <style>{`
    .attendance-heatmap-wrap {
        width: 100%;
        overflow-x: auto;
    }
    .attendance-heatmap-wrap .react-calendar-heatmap {
        width: max-content;
        min-width: 100%;
    }
    /* Override any global svg reset (max-width:100%/height:auto/width:100%)
       that forces this SVG to stretch beyond its intrinsic viewBox size */
    .attendance-heatmap-wrap svg {
        width: auto !important;
        height: auto !important;
        max-width: none !important;
        display: block;
    }
    .attendance-heatmap-wrap .react-calendar-heatmap text {
        font-size: 9px;
        fill: #9ca3af;
    }
    .attendance-heatmap-wrap .react-calendar-heatmap rect {
        rx: 2px;
        ry: 2px;
    }
    .attendance-heatmap-wrap .react-calendar-heatmap .color-empty {
        fill: #ebedf0;
    }
    .attendance-heatmap-wrap .react-calendar-heatmap .color-present {
        fill: #16a34a;
    }
    .attendance-heatmap-wrap .react-calendar-heatmap .color-absent {
        fill: #dc2626;
    }
    .attendance-heatmap-wrap .react-calendar-heatmap rect:hover {
        stroke: #111827;
        stroke-width: 1px;
        cursor: pointer;
    }
`}</style>


            {/* Welcome */}
            <div>
                <h1 className="text-3xl font-bold">
                    Welcome,
                    <span className="text-blue-600"> {dashboard?.user?.fullName || "Student"}</span>
                </h1>
                <p className="text-gray-500 mt-2">
                    Here's a quick overview of your library account.
                </p>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-3 mb-5">
                    <Bell className="text-blue-600" />
                    <h2 className="text-xl font-semibold">Latest Notifications</h2>
                </div>
                {dashboard?.notifications?.length === 0 ? (
                    <p className="text-gray-500">No notifications.</p>
                ) : (
                    dashboard.notifications.map((item) => (
                        <div key={item._id} className="border-b py-4 last:border-b-0">
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-gray-500 mt-1">{item.message}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Attendance heatmap */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Attendance Activity</h2>
                        <p className="text-gray-500">Your daily attendance this month</p>
                    </div>
                    <div className="flex justify-between gap-2">
                        <button
                            onClick={markAttendance}
                            disabled={marking || !!dashboard?.attendance}
                            className={`px-5 py-2 rounded-lg text-white flex items-center gap-2 transition ${
                                dashboard?.attendance
                                    ? "bg-green-600 cursor-not-allowed"
                                    : marking
                                    ? "bg-blue-400 cursor-wait"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {marking && <Loader2 size={16} className="animate-spin" />}
                            {dashboard?.attendance
                                ? "Attendance Marked"
                                : marking
                                ? "Marking..."
                                : "Mark Attendance"}
                        </button>

                        <button
                            onClick={markExit}
                            disabled={
                                marking ||
                                !dashboard?.todayAttendance ||
                                dashboard?.todayAttendance?.exitTime
                            }
                            className={`px-5 py-2 rounded-lg text-white flex items-center gap-2 transition ${
                                dashboard?.todayAttendance?.exitTime
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : marking
                                    ? "bg-red-400 cursor-wait"
                                    : "bg-red-600 hover:bg-red-700"
                            }`}
                        >
                            {marking && (
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />
                            )}

                            {
                                dashboard?.todayAttendance?.exitTime

                                    ? "Exit Marked"

                                    : marking

                                    ? "Marking..."

                                    : "Mark Exit"
                            }

                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto border rounded-xl p-4 bg-gray-50">
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
                if (value.status === "present" || value.status==="inside" || value.status==="completed" || value.status==="present") return "color-present";
                return "color-absent";
            }}
            transformDayElement={(rect, value, index) => {
                const label = value?.date
                    ? `${value.date}: ${value.status === "absent"  ? "Absent":"Present"}`
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
                <div className="flex justify-between items-center mt-4">
                    <p className="text-gray-500 text-sm">
                        Total Present:
                        <span className="font-bold text-green-600 ml-2">
                            {dashboard?.attendanceHistory?.filter(
                                (a) => a.status === "present" || a.status==="completed"
                            ).length || 0}
                        </span>
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-sm" style={{ background: "#16a34a" }}></div>
                            Present
                        </div>
                        {/* <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-sm" style={{ background: "#dc2626" }}></div>
                            Absent
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                <DashboardCard
                    icon={<Armchair size={28} />}
                    title="Seat"
                    value={dashboard.seat ? dashboard.seat.seatNumber : "Not Assigned"}
                    color="text-blue-600"
                />
                <DashboardCard
                    icon={<CreditCard size={28} />}
                    title="Subscription"
                    value={dashboard.subscription ? dashboard.subscription.plan.name : "-"}
                    color="text-green-600"
                />
                <DashboardCard
                    icon={<Calendar size={28} />}
                    title="Expiry"
                    value={
                        dashboard.subscription
                            ? new Date(dashboard.subscription.endDate).toLocaleDateString()
                            : "-"
                    }
                    color="text-yellow-600"
                />
                <DashboardCard
                    icon={<Clock size={28} />}
                    title="Today's Status"
                    value={dashboard.todayAttendance ? "Present" : "Absent"}
                    color="text-purple-600"
                />
            </div>

            {/* Seat & Attendance details */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-5">Seat Information</h2>
                    {dashboard.seat ? (
                        <div className="space-y-4">
                            <Row label="Seat Number" value={dashboard.seat.seatNumber} />
                            <Row label="Floor" value={dashboard.seat.floor} />
                            <Row label="Category" value={dashboard.seat.category} />
                            <Row label="Access" value={dashboard.seat.accessType} />
                        </div>
                    ) : (
                        <p>No seat allotted.</p>
                    )}
                </div> */}
                {/* <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-5">Today's Attendance</h2>
                    {dashboard.todayAttendance ? (
                        <div className="space-y-4">
                            <Row
                                label="Entry"
                                value={
                                    dashboard.todayAttendance.entryTime
                                        ? new Date(
                                              dashboard.todayAttendance.entryTime
                                          ).toLocaleTimeString()
                                        : "-"
                                }
                            />
                            <Row
                                label="Exit"
                                value={
                                    dashboard.todayAttendance.exitTime
                                        ? new Date(
                                              dashboard.todayAttendance.exitTime
                                          ).toLocaleTimeString()
                                        : "-"
                                }
                            />
                            <Row label="Status" value="Present" />
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <CheckCircle size={50} className="mx-auto text-gray-400" />
                            <p className="mt-4 text-gray-500">
                                Attendance not marked today.
                            </p>
                        </div>
                    )}
                </div> */}
            </div>
        </div>
    );
};

const DashboardCard = ({ icon, title, value, color }) => (
    <div className="bg-white rounded-xl shadow p-6">
        <div className={color}>{icon}</div>
        <p className="mt-4 text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
);

const Row = ({ label, value }) => (
    <div className="flex justify-between border-b pb-3">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold">{value}</span>
    </div>
);

export default StudentDashboard;