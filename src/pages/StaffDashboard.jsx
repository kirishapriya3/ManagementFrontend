import { useNavigate } from "react-router-dom";

export default function StaffDashboard(){
const navigate = useNavigate();

const handleBilling = () => {
  navigate('/billing');
};

return(
<div className="p-10">
  {/* Welcome Section */}
     <h1 className="text-3xl font-bold mb-6 text-[#4B2E2B]">Staff Dashboard</h1>

  <button
    className="bg-blue-500 text-white px-4 py-2 mb-6"
    onClick={handleBilling}
  >
    Send Billing Reminder
  </button>

  <div className="bg-[#8C5A3C] rounded-lg p-8 mb-8 text-white">
    <h1 className="text-4xl font-bold mb-4">
      Welcome Back, Staff Member! 
    </h1>
    
    <div className="space-y-3 text-lg">
      <p className="flex items-center">
        <span className="mr-2">🛡️</span>
        This is your duty to keep our residents safe and comfortable.
      </p>
      <p className="flex items-center">
        <span className="mr-2">💙</span>
        Make them feel secure, valued, and truly at home.
      </p>
      <p className="flex items-center">
        <span className="mr-2">⭐</span>
        Your dedication creates the foundation for their success and well-being.
      </p>
    </div>
    
    <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4">
      <p className="text-xl font-semibold text-center">
        "Happy working! Your efforts today shape the bright futures of our residents tomorrow."
      </p>
    </div>
  </div>
</div>
);
}