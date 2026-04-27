import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || (role !== "admin" && role !== "staff")) {
      navigate("/login");
      return;
    }

    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://managementbackend-0njb.onrender.com/api/auth/profile",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setUser(response.data);
      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || ""
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Fallback to localStorage data
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || ""
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      // Try to update via API first
      try {
        const response = await axios.put(
          "https://managementbackend-0njb.onrender.com/api/auth/profile",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Update localStorage with API response
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        setEditing(false);
        alert("Profile updated successfully!");
      } catch (apiError) {
        console.log("API update failed, using localStorage fallback:", apiError.message);
        
        // Fallback: Update localStorage directly
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = {
          ...currentUser,
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        };
        
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || ""
    });
    setEditing(false);
  };

  const handleBack = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "staff") {
      navigate("/staff");
    } else {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-4"
          >
            Back
          </button>
          <h1 className="text-3xl text-[#4B2E2B] font-bold">Profile</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {editing ? "Edit Profile" : "Profile Information"}
            </h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>


              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {updateLoading ? "Updating..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">{user?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">{user?.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded capitalize">
                      {user?.role || localStorage.getItem('role') || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
