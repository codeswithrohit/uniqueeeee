import { useState , useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

const PaymentPage = () => {
  const [customerNo, setCustomerNo] = useState('');
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBilldeskCharges, setShowBilldeskCharges] = useState(false);


 
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
          totalAmount: data.payableAmount,
          selectedBills: data.billNumber,
          email: data.email, 
          customerNo : data.customerNo,
          transNumber : data.transNumber,
          mobileNo : data.mobileNo,
        }),
      });

      const paymentResponse = await response.json();
      console.log('Payment Response:', paymentResponse);

        const billDeskForm = document.createElement('form');
        billDeskForm.name = 'sdklaunch';
        billDeskForm.id = 'sdklaunch';
        billDeskForm.action = 'https://uat1.billdesk.com/u2/web/v1_2/embeddedsdk'; 
        billDeskForm.method = 'POST';

        const bdorderidInput = document.createElement('input');
        bdorderidInput.type = 'hidden';
        bdorderidInput.name = 'bdorderid';
        bdorderidInput.value = paymentResponse.bdorderid;

        const merchantidInput = document.createElement('input');
        merchantidInput.type = 'hidden';
        merchantidInput.name = 'merchantid';
        merchantidInput.value = paymentResponse.mercid;

        const rdataInput = document.createElement('input');
        rdataInput.type = 'hidden';
        rdataInput.name = 'rdata';
        rdataInput.value = paymentResponse.rdata;

        billDeskForm.appendChild(bdorderidInput);
        billDeskForm.appendChild(merchantidInput);
        billDeskForm.appendChild(rdataInput);

        document.body.appendChild(billDeskForm);
        billDeskForm.submit();

    } catch (error) {
      console.error("Payment initiation failed", error);
      setError('Payment initiation failed');
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionData = Object.fromEntries(urlParams.entries());

    fetch("/api/billdesk-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    })
      .then((response) => response.json())
      .then((data) => console.log("Response sent successfully:", data))
      .catch((error) => console.error("Error:", error));
  }, []);

  
  const fetchData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://erp.uniquepipedgas.com/uatgas/payment?reqParam=%7B%22action%22:%22fetch_details%22,%22domain%22:%22online_payment%22,%22customerNo%22:%22${customerNo}%22,%22customerName%22:%22${name}%22,%22mobileNumber%22:%22${mobileNo}%22,%22emailId%22:%22${email}%22%7D`);
      const result = await response.json();
      console.log(result)
      if (result) {
        setData(result); 
      } else {
        setError('Customer data not found');
      }

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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="customerNo">Customer Number:</label>
              <input
                type="text"
                id="customerNo"
                value={customerNo}
                onChange={(e) => setCustomerNo(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="mobileNo">Mobile Number:</label>
              <input
                type="text"
                id="mobileNo"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-48 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
           Billing Details
          </button>
        </form>
      </div>
      <div className="p-8">
        {loading && <div className="text-center text-blue-600">Loading...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}
        {data && (
          <>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 font-mono mb-4">Payment Information</h2>
            <div className="space-y-3 font-mono">
              <p className="text-gray-700"><strong>Customer Name:</strong> {data.customerName}</p>
              <p className="text-gray-700"><strong>Customer Number:</strong> {data.customerNo}</p>
              <p className="text-gray-700"><strong>Due Date:</strong> {data.dueDate}</p>
              <p className="text-gray-700"><strong>Bill Period:</strong> {data.billPeriod} days</p>
              <p className="text-gray-700"><strong>Bill Date:</strong> {data.billDate}</p>
              <p className="text-gray-700"><strong>Bill Amount:</strong> ₹ {data.billAmount.toFixed(2)}</p>
              <p className="text-gray-700"><strong>Bill Number:</strong> {data.billNumber}</p>
              <p className="text-gray-700"><strong>Payable Amount:</strong> ₹ {data.payableAmount}</p> 
            </div>
          </div>
          <button
           onClick={() => setShowBilldeskCharges(true)}
            className="w-48 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 mt-5"
          >
           Pay Now
          </button>
          <Transition appear show={showBilldeskCharges} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={() => setShowBilldeskCharges(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div className="relative w-full max-w-3xl p-4">
            <Transition.Child
              as={n}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b p-4 rounded-t">
                  <Dialog.Title className="text-lg font-semibold">Payment Charges</Dialog.Title>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  <table className="w-full border border-collapse">
                    <thead>
                      <tr className="border">
                        <th className="p-2 border">Transaction Type</th>
                        <th className="p-2 border">Charges</th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr className="border">
                        <td className="p-2 border">UPI</td>
                        <td className="p-2 border">NIL</td>
                      </tr>
                      <tr className="border">
                        <td className="p-2 border">Debit Card - Rupay</td>
                        <td className="p-2 border">NIL</td>
                      </tr>
                      <tr className="border">
                        <td className="p-2 border">Debit Cards - Master, Visa</td>
                        <td className="p-2 border">0.90 % of Transaction Amount</td>
                      </tr>                    
                      <tr className="border">
                        <td className="p-2 border">Credit Cards - Visa ,MasterCard, Rupay</td>
                        <td className="p-2 border">1.00 % of Transaction Amount</td>
                      </tr>
                      <tr className="border">
                        <td className="p-2 border">Credit Cards - American Express, Diners </td>
                        <td className="p-2 border">1.00 % of Transaction Amount</td>
                      </tr>
                     
                      <tr className="border">
                        <td className="p-2 border">NetBanking</td>
                        <td className="p-2 border">INR 3.00 per Transaction</td>
                      </tr>
                      <tr className="border">
                        <td className="p-2 border">Wallets</td>
                        <td className="p-2 border">INR 3.00 per Transaction</td>
                      </tr>
                      <tr className="border">
                        <td className="p-2 border">Bill Payment Transaction - All Electronic Mode</td>
                        <td className="p-2 border">INR 2 per Transaction</td>
                      </tr>
                      <tr className="border">
                        <td className="p-2 border">Bill Payment Transaction - Cash Mode</td>
                        <td className="p-2 border">INR 2 per Transaction</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end p-4 border-t rounded-b">
                  <button
                    onClick={handlePayment}
                    className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded"
                    type="button"
                  >
                    I Accept Terms and Conditions
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>

          </>
          
        )}
      </div>
    </div>
  </div>
  );
};

export default PaymentPage;
