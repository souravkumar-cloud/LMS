import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Mail,
    Phone,
    MapPin,
    User,
    BadgeCheck,
    Armchair,
    CreditCard,
    ArrowLeft
} from "lucide-react";

import Loader from "../../components/common/Loader";
import studentService from "../../services/studentService";

const StudentDetails = () => {

    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [student, setStudent] = useState(null);

    const fetchStudent = async () => {

        try {

            const res = await studentService.getStudentById(id);
            console.log(res.student.seat);
            setStudent(res.student);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchStudent();

    }, []);

    if (loading) {

        return <Loader text="Loading Student..." />;

    }

    return (

        <div className="space-y-6">

            <Link

                to="/admin/students"

                className="inline-flex items-center gap-2 text-blue-600 hover:underline"

            >

                <ArrowLeft size={18} />

                Back

            </Link>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Profile */}

                <div className="bg-white rounded-xl shadow p-6">

                    <div className="flex flex-col items-center">

                        <div className="h-36 w-36 rounded-full border-4 border-blue-500 bg-slate-50 flex items-center justify-center text-slate-400">

                            <User size={64} />

                        </div>

                        <h2 className="text-2xl font-bold mt-4">

                            {student.fullName}

                        </h2>

                        <span

                            className={`mt-4 px-4 py-2 rounded-full text-sm font-medium ${
                                student.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}

                        >

                            {

                                student.isActive

                                    ? "Active"

                                    : "Inactive"

                            }

                        </span>

                    </div>

                </div>

                {/* Details */}

                <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">

                    <h2 className="text-2xl font-semibold mb-6">

                        Student Information

                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        <Info

                            icon={<Mail size={18}/>}

                            label="Email"

                            value={student.email}

                        />

                        <Info

                            icon={<Phone size={18}/>}

                            label="Phone"

                            value={student.phone}

                        />

                        <Info

                            icon={<BadgeCheck size={18}/>}

                            label="Aadhaar"

                            value={student.aadhaar}

                        />

                        <Info

                            icon={<User size={18}/>}

                            label="Gender"

                            value={student.gender}

                        />

                        <Info

                            icon={<Phone size={18}/>}

                            label="Emergency Contact"

                            value={student.emergencyContact || "-"}

                        />

                    </div>

                </div>

            </div>

            {/* Seat & Subscription */}

            <div className="grid md:grid-cols-2 gap-6">

                <div className="bg-white rounded-xl shadow p-6">

                    <div className="flex items-center gap-3 mb-4">

                        <Armchair className="text-blue-600"/>

                        <h2 className="text-xl font-semibold">

                            Seat Details

                        </h2>

                    </div>

                    <div className="space-y-3">

                        <Row

                            label="Seat Number"

                            value={student.seat?.seatNumber || "Not Assigned"}

                        />

                        <Row

                            label="Floor"

                            value={student.seat?.floor || "-"}

                        />

                        <Row

                            label="Category"

                            value={student.seat?.category || "-"}

                        />

                    </div>

                </div>

                <div className="bg-white rounded-xl shadow p-6">

                    <div className="flex items-center gap-3 mb-4">

                        <CreditCard className="text-green-600"/>

                        <h2 className="text-xl font-semibold">

                            Subscription

                        </h2>

                    </div>

                    <div className="space-y-3">

                        <Row

                            label="Plan"

                            value={

                                student.subscription?.plan?.name ||

                                "-"

                            }

                        />

                        <Row

                            label="Expiry"

                            value={

                                student.subscription?.endDate

                                    ?

                                    new Date(

                                        student.subscription.endDate

                                    ).toLocaleDateString()

                                    :

                                    "-"

                            }

                        />

                        <Row

                            label="Status"

                            value={

                                student.subscription?.status ||

                                "-"

                            }

                        />

                    </div>

                </div>

            </div>

        </div>

    );

};

const Info = ({ icon, label, value }) => (

    <div>

        <p className="flex items-center gap-2 text-gray-500">

            {icon}

            {label}

        </p>

        <h3 className="mt-2 font-semibold">

            {value || "-"}

        </h3>

    </div>

);

const Row = ({ label, value }) => (

    <div className="flex justify-between border-b pb-3">

        <span className="text-gray-500">

            {label}

        </span>

        <span className="font-semibold">

            {value}

        </span>

    </div>

);

export default StudentDetails;