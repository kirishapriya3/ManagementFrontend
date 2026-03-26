import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function RoomDetails(){
const navigate = useNavigate();
const [user, setUser] = useState(null);
const [userRole, setUserRole] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  // Get user data from localStorage
  const userData = localStorage.getItem('user');
  const role = localStorage.getItem('role');
  
  setUserRole(role);
  
  if (userData && role === 'resident') {
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
  }
  setLoading(false);
}, []);

const floors = [
  { id: 1, name: "Ground Floor", rooms: 2 },
  { id: 2, name: "First Floor", rooms: 1 },
  { id: 3, name: "Second Floor", rooms: 1 }
];

const handleFloorClick = (floorId) => {
  navigate(`/view-room?floor=${floorId}`);
};

const handleBack = () => {
  const role = localStorage.getItem('role');
  if (role === 'resident') {
    navigate('/resident');
  } else if (role === 'admin') {
    navigate('/admin');
  } else if (role === 'staff') {
    navigate('/staff');
  } else {
    navigate('/login');
  }
};

if (loading) {
  return (
    <div className="p-8">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

return(
<div className="p-8">
<div className="mb-8">
  <div className="flex items-center mb-4">
    <button
      onClick={handleBack}
      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-4"
    >
      Back
    </button>
    <h1 className="text-3xl font-bold text-[#4B2E2B]">
      {userRole === 'resident' ? 'Your Room' : 'Room Management'}
    </h1>
  </div>
  
  {/* Resident Room Assignment Display */}
  {userRole === 'resident' && user && (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-[#4B2E2B] mb-4">Your Room Assignment</h2>
      <div className="flex items-center">
        <div className="flex-1">
          {user.roomNumber && user.roomNumber !== '' && user.roomNumber !== null ? (
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-green-600">{user.roomNumber}</span>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-800">Room {user.roomNumber}</p>
                <p className="text-sm text-gray-600">
                  Assigned Room
                  {user.checkInDate && ` • Checked in: ${new Date(user.checkInDate).toLocaleDateString()}`}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-gray-400">?</span>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-800">Not yet assigned</p>
                <p className="text-sm text-gray-600">You haven't been assigned to any room yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )}
</div>

{/* Floor Selection - Only for Admin and Staff */}
{(userRole === 'admin' || userRole === 'staff') && (
  <>
    <h2 className="text-2xl font-bold mb-6 text-[#4B2E2B]">Select Floor</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {floors.map((floor) => (
        <div
          key={floor.id}
          onClick={() => handleFloorClick(floor.id)}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-200 hover:border-blue-300"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-600">{floor.id}</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{floor.name}</h2>
            <p className="text-gray-600">{floor.rooms} Rooms</p>
          </div>
        </div>
      ))}
    </div>
  </>
)}

{/* Resident-only message if no room assigned */}
{userRole === 'resident' && !user?.roomNumber && (
  <div className="mt-8 text-center">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Waiting for Room Assignment</h3>
      <p className="text-gray-600">Please contact the administrator to get assigned to a room.</p>
    </div>
  </div>
)}
</div>
);
}