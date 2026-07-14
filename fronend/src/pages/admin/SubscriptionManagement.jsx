import { useEffect, useState } from "react";
import {
    Crown,
    Plus,
    Pencil,
    Trash2
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import subscriptionService from "../../services/subscriptionService";

const SubscriptionManagement = () => {

    const [loading, setLoading] = useState(true);

    const [plans, setPlans] = useState([]);

    const [formData, setFormData] = useState({

        name: "",

        category: "regular",

        accessType: "full-day",

        durationInDays: 30,

        hoursPerDay: 14,

        price: ""

    });

    const fetchPlans = async () => {

        try {

            const res = await subscriptionService.getPlans();

            setPlans(res.plans);

        }

        catch {

            toast.error("Unable to load plans.");

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchPlans();

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

            await subscriptionService.createPlan(formData);

            toast.success("Plan Created");

            fetchPlans();

            setFormData({

                name: "",

                category: "regular",

                accessType: "full-day",

                durationInDays: 30,

                hoursPerDay: 14,

                price: ""

            });

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to create plan"

            );

        }

    };

    const deletePlan = async (id) => {

        if (!window.confirm("Delete this plan?")) return;

        try {

            await subscriptionService.deletePlan(id);

            toast.success("Plan Deleted");

            fetchPlans();

        }

        catch {

            toast.error("Unable to delete");

        }

    };

    if (loading) {

        return <Loader text="Loading Subscription Plans..." />;

    }

    return (

        <div className="space-y-8">

            <div className="flex items-center gap-3">

                <Crown className="text-yellow-500"/>

                <h1 className="text-3xl font-bold">

                    Subscription Management

                </h1>

            </div>

            {/* Create Plan */}

            <div className="bg-white rounded-xl shadow p-6">

                <form

                    onSubmit={handleSubmit}

                    className="grid md:grid-cols-3 gap-5"

                >

                    <input

                        type="text"

                        name="name"

                        placeholder="Plan Name"

                        value={formData.name}

                        onChange={handleChange}

                        className="border rounded-lg px-4 py-3"

                        required

                    />

                    <select

                        name="category"

                        value={formData.category}

                        onChange={handleChange}

                        className="border rounded-lg px-4 py-3"

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

                    <select

                        name="accessType"

                        value={formData.accessType}

                        onChange={handleChange}

                        className="border rounded-lg px-4 py-3"

                    >

                        <option value="full-day">

                            Full Day

                        </option>

                        <option value="hourly">

                            Hourly

                        </option>

                    </select>

                    <input

                        type="number"

                        name="durationInDays"

                        placeholder="Duration"

                        value={formData.durationInDays}

                        onChange={handleChange}

                        className="border rounded-lg px-4 py-3"

                    />

                    <input

                        type="number"

                        name="hoursPerDay"

                        placeholder="Hours"

                        value={formData.hoursPerDay}

                        onChange={handleChange}

                        className="border rounded-lg px-4 py-3"

                    />

                    <input

                        type="number"

                        name="price"

                        placeholder="Price"

                        value={formData.price}

                        onChange={handleChange}

                        className="border rounded-lg px-4 py-3"

                    />

                    <div className="md:col-span-3">

                        <button

                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"

                        >

                            <Plus size={18}/>

                            Create Plan

                        </button>

                    </div>

                </form>

            </div>

            {/* Plans Table */}

            <div className="bg-white rounded-xl shadow overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="py-4">

                                Plan

                            </th>

                            <th>

                                Category

                            </th>

                            <th>

                                Access

                            </th>

                            <th>

                                Duration

                            </th>

                            <th>

                                Price

                            </th>

                            <th>

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            plans.map((plan)=>(

                                <tr

                                    key={plan._id}

                                    className="border-t text-center"

                                >

                                    <td>

                                        {plan.name}

                                    </td>

                                    <td>

                                        {plan.category}

                                    </td>

                                    <td>

                                        {plan.accessType}

                                    </td>

                                    <td>

                                        {plan.durationInDays} Days

                                    </td>

                                    <td>

                                        ₹ {plan.price}

                                    </td>

                                    <td>

                                        <div className="flex justify-center gap-2">

                                            <button

                                                className="bg-blue-500 text-white p-2 rounded"

                                            >

                                                <Pencil size={18}/>

                                            </button>

                                            <button

                                                onClick={()=>deletePlan(plan._id)}

                                                className="bg-red-500 text-white p-2 rounded"

                                            >

                                                <Trash2 size={18}/>

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

};

export default SubscriptionManagement;