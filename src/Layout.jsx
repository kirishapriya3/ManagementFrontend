import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout(){

return(

<div className="flex">

  {/* LEFT SIDEBAR */}
  <Sidebar />

  {/* RIGHT CONTENT */}
  <div className="flex-1 p-6 bg-gray-100 min-h-screen ml-64 pt-24">
    <Outlet />
  </div>

</div>

);
}