import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from "recharts";

import Loader from "../../components/common/Loader";
import api from "../../services/api";

const COLORS = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#ca8a04"
];

const Analytics = () => {

    const [loading, setLoading] = useState(true);

    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {

        fetchAnalytics();

    }, []);

    const fetchAnalytics = async () => {

        try {

            const res = await api.get(

                "/dashboard/admin"

            );

            setAnalytics(res.data);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <Loader text="Loading Analytics..." />;

    }

    const seatData = [

        {

            name: "Occupied",

            value: analytics.totalOccupiedSeats

        },

        {

            name: "Available",

            value: analytics.totalAvailableSeats

        }

    ];

    const subscriptionData = [

        {

            name: "Regular",

            value: analytics.regularPlan

        },

        {

            name: "Premium",

            value: analytics.premiumPlan

        },

        {

            name: "Hourly",

            value: analytics.hourlyPlan

        }

    ];

    const monthlyRevenue = analytics.monthlyRevenue || [];

    return (

        <div className="space-y-8">

            <div>

                <h1 className="text-3xl font-bold">

                    Analytics Dashboard

                </h1>

                <p className="text-gray-500">

                    Overview of library performance

                </p>

            </div>

            {/* Summary Cards */}

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                <Card

                    title="Students"

                    value={analytics.totalStudents}

                />

                <Card

                    title="Revenue"

                    value={`₹ ${analytics.totalRevenue}`}

                />

                <Card

                    title="Attendance Today"

                    value={analytics.todayAttendance}

                />

                <Card

                    title="Active Seats"

                    value={analytics.totalOccupiedSeats}

                />

            </div>

            {/* Charts */}

            <div className="grid lg:grid-cols-2 gap-6">

                {/* Seat Chart */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-bold mb-5">

                        Seat Occupancy

                    </h2>

                    <ResponsiveContainer

                        width="100%"

                        height={320}

                    >

                        <PieChart>

                            <Pie

                                data={seatData}

                                dataKey="value"

                                outerRadius={110}

                            >

                                {

                                    seatData.map(

                                        (_, index) => (

                                            <Cell

                                                key={index}

                                                fill={

                                                    COLORS[index]

                                                }

                                            />

                                        )

                                    )

                                }

                            </Pie>

                            <Tooltip/>

                            <Legend/>

                        </PieChart>

                    </ResponsiveContainer>

                </div>

                {/* Subscription */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-bold mb-5">

                        Subscription Distribution

                    </h2>

                    <ResponsiveContainer

                        width="100%"

                        height={320}

                    >

                        <PieChart>

                            <Pie

                                data={subscriptionData}

                                dataKey="value"

                                outerRadius={110}

                            >

                                {

                                    subscriptionData.map(

                                        (_, index) => (

                                            <Cell

                                                key={index}

                                                fill={

                                                    COLORS[index]

                                                }

                                            />

                                        )

                                    )

                                }

                            </Pie>

                            <Tooltip/>

                            <Legend/>

                        </PieChart>

                    </ResponsiveContainer>

                </div>

            </div>

            {/* Revenue */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-bold mb-5">

                    Monthly Revenue

                </h2>

                <ResponsiveContainer

                    width="100%"

                    height={350}

                >

                    <BarChart

                        data={monthlyRevenue}

                    >

                        <CartesianGrid strokeDasharray="3 3"/>

                        <XAxis dataKey="month"/>

                        <YAxis/>

                        <Tooltip/>

                        <Legend/>

                        <Bar

                            dataKey="revenue"

                            fill="#2563eb"

                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

};

const Card = ({ title, value }) => (

    <div className="bg-white rounded-xl shadow p-6">

        <p className="text-gray-500">

            {title}

        </p>

        <h1 className="text-4xl font-bold mt-3">

            {value}

        </h1>

    </div>

);

export default Analytics;