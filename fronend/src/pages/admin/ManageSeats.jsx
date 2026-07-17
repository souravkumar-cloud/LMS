import { useEffect, useMemo, useState } from "react";
import {
    Search,
    Pencil,
    Trash2,
    LogOut,
    Armchair,
    Plus
} from "lucide-react";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import seatService from "../../services/seatService";

const ManageSeats = () => {

    const [loading, setLoading] = useState(true);

    const [seats, setSeats] = useState([]);

    const [search, setSearch] = useState("");

    const [floorFilter, setFloorFilter] = useState("All");

    const [categoryFilter, setCategoryFilter] = useState("All");

    const fetchSeats = async () => {

        try {

            const res = await seatService.getAllSeats();

            setSeats(res.seats);

        }

        catch (error) {

            console.log(error);

            toast.error("Unable to fetch seats.");

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchSeats();

    }, []);

    const filteredSeats = useMemo(() => {

        return seats.filter((seat) => {

            const matchesSearch =String( seat.seatNumber)
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesFloor =

                floorFilter === "All"

                    ? true

                    : String(seat.floor) === floorFilter;

            const matchesCategory =

                categoryFilter === "All"

                    ? true

                    : seat.category === categoryFilter;

            return (

                matchesSearch &&

                matchesFloor &&

                matchesCategory

            );

        });

    }, [search, floorFilter, categoryFilter, seats]);

    const deleteSeat = async (id) => {

        if (!window.confirm("Delete this seat?")) return;

        try {

            await seatService.deleteSeat(id);

            toast.success("Seat Deleted");

            fetchSeats();

        }

        catch (error) {

            toast.error("Unable to delete seat");

        }

    };

    const vacateSeat = async (id) => {

        if (!window.confirm("Vacate this seat?")) return;

        try {

            await seatService.vacateSeat(id);

            toast.success("Seat Vacated");

            fetchSeats();

        }

        catch (error) {

            toast.error("Unable to vacate seat");

        }

    };

    if (loading) {

        return <Loader text="Loading Seats..." />;

    }

    return (

        <div className="space-y-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">

                        Seat Management

                    </h1>

                    <p className="text-gray-500">

                        Total Seats : {filteredSeats.length}

                    </p>

                </div>

                <Link

                    to="/admin/add-seat"

                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"

                >

                    <Plus size={18} />

                    Add Seat

                </Link>

            </div>

            {/* Filters */}

            <div className="grid md:grid-cols-3 gap-4">

                <div className="relative">

                    <Search

                        className="absolute left-4 top-3.5 text-gray-400"

                    />

                    <input

                        type="text"

                        placeholder="Search Seat..."

                        value={search}

                        onChange={(e) =>

                            setSearch(e.target.value)

                        }

                        className="w-full rounded-lg border pl-11 py-3"

                    />

                </div>

                <select

                    value={floorFilter}

                    onChange={(e) =>

                        setFloorFilter(e.target.value)

                    }

                    className="rounded-lg border px-4"

                >

                    <option>All</option>

                    <option>1</option>

                    <option>2</option>

                    <option>3</option>

                </select>

                <select

                    value={categoryFilter}

                    onChange={(e) =>

                        setCategoryFilter(e.target.value)

                    }

                    className="rounded-lg border px-4"

                >

                    <option>All</option>

                    <option>Standard</option>

                    <option>Premium</option>

                    <option>VIP</option>

                </select>

            </div>

            {/* Table */}

            <div className="overflow-x-auto rounded-xl bg-white shadow">

                <table className="min-w-full">

                    <thead className="bg-slate-100">

                        <tr>

                            <th className="px-5 py-4 text-left">

                                Seat

                            </th>

                            <th className="px-5 py-4">

                                Floor

                            </th>

                            <th className="px-5 py-4">

                                Category

                            </th>

                            <th className="px-5 py-4">

                                Status

                            </th>

                            <th className="px-5 py-4">

                                Student

                            </th>

                            <th className="px-5 py-4">

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredSeats.map((seat) => (

                                <tr

                                    key={seat._id}

                                    className="border-t hover:bg-slate-50"

                                >

                                    <td className="px-5 py-4 font-semibold">

                                        <div className="flex items-center gap-3">

                                            <Armchair

                                                className="text-blue-600"

                                            />

                                            {seat.seatNumber}

                                        </div>

                                    </td>

                                    <td className="text-center">

                                        {seat.floor}

                                    </td>

                                    <td className="text-center">

                                        {seat.category}

                                    </td>

                                    <td className="text-center">

                                        {

                                            seat.status === "occupied"

                                                ?

                                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">

                                                    Occupied

                                                </span>

                                                :

                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                                                    Available

                                                </span>

                                        }

                                    </td>

                                    <td className="text-center">

                                        {

                                            seat.student ? (

                                                <Link
                                                    to={`/admin/student/${seat.student._id}`}
                                                    className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                                                >
                                                    {seat.student.fullName}
                                                </Link>

                                            ) : (

                                                "-"

                                            )

                                        }

                                    </td>

                                    <td>

                                        <div className="flex justify-center gap-3">

                                            <Link

                                                to={`/admin/edit-seat/${seat._id}`}

                                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"

                                            >

                                                <Pencil size={18} />

                                            </Link>

                                            <button

                                                onClick={() =>

                                                    vacateSeat(seat._id)

                                                }

                                                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"

                                            >

                                                <LogOut size={18} />

                                            </button>

                                            <button

                                                onClick={() =>

                                                    deleteSeat(seat._id)

                                                }

                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"

                                            >

                                                <Trash2 size={18} />

                                            </button>

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

export default ManageSeats;