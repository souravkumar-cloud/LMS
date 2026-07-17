import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";
import seatService from "../../services/seatService";
import studentService from "../../services/studentService";
import subscriptionService from "../../services/subscriptionService";
const AddStudent = () => {

    const [loading, setLoading] = useState(false);

    const [plans, setPlans] = useState([]);

    const [availableSeats, setAvailableSeats] = useState([]);

    const [formData, setFormData] = useState({

        fullName: "",

        email: "",

        phone: "",

        aadhaar: "",

        password: "",

        gender: "Male",

        address: "",

        emergencyContact: "",

        floor: "",

        category: "",

        seatId: "",

        paymentMethod: "",

        planId: ""

    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev=>({

            ...prev,

            [name]: value

        }));

    };



    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await studentService.addStudent(formData);

            toast.success("Student Added Successfully");

            setFormData({

                fullName: "",

                email: "",

                phone: "",

                aadhaar: "",

                password: "",

                gender: "Male",

                address: "",

                emergencyContact: "",

                paymentMethod: "",

                planId: ""


            });

        }

        catch (error) {

    console.log("Status:", error.response?.status);

    console.log("Response:", error.response?.data);

    toast.error(
        error.response?.data?.message || "Something went wrong"
    );

}

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const res = await subscriptionService.getPlans();
                setPlans(res.plans);
            } catch (error) {
                console.log(error);
            }
        };
        loadPlans();
    }, []);

    useEffect(() => {
        if (!formData.floor || !formData.category) return;

        const loadSeats = async () => {
            try {
                const res = await seatService.getAllSeats();
                const filtered = res.seats.filter(
                    seat => {
                        return (
                            seat.floor == formData.floor &&
                            seat.category === formData.category &&
                            seat.status === "available"
                        );
                    });
                setAvailableSeats(filtered);
            } catch (error) {
                console.log("Error loading seats:", error);
            }
        };
        loadSeats();
    }, [formData.floor, formData.category]);

    useEffect(() => {
        const selectedPlan = plans.find(p => p._id === formData.planId);
        const isHourly = selectedPlan?.category === "not fixed" || selectedPlan?.name?.toLowerCase().includes("hourly");
        if (isHourly) {
            setFormData(prev => ({
                ...prev,
                floor: "",
                category: "",
                seatId: ""
            }));
        }
    }, [formData.planId, plans]);

    useEffect(() => {

    console.log("Plans:", plans);

}, [plans]);

    const selectedPlan = plans.find(p => p._id === formData.planId);
    const isHourly = selectedPlan?.category === "not fixed" || selectedPlan?.name?.toLowerCase().includes("hourly");

    return (

        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">

            <div className="flex items-center gap-3 mb-8">

                <UserPlus className="text-blue-600" />

                <h1 className="text-3xl font-bold">

                    Add Student

                </h1>

            </div>

            <form

                onSubmit={handleSubmit}

                className="grid grid-cols-1 md:grid-cols-2 gap-6"

            >

                <div className="md:col-span-2 mt-6">

                    <h2 className="text-xl font-bold text-blue-600 border-b pb-2 mb-5">

                        Student Details

                    </h2>

                </div>

                {/* Full Name */}

                <Input

                    label="Full Name"

                    name="fullName"

                    value={formData.fullName}

                    onChange={handleChange}

                />

                {/* Email */}

                <Input

                    label="Email"

                    type="email"

                    name="email"

                    value={formData.email}

                    onChange={handleChange}

                />

                {/* Phone */}

                <Input

                    label="Phone"

                    name="phone"

                    value={formData.phone}

                    onChange={handleChange}

                />

                {/* Aadhaar */}

                <Input

                    label="Aadhaar"

                    name="aadhaar"

                    value={formData.aadhaar}

                    onChange={handleChange}

                />

                {/* Password */}

                <Input

                    label="Password"

                    type="password"

                    name="password"

                    value={formData.password}

                    onChange={handleChange}

                />

                {/* Gender */}

                <div>

                    <label className="block mb-2 font-medium">

                        Gender

                    </label>

                    <select

                        name="gender"

                        value={formData.gender}

                        onChange={handleChange}

                        className="w-full border rounded-lg px-4 py-3"

                    >

                        <option>Male</option>

                        <option>Female</option>

                        <option>Other</option>

                    </select>

                </div>

                {/* Address */}

                <div className="md:col-span-2">

                    <label className="block mb-2 font-medium">

                        Address

                    </label>

                    <textarea

                        rows="3"

                        name="address"

                        value={formData.address}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>

                <Input
                    label="Emergency Contact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                />

                {!isHourly && (
                    <>
                        {/* ================= Seat Assignment ================= */}

                        <div className="md:col-span-2 mt-4">

                            <h2 className="text-xl font-bold text-blue-600 border-b pb-2 mb-5">

                                Seat Assignment

                            </h2>

                        </div>

                        <div>

                            <label className="block mb-2 font-medium">

                                Floor

                            </label>

                            <select
                                name="floor"
                                value={formData.floor}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-3"
                            >

                                <option value="">Select Floor</option>

                                <option value="1">First Floor</option>

                                <option value="2">Second Floor</option>

                            </select>

                        </div>

                        <div>

                            <label className="block mb-2 font-medium">

                                Seat Category

                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-3"
                            >

                                <option value="">Select Category</option>

                                <option value="regular">Regular</option>

                                <option value="premium">Premium</option>

                            </select>

                        </div>

                        <div className="md:col-span-2">

                            <label className="block mb-2 font-medium">

                                Assign Seat

                            </label>

                            <select
                                name="seatId"
                                value={formData.seatId}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-3"
                            >

                                <option value="">Select Seat</option>

                                {

                                    availableSeats.map((seat) => (

                                        <option
                                            key={seat._id}
                                            value={seat._id}
                                        >

                                            Seat {seat.seatNumber} • Floor {seat.floor} • {seat.category}

                                        </option>

                                    ))

                                }

                            </select>

                        </div>
                    </>
                )}

                {/* ================= Payment ================= */}

                <div className="md:col-span-2 mt-6">

                    <h2 className="text-xl font-bold text-blue-600 border-b pb-2 mb-5">

                        Subscription & Payment

                    </h2>

                </div>

                <div>

                    <label className="block mb-2 font-medium">

                        Payment Method

                    </label>

                    <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3"
                    >

                        <option value="">Select Payment</option>

                        <option value="cash">Cash</option>

                        <option value="upi">UPI</option>

                        <option value="pending">Pending</option>

                    </select>

                </div>

                <div>

                    <label className="block mb-2 font-medium">

                        Subscription Plan

                    </label>

                    <select
                        name="planId"
                        value={formData.planId}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3"
                    >

                        <option value="">

                            Select Plan

                        </option>

                        {

                            plans.map((plan) => (

                                <option
                                    key={plan._id}
                                    value={plan._id}
                                >

                                    {plan.name} - ₹{plan.price}

                                </option>

                            ))

                        }

                    </select>

                </div>

                <div className="md:col-span-2">

                    <button

                        disabled={loading}

                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"

                    >

                        {

                            loading

                                ? "Adding Student..."

                                : "Add Student"

                        }

                    </button>

                </div>

            </form>

        </div>

    );

};

const Input = ({

    label,

    ...props

}) => (

    <div>

        <label className="block mb-2 font-medium">

            {label}

        </label>

        <input

            {...props}

            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"

        />

    </div>

);

export default AddStudent;