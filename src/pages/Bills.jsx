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

      const res = await axios.get(
        "https://managementbackend-0njb.onrender.com/api/billing/my-bills",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBills(res.data);

    } catch (error) {
      console.log(error);
    }

  };

  // 🔥 PAY FUNCTION
  const handlePay = async (billId) => {

    try {
      console.log("Sending billId:", billId);
      const token = localStorage.getItem("token");

      // STEP 1: create payment intent
      const res = await axios.post(
        "https://managementbackend-0njb.onrender.com/api/payment/create-intent",
        { billId: billId.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(res.data);

      alert("Payment initiated!");

    } catch (error) {
      console.log(error.response?.data);
      alert("Payment failed");
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