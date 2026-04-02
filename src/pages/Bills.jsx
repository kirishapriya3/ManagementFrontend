import { useEffect, useState } from "react";
import axios from "axios";

export default function Bills() {

  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {

    try {

      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);

      const res = await axios.get(
        "https://managementbackend-0njb.onrender.com/api/billing/my-bills",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Bills response:", res.data);
      setBills(res.data);

    } catch (error) {
      console.log("Error fetching bills:", error);
    }

  };

  // PAY FUNCTION
  const handlePay = async (billId) => {

    try {
      console.log("Processing payment for bill:", billId);
      const token = localStorage.getItem("token");

      // Find the bill to get the correct amount
      const bill = bills.find(b => b._id === billId);
      if (!bill) {
        alert("Bill not found");
        return;
      }

      // Process payment with the full bill amount
      const res = await axios.post(
        "https://managementbackend-0njb.onrender.com/api/billing/payment",
        { 
          billId: billId.trim(), 
          amount: bill.totalAmount, // Use actual bill amount
          paymentMethod: 'test' 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log(res.data);
      
      if (res.data.message) {
        alert("Payment processed successfully!");
        // Refresh the bills to show updated status
        fetchBills();
      } else {
        alert("Payment failed");
      }

    } catch (error) {
      console.log(error.response?.data);
      alert("Payment failed: " + (error.response?.data?.message || error.message));
    }

  };

  return (

    <div className="p-8">

      <h1 className="text-2xl font-bold mb-4">Bills</h1>

      {bills.length === 0 ? (
        <p>No bills available</p>
      ) : (

        bills.map((bill) => (
          <div key={bill._id} className="bg-white shadow p-4 mb-4">

            <p><b>Amount:</b> ₹{bill.totalAmount}</p>
            <p><b>Status:</b> {bill.status || "unpaid"}</p>

            <button
              onClick={() => handlePay(bill._id)}
              className="bg-green-500 text-white px-4 py-2 mt-3"
            >
              Pay Now
            </button>

          </div>
        ))

      )}

    </div>

  );
}