import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar(){

const navigate = useNavigate();
const location = useLocation();
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

// 🔥 On home page, always show Login/Register
const isHomePage = location.pathname === "/";
const showLoginRegister = isHomePage || !token;

// 🔥 LOGOUT FUNCTION
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");

  navigate("/"); // go to login page
};

return(

<div className="bg-[#4B2E2B] shadow-md px-8 py-10 flex justify-between items-center fixed top-0 left-0 right-0 z-50">

  {/* 🔹 LEFT - HEADING */}
  <h1 className="text-4xl font-bold text-[#FFF8F0]">
    <span className="">StayMate </span>
    <span className="text-[#8C5A3C]">Hostel Management</span>
  </h1>

  {/* 🔹 RIGHT */}
  <div className="flex gap-4 items-center">

    {showLoginRegister ? (
      <>
        <Link 
          to="/login" 
          className="border-2 border-[#FFF8F0] text-[#FFF8F0] px-6 py-2 rounded-lg hover:bg-[#FFF8F0] hover:text-[#4B2E2B] transition-colors font-semibold"
        >
          Login
        </Link>

        <Link 
          to="/register" 
          className="border-2 border-[#FFF8F0] text-[#FFF8F0] px-6 py-2 rounded-lg hover:bg-[#FFF8F0] hover:text-[#4B2E2B] transition-colors font-semibold"
        >
          Register
        </Link>
      </>
    ) : (
      <>
        {/* ✅ USER NAME */}
         <span className="text-[#FFF8F0] font-medium text-2xl">
          Welcome, <span className="">{user?.name}</span>
        </span>
      <button
        onClick={handleLogout}
        className="bg-[#FFF8F0] text-[#4B2E2B] px-4 py-2 rounded hover:bg-[#C08552] transition"
      >
        Logout
      </button>
       </>
    )}

  </div>

</div>

);
}