import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register(){

  const navigate = useNavigate();

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:"",
    role:"",
    phone:""
  });

  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    });
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleSubmit = async(e)=>{

    e.preventDefault();

    try{

      await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      alert("User Registered Successfully");

      navigate("/login");

    }catch(error){

      console.log(error.response?.data);

      alert("Registration failed");

    }

  };

  return(
    <div className="flex justify-center items-center h-screen relative bg-[#4B2E2B] mt-10">
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
          className="border p-2 w-full border-[#4B2E2B] text-[#4B2E2B]"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="border p-2 w-full border-[#4B2E2B] text-[#4B2E2B]"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 w-full border-[#4B2E2B] text-[#4B2E2B]"
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          className="border p-2 w-full border-[#4B2E2B] text-[#4B2E2B]"
          onChange={handleChange}
        />

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