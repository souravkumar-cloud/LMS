import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import seatService from "../../services/seatService";

const EditSeat = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({

        seatNumber: "",

        floor: "",

        category: "regular",

        status: "available",

        remarks: ""

    });

    const fetchSeat = async () => {

        try {

            const res = await seatService.getSeatById(id);

            const seat = res.seat;

            setFormData({

                seatNumber: seat.seatNumber,

                floor: seat.floor,

                category: seat.category,

                status: seat.status,

                remarks: seat.remarks || ""

            });

        }

        catch (error) {

            console.log(error);

            toast.error("Unable to load seat");

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchSeat();

    }, []);

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            await seatService.updateSeat(

                id,

                formData

            );

            toast.success(

                "Seat Updated Successfully"

            );

            navigate("/admin/manage-seats");

        }

        catch (error) {

    console.log(error.response?.data);

    toast.error(
        error.response?.data?.message || "Something went wrong"
    );

}

        finally {

            setSaving(false);

        }

    };

    if (loading) {

        return <Loader text="Loading Seat..." />;

    }

    return (

    <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-xl shadow-lg p-8">

            <h1 className="text-3xl font-bold mb-8">

                Edit Seat

            </h1>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >

                {/* Seat Number */}

                <div>

                    <label className="block mb-2 font-medium">

                        Seat Number

                    </label>

                    <input
                        type="number"
                        name="seatNumber"
                        value={formData.seatNumber}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                    />

                </div>

                {/* Floor */}

                <div>

                    <label className="block mb-2 font-medium">

                        Floor

                    </label>

                    <select
                        name="floor"
                        value={formData.floor}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                    >

                        <option value="1">
                            First Floor
                        </option>

                        <option value="2">
                            Second Floor
                        </option>

                    </select>

                </div>

                {/* Category */}

                <div>

                    <label className="block mb-2 font-medium">

                        Category

                    </label>

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                    >

                        <option value="regular">

                            Regular

                        </option>

                        <option value="premium">

                            Premium

                        </option>

                    </select>

                </div>

                {/* Status */}

                <div>

                    <label className="block mb-2 font-medium">

                        Status

                    </label>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                    >

                        <option value="available">

                            Available

                        </option>

                        <option value="occupied">

                            Occupied

                        </option>

                        <option value="hold">

                            Hold

                        </option>

                    </select>

                </div>

                {/* Remarks */}

                <div className="md:col-span-2">

                    <label className="block mb-2 font-medium">

                        Remarks

                    </label>

                    <textarea
                        rows="5"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        placeholder="Any remarks..."
                        className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-blue-600 outline-none"
                    />

                </div>

                {/* Preview */}

                <div className="md:col-span-2">

                    <div className="bg-gray-50 rounded-xl p-5 border">

                        <h2 className="text-lg font-semibold mb-4">

                            Seat Preview

                        </h2>

                        <div className="grid md:grid-cols-4 gap-4">

                            <div>

                                <p className="text-gray-500 text-sm">

                                    Seat Number

                                </p>

                                <p className="font-bold text-xl">

                                    {formData.seatNumber}

                                </p>

                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">

                                    Floor

                                </p>

                                <p className="font-bold">

                                    {formData.floor}

                                </p>

                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">

                                    Category

                                </p>

                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        formData.category === "premium"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-blue-100 text-blue-700"
                                    }`}
                                >

                                    {formData.category}

                                </span>

                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">

                                    Status

                                </p>

                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        formData.status === "available"
                                            ? "bg-green-100 text-green-700"
                                            : formData.status === "occupied"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-orange-100 text-orange-700"
                                    }`}
                                >

                                    {formData.status}

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Buttons */}

                <div className="md:col-span-2 flex justify-end gap-4">

                    <button
                        type="button"
                        onClick={() => navigate("/admin/manage-seats")}
                        className="px-8 py-3 rounded-lg bg-gray-300 hover:bg-gray-400"
                    >

                        Cancel

                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        onClick={() => navigate("/admin/manage-seats")}
                        className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                    >

                        {

                            saving

                                ? "Updating..."

                                : "Update Seat"

                        }

                    </button>

                </div>

            </form>

        </div>

    </div>

);
}

export default EditSeat;