import { useState, useEffect } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login(){

const navigate = useNavigate();

const [form,setForm] = useState({
 email:"",
 password:""
});

const [showPassword, setShowPassword] = useState(false);

const handleChange = (e)=>{
 setForm({...form,[e.target.name]:e.target.value});
};

const togglePassword = () => {
  setShowPassword(!showPassword);
};

const handleBack = () => {
  console.log("Back button clicked");
  navigate("/");
};

useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role) {
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "resident") {
      navigate("/resident");
    } else if (role === "staff") {
      navigate("/staff");
    }
  }
}, [navigate]);

const handleSubmit = async(e)=>{
 e.preventDefault();

 try{

 const res = await loginUser(form);

 console.log("LOGIN RESPONSE:",res.data);

 const token = res.data.token;
 const role = res.data.user.role;

 localStorage.setItem("token", res.data.token);
 localStorage.setItem("role",role);
 localStorage.setItem("user", JSON.stringify(res.data.user));

 if(role === "admin"){
  navigate("/admin");
 }
 else if(role === "resident"){
  navigate("/resident");
 }
 else if(role === "staff"){
  navigate("/staff");
 }

 }catch(error){

 console.log("LOGIN ERROR:",error.response?.data);

 alert(error.response?.data?.message || "Login failed");

 }
};

return(
<div className="flex justify-center items-center h-screen relative bg-[#4B2E2B] ">
  {/* Back Button */}
  <button
    onClick={handleBack}
    className="absolute top-4 left-4 px-4 py-2 mt-40 rounded hover:opacity-80 transition-all flex items-center gap-2 bg-[#FFF8F0] text-[#4B2E2B] z-10"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    Back
  </button>
 
  {/* Welcome Message */}
  <div className="absolute top-4 left-0 right-0 text-center mt-40">
    <h1 className="text-3xl font-bold mb-2 text-[#FFF8F0]">
      Hey, Welcome back to Login! 
    </h1>
    <p className="text-lg text-[#FFF8F0]">
      Ready to go! Let's get you signed in.
    </p>
  </div>

<form onSubmit={handleSubmit} className="p-8 shadow-xl w-96 mt-48 bg-[#FFF8F0]">

<h2 className="text-2xl mb-4 text-center text-[#4B2E2B]">Login</h2>

<input
name="email"
placeholder="Email"
className="border p-2 w-full mb-3 border-[#4B2E2B] text-[#4B2E2B]"
onChange={handleChange}
/>

<div className="relative mb-3 ">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    className="border p-2 w-full pr-10 border-[#4B2E2B] text-[#4B2E2B]"
    onChange={handleChange}
  />
  <button
    type="button"
    onClick={togglePassword}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:opacity-70 focus:outline-none text-[#4B2E2B]"
  >
    {showPassword ? (
      // Eye slash icon (hide password)
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ) : (
      // Eye icon (show password)
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )}
  </button>
</div>

<button type="submit" className="p-2 w-full transition-all hover:opacity-90  bg-[#4B2E2B] text-white">
Login
</button>

<p className="mt-3 text-[#4B2E2B]">
Don't have account?
<a href="/register" className="ml-1 hover:opacity-70 transition-all text-bold text-[#4B2E2B]">Register</a>
</p>

</form>
</div>
);
}