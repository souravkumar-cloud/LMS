import { useEffect, useState } from "react";
import {
    Download,
    Receipt,
    Calendar,
    CreditCard,
    BadgeCheck
} from "lucide-react";

import paymentService from "../../services/paymentService";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const Receipts = () => {

    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);

    useEffect(() => {

        loadReceipts();

    }, []);

    const loadReceipts = async () => {

        try {

            const res = await paymentService.paymentHistory();

            setPayments(res.payments || []);

        }

        catch (err) {

            toast.error("Unable to load receipts");

        }

        finally {

            setLoading(false);

        }

    };

    const downloadReceipt = async (id) => {

        try {

            window.open(
                `http://localhost:5000/api/payment/receipt/${id}`,
                "_blank"
            );

        }

        catch {

            toast.error("Unable to download receipt");

        }

    };

    if (loading)
        return <Loader text="Loading Receipts..." />;

    return (

        <div className="max-w-7xl mx-auto p-6">

            <div className="flex items-center gap-3 mb-8">

                <Receipt size={34} className="text-blue-600"/>

                <div>

                    <h1 className="text-3xl font-bold">

                        Fee Receipts

                    </h1>

                    <p className="text-gray-500">

                        Download current and previous fee receipts.

                    </p>

                </div>

            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-blue-600 text-white">

                        <tr>

                            <th className="p-4 text-left">

                                Receipt

                            </th>

                            <th className="p-4">

                                Month

                            </th>

                            <th className="p-4">

                                Plan

                            </th>

                            <th className="p-4">

                                Amount

                            </th>

                            <th className="p-4">

                                Method

                            </th>

                            <th className="p-4">

                                Status

                            </th>

                            <th className="p-4">

                                Verified

                            </th>

                            <th className="p-4">

                                Action

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {payments.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="text-center py-12 text-gray-500"
                                >

                                    No Receipts Found

                                </td>

                            </tr>

                        ) : (

                            payments.map(payment => (

                                <tr
                                    key={payment._id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="p-4 font-medium">

                                        {payment.receiptNumber}

                                    </td>

                                    <td className="text-center">

                                        <div className="flex justify-center items-center gap-2">

                                            <Calendar size={16}/>

                                            {

                                                new Date(
                                                    payment.paidAt
                                                ).toLocaleString(
                                                    "default",
                                                    {
                                                        month: "long",
                                                        year: "numeric"
                                                    }
                                                )

                                            }

                                        </div>

                                    </td>

                                    <td className="text-center">

                                        {payment.plan?.name}

                                    </td>

                                    <td className="text-center font-semibold text-green-600">

                                        ₹{payment.amount}

                                    </td>

                                    <td className="text-center">

                                        <div className="flex justify-center items-center gap-2">

                                            <CreditCard size={16}/>

                                            {

                                                payment.paymentMethod
                                                    ?.toUpperCase()

                                            }

                                        </div>

                                    </td>

                                    <td className="text-center">

                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                                            Paid

                                        </span>

                                    </td>

                                    <td className="text-center">

                                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

                                            <BadgeCheck size={16}/>

                                            Admin

                                        </span>

                                    </td>

                                    <td className="text-center">

                                        <button

                                            onClick={() =>
                                                downloadReceipt(payment._id)
                                            }

                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"

                                        >

                                            <Download size={18}/>

                                            PDF

                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

};

export default Receipts;