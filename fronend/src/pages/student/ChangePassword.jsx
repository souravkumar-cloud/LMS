import axios from "axios";
import { useState } from "react";

const ChangePassword = () => {
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("http://localhost:5000/api/auth/change-password", data, {
        headers: { Authorization: token },
      });
      alert(response.data.message);
      setData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change Password");
    }
  }

  return (
    <div className="mx-auto max-w-3xl pb-24 lg:pb-8">
      <form onSubmit={handleSubmit} className="glass-panel animate-fade-up rounded-lg p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-600">Security</p>
        <h2 className="mt-2 section-title">Change Password</h2>
        <p className="mt-2 muted-text">Update your password regularly to keep your account protected.</p>

        <div className="mt-6 grid gap-4">
          {[
            ["oldPassword", "Old Password"],
            ["newPassword", "New Password"],
            ["confirmPassword", "Confirm Password"],
          ].map(([name, label]) => (
            <label key={name}>
              <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
              <input className="field-input" type="password" name={name} placeholder={label} value={data[name]} onChange={handleChange} required />
            </label>
          ))}
        </div>

        <button type="submit" className="primary-button mt-6">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
