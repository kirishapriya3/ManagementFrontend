import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminResidentDetails() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin or staff
    const role = localStorage.getItem("role");
    if (role !== "admin" && role !== "staff") {
      navigate("/login");
      return;
    }
    fetchResidents();
  }, [navigate]);

  const handleBack = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "staff") {
      navigate("/staff");
    } else {
      navigate("/login");
    }
  };

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://managementbackend-0njb.onrender.com/api/residents",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setResidents(response.data);
    } catch (error) {
      console.error("Error fetching residents:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResidentDetails = async (residentId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://managementbackend-0njb.onrender.com/api/residents/${residentId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSelectedResident(response.data);
    } catch (error) {
      console.error("Error fetching resident details:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResidents = residents.filter(resident =>
    resident.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.phone?.includes(searchTerm) ||
    resident.roomNumber?.toString().includes(searchTerm)
  );

  if (loading && !selectedResident) {
    return (
      <div className="p-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading residents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-4"
          >
            Back
          </button>
          <h1 className="text-3xl text-[#4B2E2B] font-bold">Resident Details Management</h1>
        </div>
        <button
          onClick={() => setSelectedResident(null)}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back to List
        </button>
      </div>

      {selectedResident ? (
        // Resident Details View
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Resident Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h3>

              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Name:</span>
                  <span className="ml-2 text-gray-900">{selectedResident.name}</span>
                </div>

                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-900">{selectedResident.email}</span>
                </div>

                <div>
                  <span className="font-medium text-gray-600">Phone:</span>
                  <span className="ml-2 text-gray-900">{selectedResident.phone}</span>
                </div>

                <div>
                  <span className="font-medium text-gray-600">Aadhaar Number:</span>
                  <span className="ml-2 text-gray-900">{selectedResident.aadhaar || 'N/A'}</span>
                </div>

                <div>
                  <span className="font-medium text-gray-600">Date of Birth:</span>
                  <span className="ml-2 text-gray-900">
                    {selectedResident.dateOfBirth ? new Date(selectedResident.dateOfBirth).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="font-medium text-gray-600">Gender:</span>
                  <span className="ml-2 text-gray-900">
                    {selectedResident.gender ? selectedResident.gender.charAt(0).toUpperCase() + selectedResident.gender.slice(1) : 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="font-medium text-gray-600">Emergency Contact:</span>
                  <span className="ml-2 text-gray-900">{selectedResident.emergencyContact || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Room Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Room Information</h3>

              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Room Number:</span>
                  <span className="ml-2 text-gray-900">{selectedResident.roomId?.roomNumber || 'N/A'}</span>
                </div>

                <div>
                  <span className="font-medium text-gray-600">Room Capacity:</span>
                  <span className="ml-2 text-gray-900">
                    {selectedResident.roomId?.capacity ? `${selectedResident.roomId.capacity} persons` : 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="font-medium text-gray-600">Check-in Date:</span>
                  <span className="ml-2 text-gray-900">
                    {selectedResident.checkInDate ? new Date(selectedResident.checkInDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="font-medium text-gray-600">Check-out Date:</span>
                  <span className="ml-2 text-gray-900">
                    {selectedResident.checkOutDate ? new Date(selectedResident.checkOutDate).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* Academic/Professional Information */}
            {/* <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Additional Information</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Occupation:</span>
                  <span className="ml-2 text-gray-900">{selectedResident.occupation || 'N/A'}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-600">Institution:</span>
                  <span className="ml-2 text-gray-900">{selectedResident.institution || 'N/A'}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-600">ID Proof Type:</span>
                  <span className="ml-2 text-gray-900">{selectedResident.idProofType || 'N/A'}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-600">ID Proof Number:</span>
                  <span className="ml-2 text-gray-900">{selectedResident.idProofNumber || 'N/A'}</span>
                </div>
              </div>
            </div> */}

            {/* Account Information */}
            {/* <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Account Information</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Account Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                    selectedResident.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedResident.status || 'Active'}
                  </span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-600">Registration Date:</span>
                  <span className="ml-2 text-gray-900">
                    {selectedResident.createdAt ? new Date(selectedResident.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-600">Last Updated:</span>
                  <span className="ml-2 text-gray-900">
                    {selectedResident.updatedAt ? new Date(selectedResident.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div> */}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate(`/billing?resident=${selectedResident._id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Billing
            </button>

            <button
              onClick={() => navigate(`/maintenance?resident=${selectedResident._id}`)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              View Maintenance
            </button>

            <button
              onClick={() => window.print()}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Print Details
            </button>
          </div>
        </div>
      ) : (
        // Residents List View
        <div className="bg-white rounded-lg shadow-md border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">All Residents</h2>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search residents..."
                className="border px-3 py-2 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <button
                onClick={fetchResidents}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {filteredResidents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResidents.map((resident) => (
                    <tr key={resident._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{resident.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{resident.roomId?.roomNumber || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {resident.roomId?.capacity ? `${resident.roomId.capacity} persons` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${resident.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {resident.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => fetchResidentDetails(resident._id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm ? 'No residents found matching your search' : 'No residents found'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
