import { useState } from "react";
import { Armchair, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

import seatService from "../../services/seatService";

const AddSeat = () => {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        seatNumber: "",

        floor: 1,

        category: "regular",

        accessType: "full-day",

        status: "available"

    });

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await seatService.addSeat(formData);

            toast.success("Seat Added Successfully");

            setFormData({

                seatNumber: "",

                floor: 1,

                category: "regular",

                accessType: "full-day",

                status: "available"

            });

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to add seat"

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="max-w-4xl mx-auto">

            <div className="bg-white rounded-xl shadow-lg p-8">

                <div className="flex items-center gap-3 mb-8">

                    <Armchair

                        className="text-blue-600"

                        size={30}

                    />

                    <h1 className="text-3xl font-bold">

                        Add New Seat

                    </h1>

                </div>

                <form

                    onSubmit={handleSubmit}

                    className="grid md:grid-cols-2 gap-6"

                >

                    {/* Seat Number */}

                    <div>

                        <label className="block mb-2 font-medium">

                            Seat Number

                        </label>

                        <input

                            type="text"

                            name="seatNumber"

                            value={formData.seatNumber}

                            onChange={handleChange}

                            placeholder="Example : A-101"

                            required

                            className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"

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

                            className="w-full rounded-lg border px-4 py-3"

                        >

                            <option value={1}>First Floor</option>

                            <option value={2}>Second Floor</option>

                            <option value={3}>Third Floor</option>

                        </select>

                    </div>

                    {/* Category */}

                    <div>

                        <label className="block mb-2 font-medium">

                            Seat Category

                        </label>

                        <select

                            name="category"

                            value={formData.category}

                            onChange={handleChange}

                            className="w-full rounded-lg border px-4 py-3"

                        >

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

                    {/* Access Type */}

                    <div>

                        <label className="block mb-2 font-medium">

                            Access Type

                        </label>

                        <select

                            name="accessType"

                            value={formData.accessType}

                            onChange={handleChange}

                            className="w-full rounded-lg border px-4 py-3"

                        >

                            <option value="full-day">

                                Full Day (8 AM - 10 PM)

                            </option>

                            <option value="hourly">

                                Hourly

                            </option>

                        </select>

                    </div>

                    {/* Status */}

                    <div>

                        <label className="block mb-2 font-medium">

                            Seat Status

                        </label>

                        <select

                            name="status"

                            value={formData.status}

                            onChange={handleChange}

                            className="w-full rounded-lg border px-4 py-3"

                        >

                            <option value="available">

                                Available

                            </option>

                            <option value="maintenance">

                                Under Maintenance

                            </option>

                        </select>

                    </div>

                    {/* Information */}

                    <div className="rounded-lg bg-blue-50 p-5 border border-blue-200">

                        <h3 className="font-semibold text-blue-700 mb-3">

                            Library Rules

                        </h3>

                        <ul className="space-y-2 text-sm text-gray-600">

                            <li>

                                • Full-Day Seat Timing: 8:00 AM – 10:00 PM

                            </li>

                            <li>

                                • Hourly Seats work according to subscription.

                            </li>

                            <li>

                                • One student can occupy only one seat.

                            </li>

                            <li>

                                • Premium seats require Premium Subscription.

                            </li>

                        </ul>

                    </div>

                    <div className="md:col-span-2 flex justify-end">

                        <button

                            type="submit"

                            disabled={loading}

                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2"

                        >

                            <PlusCircle size={20} />

                            {

                                loading

                                ?

                                "Adding..."

                                :

                                "Add Seat"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default AddSeat;