import { useEffect, useMemo, useState } from "react";
import {
    Calendar,
    Download,
    Search,
    MapPin,
    QrCode,
    Users
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import attendanceService from "../../services/attendanceService";

const AttendanceReport = () => {

    const [loading, setLoading] = useState(true);

    const [attendance, setAttendance] = useState([]);

    const [search, setSearch] = useState("");

    const [selectedDate, setSelectedDate] = useState("");

    const fetchAttendance = async () => {

        try {

            const res = await attendanceService.getTodayAttendance();

            setAttendance(res.attendance);

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

    const filteredAttendance = useMemo(() => {

        return attendance.filter((item) => {

            const matchesStudent =

                item.student.fullName
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesDate =

                selectedDate === ""

                    ?

                    true

                    :

                    item.date.slice(0, 10) === selectedDate;

            return matchesStudent && matchesDate;

        });

    }, [attendance, search, selectedDate]);

    if (loading) {

        return <Loader text="Loading Attendance..." />;

    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">

                        Attendance Report

                    </h1>

                    <p className="text-gray-500">

                        Daily attendance of students

                    </p>

                </div>

                <button

                  onClick={attendanceService.exportAttendanceExcel}

                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"

              >

                  <Download size={18} />

                  Export Excel

              </button>

            </div>

            {/* Summary */}

            <div className="grid md:grid-cols-3 gap-5">

                <SummaryCard

                    title="Total Students"

                    value={filteredAttendance.length}

                    color="bg-blue-500"

                />

                <SummaryCard

                    title="Present"

                    value={filteredAttendance.filter(

                        item => item.entryTime

                    ).length}

                    color="bg-green-500"

                />

                <SummaryCard

                    title="Not Marked Exit"

                    value={filteredAttendance.filter(

                        item => item.entryTime && !item.exitTime

                    ).length}

                    color="bg-yellow-500"

                />

            </div>

            {/* Filters */}

            <div className="bg-white rounded-xl shadow p-5 flex flex-wrap gap-4">

                <div className="relative flex-1">

                    <Search

                        size={18}

                        className="absolute left-4 top-3.5"

                    />

                    <input

                        type="text"

                        placeholder="Search Student"

                        value={search}

                        onChange={(e)=>setSearch(e.target.value)}

                        className="w-full border rounded-lg py-3 pl-11"

                    />

                </div>

                <div>

                    <input

                        type="date"

                        value={selectedDate}

                        onChange={(e)=>setSelectedDate(e.target.value)}

                        className="border rounded-lg px-4 py-3"

                    />

                </div>

            </div>

            {/* Table */}

            <div className="bg-white rounded-xl shadow overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="py-4">Student</th>

                            <th>Date</th>

                            <th>Entry</th>

                            <th>Exit</th>

                            <th>Method</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredAttendance.map((item)=>(

                                <tr

                                    key={item._id}

                                    className="border-t text-center"

                                >

                                    <td className="py-4">

                                        {item.student.fullName}

                                    </td>

                                    <td>

                                        {

                                            new Date(item.date)

                                            .toLocaleDateString()

                                        }

                                    </td>

                                    <td>

                                        {

                                            item.entryTime

                                            ?

                                            new Date(item.entryTime)

                                            .toLocaleTimeString()

                                            :

                                            "-"

                                        }

                                    </td>

                                    <td>

                                        {

                                            item.exitTime

                                            ?

                                            new Date(item.exitTime)

                                            .toLocaleTimeString()

                                            :

                                            "-"

                                        }

                                    </td>

                                    <td>

                                        {

                                            item.verificationMethod==="gps"

                                            ?

                                            <MapPin className="mx-auto"/>

                                            :

                                            <QrCode className="mx-auto"/>

                                        }

                                    </td>

                                    <td>

                                        {

                                            item.exitTime

                                            ?

                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                                                Completed

                                            </span>

                                            :

                                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">

                                                Inside

                                            </span>

                                        }

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

const SummaryCard = ({

    title,

    value,

    color

})=>(

    <div className="bg-white rounded-xl shadow p-6">

        <div className={`h-2 rounded ${color}`}></div>

        <h3 className="mt-4 text-gray-500">

            {title}

        </h3>

        <h1 className="text-4xl font-bold mt-2">

            {value}

        </h1>

    </div>

);

export default AttendanceReport;
