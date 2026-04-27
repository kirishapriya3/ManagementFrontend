import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case 'name':
        if (!value) {
          error = "Name is required";
        } else if (!/^[A-Za-z0-9\s]+$/.test(value)) {
          error = "Name should contain only alphabets and numbers";
        } else if (value.length < 2) {
          error = "Name should be at least 2 characters";
        }
        break;
      
      case 'email':
        if (!value) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      
      case 'password':
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password should be at least 6 characters";
        } else if (!/^[A-Za-z0-9]+$/.test(value)) {
          error = "Password should contain only alphabets and numbers";
        }
        break;
      
      case 'phone':
        if (!value) {
          error = "Phone number is required";
        } else if (!/^[0-9]{10}$/.test(value)) {
          error = "Phone number should be exactly 10 digits";
        }
        break;
      
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear previous error for this field
    setErrors(prev => ({ ...prev, [name]: "" }));
    
    // Validate field
    const error = validateField(name, value);
    
    // Update form and errors
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Validate all fields before submission
    const nameError = validateField('name', form.name);
    const emailError = validateField('email', form.email);
    const passwordError = validateField('password', form.password);
    const phoneError = validateField('phone', form.phone);

    // Update all errors
    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      phone: phoneError
    });

    // Check if there are any errors
    if (nameError || emailError || passwordError || phoneError) {
      return;
    }

    try {

      await axios.post(
        "https://managementbackend-0njb.onrender.com/api/auth/register",
        form
      );

      alert("User Registered Successfully");

      navigate("/login");

    } catch (error) {

      console.log(error.response?.data);

      alert("Registration failed");

    }

  };

  return (
    <div className="flex justify-center items-center min-h-screen relative bg-[#4B2E2B] mt-10 py-20">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-20 px-4 py-2 mt-20 rounded hover:opacity-80 transition-all flex items-center gap-2 bg-[#FFF8F0] text-[#4B2E2B]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <form onSubmit={handleSubmit} className="border p-6 space-y-4 w-80 bg-[#FFF8F0] shadow-xl rounded-lg mt-16">

        <h2 className="text-xl font-bold text-[#4B2E2B]">Register</h2>

        <input
          name="name"
          placeholder="Name"
          className={`border p-2 w-full border-[#4B2E2B] text-[#4B2E2B] ${errors.name ? 'border-red-500' : ''}`}
          onChange={handleChange}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}

        <input
          name="email"
          placeholder="Email"
          className={`border p-2 w-full border-[#4B2E2B] text-[#4B2E2B] ${errors.email ? 'border-red-500' : ''}`}
          onChange={handleChange}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}

        <input
          name="password"
          type="password"
          placeholder="Password"
          className={`border p-2 w-full border-[#4B2E2B] text-[#4B2E2B] ${errors.password ? 'border-red-500' : ''}`}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}

        <input
          name="phone"
          placeholder="Phone Number"
          className={`border p-2 w-full border-[#4B2E2B] text-[#4B2E2B] ${errors.phone ? 'border-red-500' : ''}`}
          onChange={handleChange}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}

        <select
          name="role"
          className="border p-2 w-full border-[#4B2E2B] text-[#4B2E2B]"
          onChange={handleChange}
        >
          <option value="" className="text-gray-800">Select Role</option>
          <option value="admin" className="text-gray-800">Admin</option>
          <option value="resident" className="text-gray-800">Resident</option>
          <option value="staff" className="text-gray-800">Staff</option>
        </select>

        <button
          type="submit"
          className="bg-[#4B2E2B] text-white px-4 py-2 w-full transition-all hover:opacity-90"
        >
          Register
        </button>

        <p className="text-[#4B2E2B]">
          Already a user?
          <Link to="/login" className="text-[#4B2E2B] ml-1 hover:opacity-70 transition-all">
            Login
          </Link>
        </p>

      </form>

    </div>

  );
}