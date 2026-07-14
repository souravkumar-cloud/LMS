import { useEffect, useState } from "react";
import { Eye, Pencil, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast'

import studentService from "../../services/studentService";
import Loader from "../../components/common/Loader";

const StudentList = () => {

    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [roleFilter,setRoleFilter]=useState("student");

    const fetchStudents = async () => {

        try {

            const res = await studentService.getStudents();
            console.log(res.students)
            setStudents(res.students);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    const toggleStudentStatus = async (id) => {

    try {

        await studentService.toggleStudentStatus(id);

        toast.success("Student status updated");

        fetchStudents();

    }

    catch (error) {

        console.log(error);

        toast.error(
            error.response?.data?.message || "Unable to update status"
        );

    }

};

    useEffect(() => {

        fetchStudents();

    }, []);

    if (loading) {

        return <Loader text="Loading Students..." />;

    }

const filteredStudents = students.filter((student) => {

    const fullName = student.fullName || "";
    const email = student.email || "";
    const phone = student.phone || "";

    const matchesSearch =

        fullName.toLowerCase().includes(search.toLowerCase()) ||

        email.toLowerCase().includes(search.toLowerCase()) ||

        phone.includes(search);

    const matchesRole = student.role === roleFilter;

    return matchesSearch && matchesRole;

});

    return (

        <div className="space-y-6">

            {/* Header */}

            

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

    <div>

        <h1 className="text-3xl font-bold flex items-center gap-3">

            <Users />

            {roleFilter === "student" ? "Students" : "Admins"}

        </h1>

        <p className="text-gray-500 mt-1">

            Total {roleFilter === "student" ? "Students" : "Admins"} :

            {" "}

            {filteredStudents.length}

        </p>

    </div>

    <div className="flex items-center gap-3">

        <button

            onClick={() => setRoleFilter("student")}

            className={`px-5 py-2 rounded-lg transition ${
                roleFilter === "student"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
            }`}

        >

            Students

        </button>

        <button

            onClick={() => setRoleFilter("admin")}

            className={`px-5 py-2 rounded-lg transition ${
                roleFilter === "admin"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
            }`}

        >

            Admins

        </button>

        <Link

            to="/admin/add-student"

            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"

        >

            Add {roleFilter === "student" ? "Student" : "Admin"}

        </Link>

    </div>

</div>

            {/* Search */}

            <div className="relative">

                <Search

                    className="absolute left-4 top-3.5 text-gray-500"

                    size={18}

                />

                <input

                    type="text"

                    placeholder="Search Student..."

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                    className="w-full rounded-lg border bg-white pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"

                />

            </div>

            {/* Table */}

            <div className="overflow-x-auto rounded-xl bg-white shadow">

                <table className="min-w-full">

                    <thead className="bg-slate-100">

                        <tr>

                            <th className="px-5 py-4 text-left">

                                Student

                            </th>

                            <th className="px-5 py-4 text-left">

                                Phone

                            </th>

                            <th className="px-5 py-4 text-left">

                                Seat Number

                            </th>

                            <th className="px-5 py-4 text-left">

                                Status

                            </th>

                            <th className="px-5 py-4 text-center">

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredStudents.length === 0 ?

                                (

                                    <tr>

                                        <td

                                            colSpan="5"

                                            className="text-center py-10 text-gray-500"

                                        >

                                            No Students Found

                                        </td>

                                    </tr>

                                )

                                :

                                filteredStudents.map((student) => (

                                    <tr

                                        key={student._id}

                                        className="border-t hover:bg-gray-50"

                                    >

                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-4">

                                                <img

                                                    src={

                                                        student.profilePhoto ||

                                                        "https://ui-avatars.com/api/?name=" +

                                                        student.fullName

                                                    }

                                                    alt="Profile"

                                                    className="h-12 w-12 rounded-full object-cover"

                                                />

                                                <div>

                                                    <h2 className="font-semibold">

                                                        {student.fullName}

                                                    </h2>

                                                    <p className="text-sm text-gray-500">

                                                        {student.email}

                                                    </p>

                                                </div>

                                            </div>

                                        </td>

                                        <td className="px-5 py-4">

                                            {student.phone}

                                        </td>

                                        <td className="px-5 py-4">

                                                {

                                                    student.seat

                                                        ? student.seat.seatNumber

                                                        : "Not Assigned"

                                                }

                                            </td>

                                        <td className="px-5 py-4">
                                            <button onClick={() => toggleStudentStatus(student._id)}>
                                            
                                            {

                                                student.isActive ?

                                                    <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm">

                                                        Active

                                                    </span>

                                                    :

                                                    <span className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-sm">

                                                        Inactive

                                                    </span>

                                            }
                                            </button>

                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="flex justify-center gap-3">

                                                <Link

                                                    to={`/admin/student/${student._id}`}

                                                    className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"

                                                >

                                                    <Eye size={18} />

                                                </Link>

                                                <Link

                                                    to={`/admin/student/edit/${student._id}`}

                                                    className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"

                                                >

                                                    <Pencil size={18} />

                                                </Link>

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

export default StudentList;