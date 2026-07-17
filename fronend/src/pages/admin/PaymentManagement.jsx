import { useEffect, useMemo, useState } from "react";
import {
    IndianRupee,
    Trash2,
    Search,
    CreditCard
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import paymentService from "../../services/paymentService";

const PaymentManagement = () => {

    const [loading, setLoading] = useState(true);

    const [payments, setPayments] = useState([]);

    const [revenue, setRevenue] = useState(0);

    const [search, setSearch] = useState("");

    const fetchData = async () => {

        try {

            const [paymentRes, revenueRes] = await Promise.all([

                paymentService.paymentHistory(),

                paymentService.totalRevenue()

            ]);

            setPayments(paymentRes.payments || []);

            setRevenue(revenueRes.revenue || 0);

        }

        finally {

            setLoading(false);

        }

    };

    const handleDeletePayment = async (id) => {
        if (!window.confirm("Are you sure you want to delete this payment record? This cannot be undone.")) {
            return;
        }

        try {
            await paymentService.deletePayment(id);
            toast.success("Payment record deleted successfully");
            fetchData();
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to delete payment record");
        }
    };

    useEffect(() => {

        fetchData();

    }, []);

    const filteredPayments = useMemo(() => {

        return payments.filter((payment) => {

            const studentName = payment.student?.fullName || "Deleted Student";

            return studentName.toLowerCase().includes(search.toLowerCase());

        });

    }, [payments, search]);

    if (loading) {

        return <Loader text="Loading Payments..." />;

    }

    return (

        <div className="space-y-6">

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold">

                        Payment Management

                    </h1>

                    <p className="text-gray-500">

                        Library Payment Records

                    </p>

                </div>

            </div>

            {/* Revenue Card */}

            <div className="bg-white rounded-xl shadow p-6">

                <div className="flex justify-between">

                    <div>

                        <p className="text-gray-500">

                            Total Revenue

                        </p>

                        <h1 className="text-5xl font-bold mt-2">

                            ₹ {revenue}

                        </h1>

                    </div>

                    <IndianRupee

                        size={60}

                        className="text-green-600"

                    />

                </div>

            </div>

            {/* Search */}

            <div className="relative">

                <Search

                    className="absolute left-4 top-3.5"

                    size={18}

                />

                <input

                    type="text"

                    placeholder="Search Student..."

                    value={search}

                    onChange={(e)=>setSearch(e.target.value)}

                    className="w-full border rounded-lg py-3 pl-11"

                />

            </div>

            {/* Table */}

            <div className="bg-white rounded-xl shadow overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="py-4">

                                Receipt

                            </th>

                            <th>

                                Student

                            </th>

                            <th>

                                Amount

                            </th>

                            <th>

                                Method

                            </th>

                            <th>

                                Status

                            </th>

                            <th>

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredPayments.map((payment)=>(

                                <tr

                                    key={payment._id}

                                    className="border-t text-center"

                                >

                                    <td>

                                        {payment.receiptNumber}

                                    </td>

                                    <td>

                                        {payment.student?.fullName || "Deleted Student"}

                                    </td>

                                    <td>

                                        ₹ {payment.amount}

                                    </td>

                                    <td>

                                        {payment.paymentMethod}

                                    </td>

                                    <td>

                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full capitalize">

                                            {payment.paymentStatus || payment.status}

                                        </span>

                                    </td>

                                    <td>

                                        <button

                                            onClick={()=>

                                                handleDeletePayment(

                                                    payment._id

                                                )

                                            }

                                            className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg p-2 cursor-pointer transition active:scale-95 flex items-center justify-center mx-auto"
                                            title="Delete Payment"

                                        >

                                            <Trash2 size={18}/>

                                        </button>

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

export default PaymentManagement;