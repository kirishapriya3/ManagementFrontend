import { useState } from "react";
import axios from "axios";

export default function TestPayment() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const testPayment = async () => {
        setLoading(true);
        try {
            // Create a test checkout session
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "http://localhost:5000/api/payment/test-checkout-session",
                {}, // Empty body - no bill required
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setResult({
                success: true,
                url: res.data.url,
                sessionId: res.data.sessionId
            });

            // Redirect to Stripe
            window.location.href = res.data.url;

        } catch (error) {
            setResult({
                success: false,
                error: error.response?.data?.message || error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Stripe Payment Test</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Test Card Details</h2>
                <div className="space-y-2 mb-6">
                    <p><strong>Card Number:</strong> 4242424242424242</p>
                    <p><strong>Expiry:</strong> 12/34</p>
                    <p><strong>CVC:</strong> 123</p>
                    <p><strong>Name:</strong> Test User</p>
                </div>

                <button
                    onClick={testPayment}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? "Creating Test Payment..." : "Test Stripe Payment"}
                </button>

                {result && (
                    <div className={`mt-4 p-4 rounded-lg ${
                        result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {result.success ? (
                            <div>
                                <p className="font-semibold">✅ Test Payment Created!</p>
                                <p className="text-sm">Session ID: {result.sessionId}</p>
                                <p className="text-sm">Redirecting to Stripe...</p>
                            </div>
                        ) : (
                            <div>
                                <p className="font-semibold">❌ Test Failed</p>
                                <p className="text-sm">{result.error}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">📝 Testing Instructions</h3>
                <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
                    <li>Click "Test Stripe Payment" button</li>
                    <li>You'll be redirected to Stripe's test checkout page</li>
                    <li>Enter the test card details exactly as shown above</li>
                    <li>Complete the payment process</li>
                    <li>You should see a success message</li>
                </ol>
            </div>

            <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Troubleshooting</h3>
                <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                    <li>Make sure Stripe Test Mode is ON in dashboard</li>
                    <li>Use card number without spaces: 4242424242424242</li>
                    <li>Use any future expiry date (12/34)</li>
                    <li>Use any 3-digit CVC (123)</li>
                    <li>If card error persists, try refreshing the page</li>
                </ul>
            </div>
        </div>
    );
}
