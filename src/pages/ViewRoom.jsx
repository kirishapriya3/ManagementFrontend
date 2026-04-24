import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ResidentSelectionModal from "../components/ResidentSelectionModal";

export default function ViewRoom() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [floorId, setFloorId] = useState(null);
  const [showResidentModal, setShowResidentModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [availableResidents, setAvailableResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  useEffect(() => {
    const floor = searchParams.get('floor');
    if (floor) {
      setFloorId(parseInt(floor));
      fetchRoomsForFloor(parseInt(floor));
    }
  }, [searchParams]);

  const fetchRoomsForFloor = async (floor) => {
    try {
      setRoomsLoading(true);
      const response = await fetch(`https://managementbackend-0njb.onrender.com/api/rooms/floor/${floor}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setRoomsLoading(false);
    }
  };

  const getFloorName = (floor) => {
    const floorNames = {
      1: 'Ground Floor',
      2: 'First Floor',
      3: 'Second Floor'
    };
    return floorNames[floor] || 'Unknown Floor';
  };

  const fetchAvailableResidents = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://managementbackend-0njb.onrender.com/api/residents/available', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAvailableResidents(data);
    } catch (error) {
      console.error('Error fetching available residents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/room-details');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Occupied': return 'bg-red-100 text-red-800';
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRoomClick = (room) => {
    if (room.status === 'Available') {
      setSelectedRoom(room);
      setShowResidentModal(true);
      fetchAvailableResidents();
    } else if (room.status === 'Occupied') {
      setSelectedRoom(room);
      setShowResidentModal(true);
      fetchAvailableResidents();
    }
  };

  const handleResidentSelect = async (residentId) => {
    try {
      const response = await fetch('https://managementbackend-0njb.onrender.com/api/residents/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          residentId,
          roomId: selectedRoom.id
        })
      });

      if (response.ok) {
        alert('Resident assigned to room successfully!');
        setShowResidentModal(false);
        // Refresh the rooms data and residents list
        fetchRoomsForFloor(floorId);
      } else {
        alert('Error assigning resident to room');
      }
    } catch (error) {
      console.error('Error assigning resident:', error);
      alert('Error assigning resident to room');
    }
  };

  const handleUnassignResident = async (residentId, residentName) => {
    console.log('=== UNSASSIGN DEBUG ===');
    console.log('Unassigning resident:', residentId, residentName);

    if (!window.confirm(`Are you sure you want to unassign ${residentName} from the room?`)) {
      return;
    }

    try {
      console.log('Calling unassign API...');
      const response = await fetch('https://managementbackend-0njb.onrender.com/api/residents/unassign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          residentId
        })
      });

      console.log('Unassign API response:', response.status);

      if (response.ok) {
        alert('Resident unassigned successfully!');
        // Refresh the rooms data and residents list
        fetchRoomsForFloor(floorId);
      } else {
        const errorData = await response.json();
        console.log('Unassign error:', errorData);
        alert(`Error unassigning resident: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error unassigning resident:', error);
      alert('Error unassigning resident');
    }
  };

  if (!floorId) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">No Floor Selected</h1>
        <button
          onClick={handleBackClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Floors
        </button>
      </div>
    );
  }

  if (roomsLoading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#4B2E2B]">{getFloorName(floorId)} - Rooms</h1>
          <p className="text-gray-600 mt-2">Select a room to view details</p>
        </div>
        <button
          onClick={handleBackClick}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Floors
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => handleRoomClick(room)}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-200 hover:border-blue-300"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{room.number}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                {room.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-medium">{room.capacity} person{room.capacity > 1 ? 's' : ''}</span>
              </div>

              {room.tenant && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tenants:</span>
                  <span className="font-medium">{room.tenant}</span>
                </div>
              )}

              {room.status === 'Available' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-blue-600 font-medium">Click to assign resident</p>
                </div>
              )}

              {room.status === 'Occupied' && room.occupants && room.occupants.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-red-600 font-medium mb-3">Current Residents:</p>
                  <div className="space-y-2">
                    {room.occupants.map((occupant) => (
                      <div key={occupant._id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <div>
                          <p className="font-medium text-gray-800">{occupant.name}</p>
                          <p className="text-sm text-gray-600">{occupant.email}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnassignResident(occupant._id, occupant.name);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          Unassign
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showResidentModal && (
        <ResidentSelectionModal
          isOpen={showResidentModal}
          onClose={() => setShowResidentModal(false)}
          residents={availableResidents}
          currentResidents={selectedRoom.occupants || []}
          onSelectResident={handleResidentSelect}
          onUnassignResident={handleUnassignResident}
          loading={loading}
          roomNumber={selectedRoom?.number}
        />
      )}
    </div>
  );
}