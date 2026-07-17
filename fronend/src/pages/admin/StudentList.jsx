import { useEffect, useState } from "react";
import { Eye, Pencil, Search, Users, FileSpreadsheet, FileText, Trash2, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'

import studentService from "../../services/studentService";
import reportService from "../../services/reportService";
import Loader from "../../components/common/Loader";

const StudentList = () => {
    const navigate = useNavigate();

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

    const handleStatusToggleClick = (student) => {
        if (!student.isActive) {
            navigate(`/admin/student/edit/${student._id}?activate=true`);
        } else {
            toggleStudentStatus(student._id);
        }
    };

    const handleDeleteStudent = async (id) => {
        if (!window.confirm(`Are you sure you want to delete this ${roleFilter === "student" ? "student" : "admin"}?`)) {
            return;
        }

        try {
            await studentService.deleteStudent(id);
            toast.success(`${roleFilter === "student" ? "Student" : "Admin"} deleted successfully`);
            fetchStudents(); // Refresh student list
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to delete record");
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
        <div className="space-y-6 font-['Outfit',sans-serif]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                        <Users className="text-blue-600" />
                        <span>{roleFilter === "student" ? "Students Directory" : "Administrators"}</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                        Total {roleFilter === "student" ? "students" : "admins"} found:{" "}
                        <span className="text-slate-800 font-bold">{filteredStudents.length}</span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200/55">
                        <button
                            onClick={() => setRoleFilter("student")}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition duration-200 ${
                                roleFilter === "student"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            Students
                        </button>
                        <button
                            onClick={() => setRoleFilter("admin")}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition duration-200 ${
                                roleFilter === "admin"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            Admins
                        </button>
                    </div>

                    <Link
                        to="/admin/add-student"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/35 hover:brightness-110 active:scale-[0.99]"
                    >
                        Add {roleFilter === "student" ? "Student" : "Admin"}
                    </Link>

                    <button
                        onClick={() => reportService.studentExcel(roleFilter)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/35 hover:brightness-110 active:scale-[0.99] cursor-pointer"
                        title="Export to Excel"
                    >
                        <FileSpreadsheet size={16} />
                        <span className="hidden md:inline">Excel</span>
                    </button>

                    {/* <button
                        onClick={() => reportService.generatePDF("student", roleFilter)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/35 hover:brightness-110 active:scale-[0.99] cursor-pointer"
                        title="Export to PDF"
                    >
                        <FileText size={16} />
                        <span className="hidden md:inline">PDF</span>
                    </button> */}
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search
                    className="absolute left-4 top-3.5 text-slate-400"
                    size={18}
                />
                <input
                    type="text"
                    placeholder={`Search ${roleFilter === "student" ? "students" : "admins"} by name, email or phone...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3.5 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
            </div>

            {/* Table */}
            <div className="table-container shadow-xl shadow-slate-100/50">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="table-header">
                            <th className="px-6 py-4">
                                {roleFilter === "student" ? "Student Details" : "Admin Details"}
                            </th>
                            <th className="px-6 py-4">
                                Contact Phone
                            </th>
                            <th className="px-6 py-4">
                                Assigned Seat
                            </th>
                            {roleFilter === "student" && (
                                <th className="px-6 py-4">
                                    Payment
                                </th>
                            )}
                            <th className="px-6 py-4">
                                Account Status
                            </th>
                            <th className="px-6 py-4 text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {
                            filteredStudents.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={roleFilter === "student" ? "6" : "5"}
                                        className="text-center py-12 text-slate-400 text-sm"
                                    >
                                        No matches found.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr
                                        key={student._id}
                                        className="table-row"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full border border-slate-200/80 bg-slate-50 flex items-center justify-center text-slate-500">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <h2 className="font-semibold text-slate-900 text-sm">
                                                        {student.fullName}
                                                    </h2>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        {student.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell font-medium">
                                            {student.phone || "—"}
                                        </td>
                                        <td className="table-cell">
                                            {student.seat ? (
                                                <span className="font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg text-xs border border-blue-100">
                                                    {student.seat.seatNumber}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs">Unassigned</span>
                                            )}
                                        </td>
                                        {roleFilter === "student" && (
                                            <td className="table-cell">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border capitalize ${
                                                    student.paymentStatus === "paid"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                        : student.paymentStatus === "pending"
                                                        ? "bg-rose-50 text-rose-700 border-rose-100 animate-pulse font-bold"
                                                        : "bg-slate-50 text-slate-600 border-slate-100"
                                                }`}>
                                                    {student.paymentStatus || "N/A"}
                                                </span>
                                            </td>
                                        )}
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => handleStatusToggleClick(student)}
                                                className="focus:outline-none transition active:scale-95"
                                            >
                                                {student.isActive ? (
                                                    <span className="badge-success">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="badge-danger">
                                                        Inactive
                                                    </span>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    to={`/admin/student/${student._id}`}
                                                    className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200/60 hover:border-blue-100 transition"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <Link
                                                    to={`/admin/student/edit/${student._id}`}
                                                    className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/60 hover:border-indigo-100 transition"
                                                    title="Edit Record"
                                                >
                                                    <Pencil size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteStudent(student._id)}
                                                    className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/60 hover:border-rose-100 transition cursor-pointer"
                                                    title="Delete Record"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );

};

export default StudentList;