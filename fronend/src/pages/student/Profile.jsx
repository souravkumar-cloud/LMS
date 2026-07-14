import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import profileService from "../../services/profileService";

const Profile = () => {

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState("");

    const [formData, setFormData] = useState({

        fullName: "",
        email: "",
        phone: "",
        aadhaar: "",
        gender: "Male",
        address: "",
        emergencyContact: "",
        profilePhoto: null

    });

    const fetchProfile = async () => {

        try {

            const res = await profileService.getProfile();

            const user = res.user;

            setFormData({

                fullName: user.fullName || "",
                email: user.email || "",
                phone: user.phone || "",
                aadhaar: user.aadhaar || "",
                gender: user.gender || "Male",
                address: user.address || "",
                emergencyContact: user.emergencyContact || "",
                profilePhoto: null

            });

            setPreview(user.profilePhoto || "");

        } catch {

            toast.error("Unable to load profile");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchProfile();

    }, []);

    const handleChange = (e) => {

        setFormData({

            ...formData,

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

            await profileService.updateProfile(data);

            toast.success("Profile Updated Successfully");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to update profile"
            );

        } finally {

            setSaving(false);

        }

    };

    if (loading) {

        return <Loader text="Loading Profile..." />;

    }

    return (

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

            <h1 className="text-3xl font-bold mb-8">
                My Profile
            </h1>

            <form
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-6"
            >

                <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                />

                <Input
                    label="Email"
                    name="email"
                    value={formData.email}
                    disabled
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
                    disabled
                />

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

                        <option value="Male">
                            Male
                        </option>

                        <option value="Female">
                            Female
                        </option>

                        <option value="Other">
                            Other
                        </option>

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
                        rows="4"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    />

                </div>

                <div className="md:col-span-2">

                    <label className="block mb-2 font-medium">
                        Profile Photo
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                    />

                    {preview && (

                        <img
                            src={preview}
                            alt="Preview"
                            className="w-32 h-32 rounded-full object-cover mt-5 border"
                        />

                    )}

                </div>

                <div className="md:col-span-2">

                    <button
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
                    >

                        {saving
                            ? "Saving..."
                            : "Update Profile"}

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
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
        />

    </div>

);

export default Profile;