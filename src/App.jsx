import {Routes,Route,useLocation} from "react-router-dom";
import Layout from "./Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBilling from "./pages/AdminBilling";
import AdminFinancial from "./pages/AdminFinancial";
import AdminResidentDetails from "./pages/AdminResidentDetails";
import ResidentDashboard from "./pages/ResidentDashboard";
import MyDetails from "./pages/MyDetails";
import RoomDetails from "./pages/RoomDetails";
import StaffDashboard from "./pages/StaffDashboard";
import ViewRoom from "./pages/ViewRoom";
import Maintenance from "./pages/Maintenance";
import Bills from "./pages/Bills";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Notifications from "./pages/Notifications";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

function App(){
const location = useLocation();

// Show navbar on all pages
const isAuthPage = false;

return(
<>
    {!isAuthPage && <Navbar />}

<Routes>

<Route path="/" element={<Home/>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/register" element={<Register/>}/>
<Route path="/payment/success" element={<PaymentSuccess/>}/>

<Route element={<Layout />}>

<Route path="/admin" element={<AdminDashboard/>}/>
<Route path="/billing" element={<AdminBilling/>}/>
<Route path="/financial" element={<AdminFinancial/>}/>
<Route path="/residents" element={<AdminResidentDetails/>}/>
<Route path="/resident" element={<ResidentDashboard/>}/>
<Route path="/staff" element={<StaffDashboard/>}/>

 <Route path="/my-details" element={<MyDetails />} />
<Route path="/room-details" element={<RoomDetails />} />
<Route path="/room" element={<RoomDetails />} />
<Route path="/view-room" element={<ViewRoom />} />
<Route path="/maintenance" element={<Maintenance />} />
<Route path="/bills" element={<Bills />} />
<Route path="/payment" element={<Payment />} />
<Route path="/notifications" element={<Notifications />} />

</Route>
</Routes>

</>

);
}

export default App;