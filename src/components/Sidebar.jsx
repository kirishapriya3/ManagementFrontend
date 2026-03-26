import { Link } from "react-router-dom";

export default function Sidebar(){

const role = localStorage.getItem("role");

return(

<div className="w-64 h-screen bg-[#4B2E2B] text-white p-6 fixed left-0 top-28 overflow-y-auto">

  <h2 className="text-xl font-bold mb-6">Dashboard</h2>

  <div className="flex flex-col gap-4">

    {/* 👑 ADMIN */}
    {role === "admin" && (
      <>
        <Link to="/admin" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/room-details" className="hover:text-blue-400">Room Allocation</Link>
        <Link to="/maintenance" className="hover:text-blue-400">Maintenance</Link>
        <Link to="/billing" className="hover:text-blue-400">Billing Overview</Link>
        <Link to="/financial" className="hover:text-blue-400">Financial Reports</Link>
        <Link to="/residents" className="hover:text-blue-400">Resident Details</Link>
        {/* <Link to="/reports" className="hover:text-blue-400">Analytics</Link> */}
      </>
    )}

    {/* 🛠️ STAFF */}
    {role === "staff" && (
      <>
        <Link to="/staff" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/room-details" className="hover:text-blue-400">Room Allocation</Link>
        <Link to="/maintenance" className="hover:text-blue-400">Maintenance</Link>
        <Link to="/billing" className="hover:text-blue-400">Billing</Link>
        <Link to="/residents" className="hover:text-blue-400">Residents</Link>
      </>
    )}

    {/* 🏠 RESIDENT */}
    {role === "resident" && (
      <>
        <Link to="/resident" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/my-details" className="hover:text-blue-400">My Details</Link>
        <Link to="/room-details" className="hover:text-blue-400">Room Details</Link>
        <Link to="/maintenance" className="hover:text-blue-400">Maintenance</Link>
        <Link to="/payment" className="hover:text-blue-400">Payments</Link>
        {/* <Link to="/bills" className="hover:text-blue-400">Billing</Link> */}
      </>
    )}

  </div>

</div>

);
}