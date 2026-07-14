import { useEffect, useState } from "react";
import {
    Armchair,
    Clock3,
    CalendarDays,
    Crown,
    RefreshCcw,
    CircleCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import seatService from "../../services/seatService";

const MySeat = () => {

    const [loading, setLoading] = useState(true);

    const [seat, setSeat] = useState(null);

    const fetchSeat = async () => {

        try {

            const res = await seatService.getMySeat();

            setSeat(res.seat);

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to fetch seat."

            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchSeat();

    }, []);

    if (loading) {

        return <Loader text="Loading Your Seat..." />;

    }

    if (!seat) {

        return (

            <div className="bg-white rounded-xl shadow-lg p-12 text-center">

                <Armchair

                    size={80}

                    className="mx-auto text-gray-400"

                />

                <h2 className="mt-6 text-2xl font-bold">

                    No Seat Assigned

                </h2>

                <p className="mt-2 text-gray-500">

                    You don't have any seat assigned yet.

                </p>

                <Link

                    to="/student/available-seats"

                    className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"

                >

                    Request Seat

                </Link>

            </div>

        );

    }

    return (

        <div className="space-y-8">

            {/* Header */}

            <div>

                <h1 className="text-3xl font-bold">

                    My Seat

                </h1>

                <p className="text-gray-500">

                    View your allotted seat details.

                </p>

            </div>

            {/* Seat Card */}

            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl text-white p-8">

                <div className="flex flex-col lg:flex-row justify-between">

                    <div>

                        <p className="text-blue-100">

                            Seat Number

                        </p>

                        <h1 className="text-6xl font-bold mt-2">

                            {seat.seatNumber}

                        </h1>

                        <p className="mt-4 text-blue-100">

                            Floor {seat.floor}

                        </p>

                    </div>

                    <Armchair

                        size={120}

                        className="opacity-20 mt-6 lg:mt-0"

                    />

                </div>

            </div>

            {/* Information */}

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                <InfoCard

                    icon={<Crown size={28}/>}

                    title="Category"

                    value={seat.category}

                    color="text-yellow-500"

                />

                <InfoCard

                    icon={<Clock3 size={28}/>}

                    title="Access"

                    value={seat.accessType}

                    color="text-blue-500"

                />

                <InfoCard

                    icon={<CalendarDays size={28}/>}

                    title="Timing"

                    value={

                        seat.accessType === "full-day"

                        ?

                        "8 AM - 10 PM"

                        :

                        "Hourly"

                    }

                    color="text-green-500"

                />

                <InfoCard

                    icon={<CircleCheck size={28}/>}

                    title="Status"

                    value={seat.status}

                    color="text-purple-500"

                />

            </div>

            {/* Subscription */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-2xl font-semibold mb-6">

                    Subscription

                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    <Row

                        label="Plan"

                        value={

                            seat.subscription?.plan?.name ||

                            "-"

                        }

                    />

                    <Row

                        label="Expiry"

                        value={

                            seat.subscription?.endDate

                            ?

                            new Date(

                                seat.subscription.endDate

                            ).toLocaleDateString()

                            :

                            "-"

                        }

                    />

                </div>

            </div>

            {/* Actions */}

            <div className="flex flex-wrap gap-4">

                <Link

                    to="/student/available-seats"

                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"

                >

                    <RefreshCcw size={18}/>

                    Request Seat Change

                </Link>

            </div>

        </div>

    );

};

const InfoCard = ({

    icon,

    title,

    value,

    color

}) => (

    <div className="bg-white rounded-xl shadow p-6">

        <div className={`${color}`}>

            {icon}

        </div>

        <p className="mt-4 text-gray-500">

            {title}

        </p>

        <h2 className="text-xl font-bold mt-2 capitalize">

            {value}

        </h2>

    </div>

);

const Row = ({

    label,

    value

}) => (

    <div className="flex justify-between border-b pb-4">

        <span className="text-gray-500">

            {label}

        </span>

        <span className="font-semibold">

            {value}

        </span>

    </div>

);

export default MySeat;