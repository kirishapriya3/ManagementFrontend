import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyDetails() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    aadhaar: "",
    emergencyContact: "",
    dateOfBirth: "",
    gender: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleBack = () => {
    navigate("/resident");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://managementbackend-0njb.onrender.com/api/users/me",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setForm(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Fields that should allow only numbers
    const numericFields = ["phone", "aadhaar", "emergencyContact"];

    // Fields that should allow only alphabets and spaces
    const alphaFields = ["name"];

    if (numericFields.includes(name)) {
      const numericValue = value.replace(/\D/g, "");

      // Length restrictions
      let maxLength = 10;
      if (name === "aadhaar") maxLength = 12;

      setForm((prev) => ({
        ...prev,
        [name]: numericValue.slice(0, maxLength),
      }));
    } else if (alphaFields.includes(name)) {
      // Allow only alphabets and spaces
      const alphaValue = value.replace(/[^a-zA-Z\s]/g, "");
      
      setForm((prev) => ({
        ...prev,
        [name]: alphaValue,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdate = async () => {
    // Validation before update
    if (!/^[a-zA-Z\s]+$/.test(form.name) || form.name.trim().length < 2) {
      return alert("Name must contain only alphabets and be at least 2 characters");
    }

    if (!/^\d{10}$/.test(form.phone)) {
      return alert("Enter valid 10-digit phone number");
    }

    if (!/^\d{12}$/.test(form.aadhaar)) {
      return alert("Enter valid 12-digit Aadhaar number");
    }

    if (!/^\d{10}$/.test(form.emergencyContact)) {
      return alert("Enter valid emergency contact number");
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "https://managementbackend-0njb.onrender.com/api/users/update",
        form,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Profile Updated ");

      // update localStorage also
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setIsEditing(false);

    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("RESPONSE:", err.response);
      console.log("DATA:", err.response?.data);
      alert("Update failed ");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-4"
        >
          Back
        </button>
        <h1 className="text-2xl text-[#4B2E2B] font-bold">My Details</h1>
      </div>

      <div className="bg-white shadow p-6 rounded space-y-4">
        {/* EDIT BUTTON */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>

        {/* FORM */}
        <div className="space-y-4">
          <div>
            <label className="block font-semibold">Name</label>
            <input
              name="name"
              value={form.name || ""}
              disabled={!isEditing}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold">Email</label>
            <input
              name="email"
              value={form.email || ""}
              disabled={!isEditing}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold">Contact</label>
            <input
              name="phone"
              type="tel"
              value={form.phone || ""}
              disabled={!isEditing}
              onChange={handleChange}
              maxLength={10}
              className="border p-2 w-full"
              placeholder="Enter 10-digit phone"
            />
          </div>

          <div>
            <label className="block font-semibold">Aadhaar No</label>
            <input
              name="aadhaar"
              type="text"
              value={form.aadhaar || ""}
              disabled={!isEditing}
              onChange={handleChange}
              maxLength={12}
              className="border p-2 w-full"
              placeholder="Enter 12-digit Aadhaar"
            />
          </div>

          <div>
            <label className="block font-semibold">Emergency Contact</label>
            <input
              name="emergencyContact"
              type="tel"
              value={form.emergencyContact || ""}
              disabled={!isEditing}
              onChange={handleChange}
              maxLength={10}
              className="border p-2 w-full"
              placeholder="Enter emergency contact"
            />
          </div>

          <div>
            <label className="block font-semibold">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth ? new Date(form.dateOfBirth).toISOString().split('T')[0] : ""}
              disabled={!isEditing}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold">Gender</label>
            <select
              name="gender"
              value={form.gender || ""}
              disabled={!isEditing}
              onChange={handleChange}
              className="border p-2 w-full"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* SAVE BUTTON */}
        {isEditing && (
          <button
            onClick={handleUpdate}
            className="bg-green-500 text-white px-4 py-2"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}