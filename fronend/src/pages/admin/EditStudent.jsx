import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import studentService from "../../services/studentService";
import seatService from "../../services/seatService";

const EditStudent = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [preview, setPreview] = useState("");

    const [availableSeats, setAvailableSeats] = useState([]);

    const [seatData, setSeatData] = useState({
        floor: "",
        category: "",
        seatId: ""
    });

    const [formData, setFormData] = useState({

        fullName: "",

        email: "",

        phone: "",

        aadhaar: "",

        gender: "Male",

        address: "",

        city: "",

        state: "",

        pinCode: "",

        guardianName: "",

        guardianPhone: "",

        emergencyContact: "",

        profilePhoto: null

    });

    const fetchStudent = async () => {

        try {

            const res = await studentService.getStudentById(id);

            const student = res.student;

            setFormData({

                fullName: student.fullName || "",

                email: student.email || "",

                phone: student.phone || "",

                aadhaar: student.aadhaar || "",

                gender: student.gender || "Male",

                address: student.address || "",

                city: student.city || "",

                state: student.state || "",

                pinCode: student.pinCode || "",

                guardianName: student.guardianName || "",

                guardianPhone: student.guardianPhone || "",

                emergencyContact: student.emergencyContact || "",

                profilePhoto: null

            });

            setPreview(student.profilePhoto || "");

            if (student.seat) {

                setSeatData({

                    floor: student.seat.floor,

                    category: student.seat.category,

                    seatId: student.seat._id

                });

            }

        }

        catch (error) {

            console.log(error);

            toast.error("Unable to load student.");

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchStudent();

    }, [id]);

    useEffect(() => {

        const loadSeats = async () => {

            if (!seatData.floor || !seatData.category) return;

            try {

                const res = await seatService.getAvailableSeats();

                const seats = res.seats.filter(

                    seat =>

                        seat.floor == seatData.floor &&

                        seat.category === seatData.category

                );

                setAvailableSeats(seats);

            }

            catch (error) {

                console.log(error);

            }

        };

        loadSeats();

    }, [seatData.floor, seatData.category]);

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSeatChange = (e) => {

        setSeatData({

            ...seatData,

            [e.target.name]: e.target.value

        });

    };

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setPreview(URL.createObjectURL(file));

        setFormData({

            ...formData,

            profilePhoto: file

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {

                if (value !== null) {

                    data.append(key, value);

                }

            });

            data.append("seatId", seatData.seatId);

            await studentService.updateStudent(id, data);

            toast.success("Student Updated Successfully");

            navigate("/admin/students");

        }

        catch (error) {

            console.log(error);

            toast.error(

                error.response?.data?.message ||

                "Update Failed"

            );

        }

        finally {

            setSaving(false);

        }

    };

    if (loading) {

        return <Loader text="Loading Student..." />;

    }

    return (

        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">

            <h1 className="text-3xl font-bold mb-8">

                Edit Student

            </h1>

            <form
    onSubmit={handleSubmit}
    className="grid grid-cols-1 md:grid-cols-2 gap-6"
>

    <Input
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
    />

    <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
    />

    <Input
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
    />

    <Input
        label="Aadhaar"
        name="aadhaar"
        value={formData.aadhaar}
        onChange={handleChange}
    />

    <div>

        <label className="block mb-2 font-medium">
            Gender
        </label>

        <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-3"
        >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
        </select>

    </div>

    <Input
        label="Emergency Contact"
        name="emergencyContact"
        value={formData.emergencyContact}
        onChange={handleChange}
    />

    <div className="md:col-span-2">

        <label className="block mb-2 font-medium">
            Address
        </label>

        <textarea
            rows="3"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
        />

    </div>

    {/* ---------------- Seat Assignment ---------------- */}

    <div className="md:col-span-2 border-t pt-6">

        <h2 className="text-2xl font-semibold mb-6 text-blue-600">

            Seat Assignment

        </h2>

    </div>

    <div>

        <label className="block mb-2 font-medium">

            Floor

        </label>

        <select
            name="floor"
            value={seatData.floor}
            onChange={handleSeatChange}
            className="w-full rounded-lg border px-4 py-3"
        >

            <option value="">Select Floor</option>

            <option value="1">First Floor</option>

            <option value="2">Second Floor</option>

            <option value="3">Third Floor</option>

        </select>

    </div>

    <div>

        <label className="block mb-2 font-medium">

            Category

        </label>

        <select
            name="category"
            value={seatData.category}
            onChange={handleSeatChange}
            className="w-full rounded-lg border px-4 py-3"
        >

            <option value="">Select Category</option>

            <option value="regular">Regular</option>

            <option value="premium">Premium</option>

        </select>

    </div>

    <div className="md:col-span-2">

        <label className="block mb-2 font-medium">

            Seat Number

        </label>

        <select
            name="seatId"
            value={seatData.seatId}
            onChange={handleSeatChange}
            className="w-full rounded-lg border px-4 py-3"
        >

            <option value="">Select Seat</option>

            {

                availableSeats.map((seat) => (

                    <option
                        key={seat._id}
                        value={seat._id}
                    >

                        Seat {seat.seatNumber} | Floor {seat.floor} | {seat.category}

                    </option>

                ))

            }

        </select>

    </div>

    {/* ---------------- Profile Photo ---------------- */}

    <div className="md:col-span-2">

        <label className="block mb-2 font-medium">

            Profile Photo

        </label>

        <input
            type="file"
            accept="image/*"
            onChange={handleImage}
        />

        {

            preview && (

                <img
                    src={preview}
                    alt="Preview"
                    className="h-40 mt-4 rounded-lg border object-cover"
                />

            )

        }

    </div>

    <div className="md:col-span-2 flex gap-4 mt-6">

        <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
        >

            {

                saving

                    ? "Updating..."

                    : "Update Student"

            }

        </button>

        <button
            type="button"
            onClick={() => navigate("/admin/students")}
            className="bg-gray-300 hover:bg-gray-400 px-8 py-3 rounded-lg"
        >

            Cancel

        </button>

    </div>

</form>

        </div>

    );

};

const Input = ({ label, ...props }) => (

    <div>

        <label className="block mb-2 font-medium">

            {label}

        </label>

        <input

            {...props}

            className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"

        />

    </div>

);

export default EditStudent;