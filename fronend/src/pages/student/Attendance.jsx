import { useEffect, useState } from "react";
import {
    LogIn,
    LogOut,
    Clock,
    MapPin,
    QrCode
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import attendanceService from "../../services/attendanceService";

const Attendance = () => {

    const [loading, setLoading] = useState(true);

    const [history, setHistory] = useState([]);

    const [today, setToday] = useState(null);

    const fetchAttendance = async () => {

        try {

            const res = await attendanceService.getMyAttendance();

            setHistory(res.attendance);

            if (res.attendance.length > 0) {

                setToday(res.attendance[0]);

            }

        }

        catch (error) {

            toast.error("Unable to load attendance.");

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchAttendance();

    }, []);

    const getLocation = () => {

        return new Promise((resolve, reject) => {

            navigator.geolocation.getCurrentPosition(

                (position) => {

                    resolve({

                        latitude: position.coords.latitude,

                        longitude: position.coords.longitude

                    });

                },

                reject

            );

        });

    };

    const markEntry = async () => {

        try {

            const location = await getLocation();

            await attendanceService.markEntry({

                latitude: location.latitude,

                longitude: location.longitude,

                verificationMethod: "gps"

            });

            toast.success("Entry Marked");

            fetchAttendance();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to mark entry"

            );

        }

    };

    const markExit = async () => {

        try {

            const location = await getLocation();

            await attendanceService.markExit({

                latitude: location.latitude,

                longitude: location.longitude,

                verificationMethod: "gps"

            });

            toast.success("Exit Marked");

            fetchAttendance();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to mark exit"

            );

        }

    };

    if (loading) {

        return <Loader text="Loading Attendance..." />;

    }

    return (

        <div className="space-y-8">

            <div>

                <h1 className="text-3xl font-bold">

                    Attendance

                </h1>

                <p className="text-gray-500">

                    Mark your daily attendance.

                </p>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

                <button

                    onClick={markEntry}

                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-8"

                >

                    <LogIn

                        size={50}

                        className="mx-auto"

                    />

                    <h2 className="mt-4 text-xl font-bold">

                        Mark Entry

                    </h2>

                </button>

                <button

                    onClick={markExit}

                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl p-8"

                >

                    <LogOut

                        size={50}

                        className="mx-auto"

                    />

                    <h2 className="mt-4 text-xl font-bold">

                        Mark Exit

                    </h2>

                </button>

            </div>

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-2xl font-semibold mb-6">

                    Today's Attendance

                </h2>

                {

                    today ?

                    <div className="grid md:grid-cols-2 gap-6">

                        <Card

                            icon={<Clock />}

                            title="Entry"

                            value={

                                today.entryTime

                                ?

                                new Date(

                                    today.entryTime

                                ).toLocaleTimeString()

                                :

                                "-"

                            }

                        />

                        <Card

                            icon={<Clock />}

                            title="Exit"

                            value={

                                today.exitTime

                                ?

                                new Date(

                                    today.exitTime

                                ).toLocaleTimeString()

                                :

                                "-"

                            }

                        />

                    </div>

                    :

                    <p>No attendance today.</p>

                }

            </div>

            <div className="bg-white rounded-xl shadow">

                <div className="p-6 border-b">

                    <h2 className="text-2xl font-semibold">

                        Attendance History

                    </h2>

                </div>

                <table className="min-w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="py-3">

                                Date

                            </th>

                            <th>

                                Entry

                            </th>

                            <th>

                                Exit

                            </th>

                            <th>

                                Method

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            history.map((item) => (

                                <tr

                                    key={item._id}

                                    className="border-t text-center"

                                >

                                    <td className="py-4">

                                        {

                                            new Date(

                                                item.date

                                            ).toLocaleDateString()

                                        }

                                    </td>

                                    <td>

                                        {

                                            item.entryTime

                                            ?

                                            new Date(

                                                item.entryTime

                                            ).toLocaleTimeString()

                                            :

                                            "-"

                                        }

                                    </td>

                                    <td>

                                        {

                                            item.exitTime

                                            ?

                                            new Date(

                                                item.exitTime

                                            ).toLocaleTimeString()

                                            :

                                            "-"

                                        }

                                    </td>

                                    <td>

                                        <div className="flex justify-center">

                                            {

                                                item.verificationMethod === "gps"

                                                ?

                                                <MapPin />

                                                :

                                                <QrCode />

                                            }

                                        </div>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

};

const Card = ({ icon, title, value }) => (

    <div className="border rounded-xl p-6">

        <div className="flex items-center gap-3">

            {icon}

            <span className="text-gray-500">

                {title}

            </span>

        </div>

        <h2 className="mt-4 text-2xl font-bold">

            {value}

        </h2>

    </div>

);

export default Attendance;