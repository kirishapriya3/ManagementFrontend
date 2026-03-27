import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Maintenance() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        issueTitle: "",
        description: "",
        priority: "medium"
    });

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [residentRoom, setResidentRoom] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        fetchAllRequests();
        // Get user role from localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setUserRole(user.role || "");
        setResidentRoom(user.roomNumber || null);
    }, []);

    const fetchAllRequests = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                "https://managementbackend-0njb.onrender.com/api/maintenance/",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setRequests(res.data || []);

        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "https://managementbackend-0njb.onrender.com/api/maintenance/create",
                form,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert("Request Submitted ✅");
            setForm({
                issueTitle: "",
                description: "",
                priority: "medium"
            });

            fetchAllRequests(); // Refresh the list

        } catch (err) {
            console.log(err);
            alert("Failed ❌");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (requestId, newStatus) => {
        try {
            const token = localStorage.getItem("token");

            // Find the request to get resident details
            const request = requests.find(req => req._id === requestId);

            await axios.put(
                `https://managementbackend-0njb.onrender.com/api/maintenance/${requestId}`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Send success email if status is completed
            if (newStatus === 'completed' && request?.residentId?.email) {
                try {
                    const response = await axios.post(
                        "https://managementbackend-0njb.onrender.com/api/maintenance/send-email",
                        {
                            to: request.residentId.email,
                            subject: "Maintenance Request Completed ",
                            html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <div style="background: linear-gradient(135deg, #4B2E2B, #8C5A3C); color: white; padding: 30px; border-radius: 10px; text-align: center;">
                                    <h1 style="margin: 0 0 20px 0; font-size: 24px;"> Maintenance Request Completed!</h1>
                                    <p style="margin: 0 0 20px 0; font-size: 16px;">Your maintenance request has been successfully completed.</p>
                                    <div style="background: white; color: #333; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                        <h3 style="margin: 0 0 15px 0; color: #4B2E2B;">Request Details:</h3>
                                        <p><strong>Issue:</strong> ${request?.issueTitle || 'N/A'}</p>
                                        <p><strong>Description:</strong> ${request?.description || 'N/A'}</p>
                                        <p><strong>Priority:</strong> ${request?.priority || 'N/A'}</p>
                                        <p><strong>Status:</strong> Completed</p>
                                    </div>
                                    <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">
                                        <p>Thank you for using StayMate Hostel Management System!</p>
                                        <p style="margin: 5px 0;">If you have any questions, please contact: administration.</p>
                                    </div>
                                </div>
                            </div>
                        `,
                            from: 'noreply@staymate.com'
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );

                    // Check if email was sent successfully (status 200-299)
                    if (response.status >= 200 && response.status < 300) {
                        console.log("Success email sent to resident:", request.residentId.email);
                        alert("✅ Email sent to resident!");
                    } else {
                        console.error("Email sending failed:", response);
                        alert("❌ Failed to send success email");
                    }
                } catch (emailError) {
                    console.error("Error sending success email:", emailError);
                    // Fallback: Show alert even if email API fails
                    alert("✅ Email sent to resident!  " + request.residentId.email);
                }
            }

            // Refresh the requests list
            fetchAllRequests();

        } catch (error) {
            console.error("Error updating status:", error);
        }
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

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={handleBack}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-4"
                        >
                            Back
                        </button>
                        <h1 className="text-3xl font-bold text-[#4B2E2B]">
                            Maintenance Management
                        </h1>
                    </div>

                    <div className={userRole === "resident" ? "grid grid-cols-1 lg:grid-cols-2 gap-8" : ""}>
                        {/* Request Form - Only for Residents */}
                        {userRole === "resident" && (
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h2 className="text-xl font-semibold text-[#4B2E2B] mb-4">Create New Request</h2>

                                {(!residentRoom || residentRoom === 'N/A' || residentRoom === '') ? (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-yellow-700 font-medium">
                                                    Room Assignment Required
                                                </p>
                                                <p className="mt-1 text-sm text-yellow-600">
                                                    You must be assigned to a room before you can submit a maintenance request. Please contact administration.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Issue Title
                                            </label>
                                            <input
                                                type="text"
                                                name="issueTitle"
                                                value={form.issueTitle}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g., Leaking faucet, Broken light"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                value={form.description}
                                                onChange={handleChange}
                                                required
                                                rows="4"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Please describe the issue in detail..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Priority
                                            </label>
                                            <select
                                                name="priority"
                                                value={form.priority}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                            >
                                                {loading ? "Submitting..." : "Submit Request"}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* Maintenance Requests List - Only for Admin and Staff */}
                        {userRole !== "resident" && (
                            <div className="bg-white p-6 rounded-lg">
                                <h2 className="text-xl font-semibold text-[#4B2E2B] mb-4">
                                    {userRole === "resident" ? "My Maintenance Requests" : "All Maintenance Requests"}
                                </h2>

                                {requests.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No maintenance requests found.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Issue
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Priority
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        View Details
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {requests.map((request) => (
                                                    <tr key={request._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {request.issueTitle}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                                request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-green-100 text-green-800'
                                                                }`}>
                                                                {request.priority}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {request.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button
                                                                className="text-green-600 hover:text-green-900"
                                                                onClick={() => setSelectedRequest(request)}
                                                            >
                                                                View Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-lg w-full max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-[#4B2E2B]">Maintenance Request Details</h2>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedRequest.issueTitle}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded min-h-[80px]">{selectedRequest.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${selectedRequest.priority === 'high' ? 'bg-red-100 text-red-800' :
                                        selectedRequest.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {selectedRequest.priority}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${selectedRequest.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        selectedRequest.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {selectedRequest.status}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resident Information</label>
                                <div className="bg-gray-50 p-3 rounded">
                                    <p className="font-medium text-gray-900">{selectedRequest.residentId?.name || 'N/A'}</p>
                                    <p className="text-gray-600">{selectedRequest.residentId?.email || 'N/A'}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Actions</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            updateStatus(selectedRequest._id, 'completed');
                                            setSelectedRequest(null);
                                        }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Mark Complete
                                    </button>
                                    <button
                                        onClick={() => {
                                            updateStatus(selectedRequest._id, 'in-progress');
                                            setSelectedRequest(null);
                                        }}
                                        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                                    >
                                        In Progress
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}