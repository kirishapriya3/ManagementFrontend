import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ResidentDashboard(){

const [user,setUser] = useState(null);

useEffect(()=>{
  const userData = JSON.parse(localStorage.getItem("user"));
  setUser(userData);
},[]);

return(
<div className="p-8">
  {/* Welcome Section */}
  <div className="bg-[#8C5A3C]  rounded-lg p-8 mb-8 text-white">
    <h1 className="text-4xl font-bold mb-4">
      Welcome to Staymate Hostel, {user?.name || "Resident"}! 🏠
    </h1>
    
    <div className="space-y-3 text-lg">
      <p className="flex items-center">
        <span className="mr-2">�</span>
        We love to have you here at Staymate Hostel!
      </p>
      <p className="flex items-center">
        <span className="mr-2">🤝</span>
        Trust us to provide you with a comfortable and safe living experience.
      </p>
      <p className="flex items-center">
        <span className="mr-2">⭐</span>
        Your stay with us will be memorable - we're committed to making you feel at home!
      </p>
    </div>
    
    <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4">
      <p className="text-xl font-semibold text-center">
        "Home away from home, where memories are made and friendships bloom."
      </p>
    </div>
  </div>

  {/* Quick Actions */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <Link to="/my-details" className="bg-blue-400 text-white p-4 rounded text-center hover:bg-blue-600 transition-colors">
      <div className="text-2xl mb-2">👤</div>
      My Details
    </Link>

    <Link to="/room-details" className="bg-green-600 text-white p-4 rounded text-center hover:bg-green-600 transition-colors">
      <div className="text-2xl mb-2">🏠</div>
      Room Details
    </Link>

    <Link to="/maintenance" className="bg-yellow-600 text-white p-4 rounded text-center hover:bg-yellow-600 transition-colors">
      <div className="text-2xl mb-2">🔧</div>
      Maintenance
    </Link>

    <Link to="/payment" className="bg-purple-600 text-white p-4 rounded text-center hover:bg-purple-600 transition-colors">
      <div className="text-2xl mb-2">💳</div>
      Payments
    </Link>
  </div>

  {/* Additional Welcome Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">📍 Our Location</h3>
      <p className="text-gray-600">
        Located in the heart of the city with easy access to transportation, restaurants, and educational institutions.
      </p>
    </div>
    
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">🛡️ Your Safety</h3>
      <p className="text-gray-600">
        24/7 security, CCTV surveillance, and secure access control ensure your safety and peace of mind.
      </p>
    </div>
    
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">🎯 Our Commitment</h3>
      <p className="text-gray-600">
        We're dedicated to providing you with the best hostel experience possible. Your comfort is our priority!
      </p>
    </div>
  </div>
</div>
);
}