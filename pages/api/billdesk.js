import crypto from 'crypto';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount, orderId, customerId } = req.body;

    console.log('Request received:', { amount, orderId, customerId })

    // BillDesk credentials from environment variables
    const merchantId = process.env.BILLDESK_MERCHANT_ID;
    const checksumKey = process.env.BILLDESK_SECRET_KEY;
    const uatUrl = 'https://uat1.billdesk.com/u2/payments/ve1_2/orders/create';

    // Step 1: Create checksum using SHA-256, format string and checksumKey
    const dataString = `${merchantId}|${orderId}|${amount}|INR|${customerId}|NA|NA|NA|https://jindantechnology.tech|NA|NA|NA|NA|NA|NA`;
    const checksum = crypto.createHash('sha256').update(dataString + checksumKey).digest('hex');

    // Step 2: Prepare payload to send to BillDesk API
    const payload = {
      merchantId,
      orderId,
      amount,
      currency: 'INR',
      customerId,
      checksum,
      ru: 'https://jindantechnology.tech', // Redirect URL post payment
    };

    try {
      // Step 3: Send request to BillDesk UAT
      const response = await axios.post(uatUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      res.status(200).json(response.data);  // BillDesk will respond with transaction details
    } catch (error) {
      console.error("Error initiating payment: ", error.response?.data || error.message);
      res.status(500).json({ error: 'Payment initiation failed', details: error.response?.data });
    }
  }
}
