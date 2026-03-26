export default function ResidentSelectionModal({ isOpen, onClose, residents, onSelectResident, onUnassignResident, loading, roomNumber, currentResidents }) {
  if (!isOpen) return null;

  const handleSelect = (residentId) => {
    onSelectResident(residentId);
  };

  const handleUnassign = (residentId) => {
    onUnassignResident(residentId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Manage Residents for Room {roomNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading residents...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Residents Section */}
            {currentResidents && currentResidents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-4">
                  Current Residents ({currentResidents.length})
                </h3>
                <div className="space-y-3">
                  {currentResidents.map((resident) => (
                    <div
                      key={resident._id}
                      className="flex justify-between items-center bg-red-50 p-4 rounded-lg border border-red-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{resident.name}</p>
                        <p className="text-sm text-gray-600">{resident.email}</p>
                        {resident.phone && (
                          <p className="text-sm text-gray-600">Phone: {resident.phone}</p>
                        )}
                        {resident.aadhaar && (
                          <p className="text-sm text-gray-600">Aadhaar: {resident.aadhaar}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleUnassign(resident._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                      >
                        Unassign
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Residents Section */}
            {residents && residents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-4">
                  Available Residents ({residents.length})
                </h3>
                <div className="space-y-3">
                  {residents.map((resident) => (
                    <div
                      key={resident._id}
                      className="flex justify-between items-center bg-green-50 p-4 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100"
                      onClick={() => handleSelect(resident._id)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{resident.name}</p>
                        <p className="text-sm text-gray-600">{resident.email}</p>
                        {resident.phone && (
                          <p className="text-sm text-gray-600">Phone: {resident.phone}</p>
                        )}
                        {resident.aadhaar && (
                          <p className="text-sm text-gray-600">Aadhaar: {resident.aadhaar}</p>
                        )}
                      </div>
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                      >
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Residents Message */}
            {(!currentResidents || currentResidents.length === 0) && (!residents || residents.length === 0) && (
              <div className="text-center py-8">
                <p className="text-gray-600">No residents available</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
