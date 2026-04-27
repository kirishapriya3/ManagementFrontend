import {Routes,Route,useLocation} from "react-router-dom";
import { Navigate } from "react-router-dom";
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
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

// 🔒 Private Route (protect pages)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

// 🚫 Public Route (block login if already logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role) {
    if (role === "admin") return <Navigate to="/admin" />;
    if (role === "staff") return <Navigate to="/staff" />;
    if (role === "resident") return <Navigate to="/resident" />;
  }

  return children;
};

function App(){
const location = useLocation();

// Show navbar on all pages
const isAuthPage = false;

return(
<>
    {!isAuthPage && <Navbar />}

<Routes>

<Route path="/" element={
  <PublicRoute>
    <Home />
  </PublicRoute>
} />

<Route path="/login" element={
  <PublicRoute>
    <Login />
  </PublicRoute>
} />

<Route path="/register" element={
  <PublicRoute>
    <Register />
  </PublicRoute>
} />

<Route path="/payment/success" element={<PaymentSuccess/>}/>

<Route element={
  <PrivateRoute>
    <Layout />
  </PrivateRoute>
}>

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
<Route path="/profile" element={<Profile />} />

</Route>
</Routes>

</>

);
}

export default App;