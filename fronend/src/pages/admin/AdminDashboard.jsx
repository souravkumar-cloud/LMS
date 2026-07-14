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
import { Bell, Send, Megaphone } from "lucide-react";
import notificationService from "../../services/notificationService";
import studentService from "../../services/studentService";
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
        <div className="space-y-8">
            {/* Heading */}
            <div>
                <h1 className="text-3xl font-bold">
                    Admin Dashboard
                </h1>
                <p className="text-gray-500">
                    Welcome back 👋
                </p>
            </div>
             {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <Card
                    title="Students"
                    value={dashboard.dashboard.activeStudents}
                    color="bg-blue-500"
                    icon={<Users size={30} />}
                />
                <Card
                    title="Occupied Seats"
                    value={`${dashboard.dashboard.occupiedSeats}/${dashboard.dashboard.totalSeats}`}
                    color="bg-green-500"
                    icon={<Armchair size={30} />}
                />
                <Card
                    title="Today's Attendance"
                    value={dashboard.dashboard.todayAttendance}
                    color="bg-yellow-500"
                    icon={<ClipboardCheck size={30} />}
                />
                <Card
                    title="Revenue"
                    value={`₹${dashboard.dashboard.todayRevenue}`}
                    color="bg-red-500"
                    icon={<IndianRupee size={30} />}
                />

            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Bell className="text-blue-600" />
                    <h2 className="text-2xl font-bold">
                        Quick Notifications
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label className="font-medium">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={notification.title}
                            onChange={handleChange}
                            placeholder="Enter title"
                            className="w-full mt-2 border rounded-lg p-3"
                        />
                    </div>
                    <div>
                        <label className="font-medium">
                            Student
                        </label>
                        <select
                            name="recipient"
                            value={notification.recipient}
                            onChange={handleChange}
                            className="w-full mt-2 border rounded-lg p-3"
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
                <div>
                    <label className="font-medium">
                        Priority
                    </label>
                    <select
                        name="priority"
                        value={notification.priority}
                        onChange={handleChange}
                        className="w-full mt-2 border rounded-lg p-3"
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
                <div className="mt-5">
                    <label className="font-medium">
                        Message
                    </label>
                    <textarea
                        rows="4"
                        name="message"
                        value={notification.message}
                        onChange={handleChange}
                        placeholder="Enter notification message"
                        className="w-full mt-2 border rounded-lg p-3"
                    />
                </div>
                <div className="flex gap-4 mt-6">

                        {
                            notification.recipient === "all" ? (

                                <button
                                    onClick={broadcastNotification}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                                >
                                    <Megaphone size={18} />
                                    Broadcast
                                </button>

                            ) : (

                                <button
                                    onClick={sendNotification}
                                    disabled={!notification.recipient}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                                >
                                    <Send size={18} />
                                    Send Notification
                                </button>

                            )
                        }

                    </div>

            </div>
           
            {/* Charts */}
{/* 
            <div className="grid lg:grid-cols-2 gap-6">

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="font-semibold text-xl mb-6">

                        Seat Occupancy

                    </h2>

                    <ResponsiveContainer

                        width="100%"

                        height={300}

                    >

                        <PieChart>

                            <Pie

                                data={chartData}

                                dataKey="value"

                                outerRadius={100}

                            >

                                {

                                    chartData.map((entry, index) => (

                                        <Cell

                                            key={index}

                                            fill={COLORS[index]}

                                        />

                                    ))

                                }

                            </Pie>

                            <Tooltip />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="font-semibold text-xl mb-4">

                        Quick Summary

                    </h2>

                    <div className="space-y-4">

                        <Summary

                            label="Pending Seat Requests"

                            value={dashboard.pendingRequests}

                        />

                        <Summary

                            label="Active Subscriptions"

                            value={dashboard.activeSubscriptions}

                        />

                        <Summary

                            label="Today's Payments"

                            value={dashboard.todayPayments}

                        />

                        <Summary

                            label="Available Seats"

                            value={dashboard.availableSeats}

                        />

                    </div>

                </div>

            </div> */}

        </div>

    );

};

const Card = ({

    title,

    value,

    icon,

    color

}) => {

    return (

        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">

            <div>

                <p className="text-gray-500">

                    {title}

                </p>

                <h2 className="text-3xl font-bold mt-2">

                    {value}

                </h2>

            </div>

            <div

                className={`${color} text-white p-4 rounded-xl`}

            >

                {icon}

            </div>

        </div>

    );

};

const Summary = ({

    label,

    value

}) => (

    <div className="flex justify-between border-b pb-3">

        <span>

            {label}

        </span>

        <span className="font-semibold">

            {value}

        </span>

    </div>

);

export default AdminDashboard;