import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    CheckCircle,
    XCircle,
    Search,
    Clock,
    User,
    Armchair
} from "lucide-react";

import Loader from "../../components/common/Loader";
import seatRequestService from "../../services/seatRequestService";

const Requests = () => {

    const [loading, setLoading] = useState(true);

    const [requests, setRequests] = useState([]);

    const [search, setSearch] = useState("");

    const loadRequests = async () => {

        try {

            const res = await seatRequestService.getPendingRequests();

            setRequests(res.requests);

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to load requests."

            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadRequests();

    }, []);

    const approveRequest = async (id) => {

        if (

            !window.confirm(

                "Approve this seat request?"

            )

        ) return;

        try {

            await seatRequestService.approveRequest(id);

            toast.success(

                "Seat Request Approved"

            );

            loadRequests();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to approve."

            );

        }

    };

    const rejectRequest = async (id) => {

        if (

            !window.confirm(

                "Reject this seat request?"

            )

        ) return;

        try {

            await seatRequestService.rejectRequest(id);

            toast.success(

                "Seat Request Rejected"

            );

            loadRequests();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to reject."

            );

        }

    };

    const filteredRequests = useMemo(() => {

        return requests.filter((request) =>

            request.student.fullName

                .toLowerCase()

                .includes(

                    search.toLowerCase()

                )

        );

    }, [

        requests,

        search

    ]);

    if (loading) {

        return (

            <Loader

                text="Loading Requests..."

            />

        );

    }

    return (

    <div className="space-y-8">

        {/* Header */}

        <div className="flex justify-between items-center">

            <div>

                <h1 className="text-3xl font-bold">

                    Seat Requests

                </h1>

                <p className="text-gray-500 mt-1">

                    Approve or reject student seat requests.

                </p>

            </div>

            <div className="bg-blue-100 text-blue-700 px-5 py-3 rounded-xl font-semibold">

                Pending :

                <span className="ml-2">

                    {filteredRequests.length}

                </span>

            </div>

        </div>

        {/* Search */}

        <div className="bg-white shadow rounded-xl p-5">

            <div className="relative">

                <Search

                    size={20}

                    className="absolute left-4 top-4 text-gray-400"

                />

                <input

                    type="text"

                    placeholder="Search Student..."

                    value={search}

                    onChange={(e)=>setSearch(e.target.value)}

                    className="w-full border rounded-xl pl-12 pr-4 py-3"

                />

            </div>

        </div>

        {/* Table */}

        <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="text-left p-4">

                            Student

                        </th>

                        <th className="text-left p-4">

                            Current Seat

                        </th>

                        <th className="text-left p-4">

                            Requested Seat

                        </th>

                        <th className="text-left p-4">

                            Type

                        </th>

                        <th className="text-left p-4">

                            Message

                        </th>

                        <th className="text-left p-4">

                            Requested On

                        </th>

                        <th className="text-center p-4">

                            Actions

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        filteredRequests.length===0

                        ?

                        (

                            <tr>

                                <td

                                    colSpan="7"

                                    className="text-center py-16"

                                >

                                    <Clock

                                        size={60}

                                        className="mx-auto text-gray-400"

                                    />

                                    <h2 className="mt-5 text-xl font-semibold">

                                        No Pending Requests

                                    </h2>

                                </td>

                            </tr>

                        )

                        :

                        filteredRequests.map(request=>(

                            <tr

                                key={request._id}

                                className="border-t hover:bg-gray-50"

                            >

                                <td className="p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="bg-blue-100 p-3 rounded-full">

                                            <User

                                                size={18}

                                            />

                                        </div>

                                        <div>

                                            <p className="font-semibold">

                                                {request.student.fullName}

                                            </p>

                                            <p className="text-sm text-gray-500">

                                                {request.student.email}

                                            </p>

                                        </div>

                                    </div>

                                </td>

                                <td className="p-4">

                                    {

                                        request.currentSeat

                                        ?

                                        request.currentSeat.seatNumber

                                        :

                                        "-"

                                    }

                                </td>

                                <td className="p-4">

                                    <span className="font-semibold text-green-600">

                                        {

                                            request.requestedSeat.seatNumber

                                        }

                                    </span>

                                </td>

                                <td className="p-4">

                                    {

                                        request.requestType

                                    }

                                </td>

                                <td className="p-4">

                                    {

                                        request.remarks

                                        ?

                                        request.remarks

                                        :

                                        <span className="text-gray-400">

                                            No Message

                                        </span>

                                    }

                                </td>

                                <td className="p-4">

                                    {

                                        new Date(

                                            request.createdAt

                                        ).toLocaleDateString()

                                    }

                                </td>

                                <td className="p-4">

                                    <div className="flex justify-center gap-3">

                                        <button

                                            onClick={()=>approveRequest(request._id)}

                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"

                                        >

                                            <CheckCircle size={18}/>

                                            Approve

                                        </button>

                                        <button

                                            onClick={()=>rejectRequest(request._id)}

                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"

                                        >

                                            <XCircle size={18}/>

                                            Reject

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
}

export default Requests;