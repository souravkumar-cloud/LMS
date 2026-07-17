import { useState } from "react";
import toast from "react-hot-toast";
import { changePassword } from "../../services/authService";

const ChangePassword = () => {
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (data.newPassword !== data.confirmPassword) {
      return toast.error("New password and confirm password do not match");
    }

    setLoading(false);
    try {
      const response = await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });
      toast.success(response.message || "Password changed successfully");
      setData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change Password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl pb-24 lg:pb-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 sm:p-8 animate-fade-up">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-600">Security</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-800">Change Password</h2>
        <p className="mt-2 text-sm text-slate-500">Update your password regularly to keep your account protected.</p>

        <div className="mt-6 grid gap-4">
          {[
            ["oldPassword", "Old Password"],
            ["newPassword", "New Password"],
            ["confirmPassword", "Confirm Password"],
          ].map(([name, label]) => (
            <label key={name} className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
              <input 
                className="w-full border rounded-lg py-2.5 px-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" 
                type="password" 
                name={name} 
                placeholder={label} 
                value={data[name]} 
                onChange={handleChange} 
                required 
              />
            </label>
          ))}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg mt-6 active:scale-95 transition cursor-pointer disabled:opacity-50"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
