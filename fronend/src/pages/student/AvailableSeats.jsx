import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    Armchair,
    Filter
} from "lucide-react";

import Loader from "../../components/common/Loader";
import seatService from "../../services/seatService";

const AvailableSeats = () => {

    const [loading, setLoading] = useState(true);

    const [seats, setSeats] = useState([]);

    const [floor, setFloor] = useState("All");

    const [category, setCategory] = useState("All");

    const fetchSeats = async () => {

        try {

            const res = await seatService.getAvailableSeats();

            setSeats(res.seats);

        }

        catch (error) {

            toast.error("Unable to load seats.");

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

            const floorMatch =

                floor === "All"

                    ? true

                    : String(seat.floor) === floor;

            const categoryMatch =

                category === "All"

                    ? true

                    : seat.category === category;

            return floorMatch && categoryMatch;

        });

    }, [floor, category, seats]);

    const requestSeat = async (seatId) => {

        try {

            await seatService.requestSeat(seatId);

            toast.success("Seat Request Sent");

            fetchSeats();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to request seat"

            );

        }

    };

    if (loading) {

        return <Loader text="Loading Seats..." />;

    }

    return (

        <div className="space-y-8">

            {/* Header */}

            <div>

                <h1 className="text-3xl font-bold">

                    Available Seats

                </h1>

                <p className="text-gray-500">

                    Select a seat and send a request to the admin.

                </p>

            </div>

            {/* Filters */}

            <div className="bg-white rounded-xl shadow p-5 flex flex-wrap gap-4">

                <div className="flex items-center gap-2">

                    <Filter />

                    <span className="font-semibold">

                        Filters

                    </span>

                </div>

                <select

                    value={floor}

                    onChange={(e) =>

                        setFloor(e.target.value)

                    }

                    className="border rounded-lg px-4 py-2"

                >

                    <option>All</option>

                    <option>1</option>

                    <option>2</option>

                    <option>3</option>

                </select>

                <select

                    value={category}

                    onChange={(e) =>

                        setCategory(e.target.value)

                    }

                    className="border rounded-lg px-4 py-2"

                >

                    <option>All</option>

                    <option value="regular">

                        Regular

                    </option>

                    <option value="premium">

                        Premium

                    </option>

                    <option value="hourly">

                        Hourly

                    </option>

                </select>

            </div>

            {/* Legend */}

            <div className="flex gap-8 text-sm">

                <div className="flex items-center gap-2">

                    <div className="w-5 h-5 rounded bg-green-500"></div>

                    Available

                </div>

                <div className="flex items-center gap-2">

                    <div className="w-5 h-5 rounded bg-red-500"></div>

                    Occupied

                </div>

                <div className="flex items-center gap-2">

                    <div className="w-5 h-5 rounded bg-yellow-500"></div>

                    Maintenance

                </div>

            </div>

            {/* Seat Grid */}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-5">

                {

                    filteredSeats.map((seat) => (

                        <button

                            key={seat._id}

                            disabled={

                                seat.status !== "available"

                            }

                            onClick={() =>

                                requestSeat(seat._id)

                            }

                            className={`

                                rounded-xl

                                p-5

                                text-white

                                transition

                                hover:scale-105

                                ${

                                    seat.status === "available"

                                    ?

                                    "bg-green-500 hover:bg-green-600"

                                    :

                                    seat.status === "occupied"

                                    ?

                                    "bg-red-500"

                                    :

                                    "bg-yellow-500"

                                }

                            `}

                        >

                            <Armchair

                                size={35}

                                className="mx-auto"

                            />

                            <h2 className="mt-3 font-bold">

                                {seat.seatNumber}

                            </h2>

                            <p className="text-xs mt-1">

                                {seat.category}

                            </p>

                        </button>

                    ))

                }

            </div>

        </div>

    );

};

export default AvailableSeats;