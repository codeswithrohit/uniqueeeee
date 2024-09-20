import { useState } from 'react';

const PaymentPage = () => {
  const [customerNo, setCustomerNo] = useState('');
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to initiate payment after fetching customer details
  const handlePayment = async () => {
    if (!data) {
      setError('Payment data missing');
      return;
    }

    try {
      const response = await fetch('/api/billdesk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: data.payableAmount,
          orderId: data.billNumber,
          customerId: data.customerNo
        })
      });

      const paymentResponse = await response.json();
      console.log(paymentResponse);
      // Handle BillDesk redirection here based on the response, e.g., form submission
    } catch (error) {
      console.error("Payment initiation failed", error);
      setError('Payment initiation failed');
    }
  };

  // Function to fetch customer data
  const fetchData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://erp.uniquepipedgas.com/uatgas/payment?reqParam=%7B%22action%22:%22fetch_details%22,%22domain%22:%22online_payment%22,%22customerNo%22:%22${customerNo}%22,%22customerName%22:%22${name}%22,%22mobileNumber%22:%22${mobileNo}%22,%22emailId%22:%22${email}%22%7D`);
      const result = await response.json();

      if (result) {
        setData(result); // Save fetched data
      } else {
        setError('Customer data not found');
      }

      // Initiate payment once customer data is fetched
      handlePayment();

    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        <div className="p-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 font-mono underline">Pay Reticulated Bill</h1>
          <form onSubmit={fetchData} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input fields for customer details */}
              <input type="text" placeholder="Customer Number" value={customerNo} onChange={(e) => setCustomerNo(e.target.value)} required />
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="text" placeholder="Mobile Number" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} required />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="w-48 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700">Pay Now</button>
          </form>
        </div>

        {/* Display loading, error or customer details */}
        <div className="p-8">
          {loading && <div>Loading...</div>}
          {error && <div>{error}</div>}
          {data && (
            <div>
              <h2>Payment Information</h2>
              {/* Display fetched customer data */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
