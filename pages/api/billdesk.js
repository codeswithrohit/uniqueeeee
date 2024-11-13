import jwt from "jsonwebtoken";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { totalAmount, selectedBills } = req.body;

    console.log(req.body);

    const MerchantID = process.env.BILLDESK_MERCHANT_ID.toString();
    const ClientID = process.env.BILLDESK_CLIENT_ID;
    const secretKey = process.env.BILLDESK_SECRET_KEY;
    const billdeskURL =
      "https://uat1.billdesk.com/u2/payments/ve1_2/orders/create";
    const billdeskURLProd =
      "https://api.billdesk.com/payments/ve1_2/orders/create";
    const responseUrl = "http://localhost:3000/checkout/";

    const timeStamp = new Date()
      .toISOString()
      .replace(/\D/g, "")
      .substring(0, 14);

    const ipaddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    function formatDateWithTimezoneOffset(date) {
      const pad = (num) => String(num).padStart(2, "0");

      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());

      const timezoneOffset = -date.getTimezoneOffset();
      const offsetHours = pad(Math.floor(Math.abs(timezoneOffset) / 60));
      const offsetMinutes = pad(Math.abs(timezoneOffset) % 60);
      const offsetSign = timezoneOffset >= 0 ? "+" : "-";

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
    }

    const dateAtom = formatDateWithTimezoneOffset(new Date()).toString();

    let newOrderId = Math.floor(1000000 + Math.random() * 9000000).toString();
    let newAmount = totalAmount.toString();

    const payload = {
      mercid: MerchantID,
      orderid: newOrderId,
      amount: newAmount,
      order_date: dateAtom,
      currency: "356",
      ru: responseUrl.toString(),
      additional_info: { additional_info1: "Test", additional_info2: "Test1" },
      itemcode: "DIRECT",
      device: {
        init_channel: "internet",
        ip: ipaddress,
        accept_header: "text/html",
        user_agent:
          "Mozilla/5.0(WindowsNT10.0;WOW64;rv:51.0)Gecko/20100101Firefox/51.0",
      },
    };

    const headers = {
      alg: "HS256",
      clientid: ClientID,
    };

    const jwtToken = jwt.sign(payload, secretKey, {
      algorithm: "HS256",
      header: headers,
      noTimestamp: true,
    });

    try {
      const response = await axios.post(billdeskURLProd, jwtToken, {
        headers: {
          "Content-Type": "application/jose",
          Accept: "application/jose",
          "BD-Traceid": parseInt(
            String(Math.floor(Math.random() * 100000000)).padStart(8, "0")
          ),
          "BD-Timestamp": Number(timeStamp),
        },
      });

      console.log(response.status, "status");
      console.log(response.data, "data");

      const decodedResponse = jwt.verify(response.data, secretKey, {
        algorithms: ["HS256"],
      });

      console.log(decodedResponse, "decoded");

      const transactionId = decodedResponse.links[1].href;
      const bdorderid = decodedResponse.bdorderid;
      const mercid = decodedResponse.mercid;
      const rdata = decodedResponse.links[1].parameters.rdata;
      const authtoken = decodedResponse.links[1].headers.authorization;

      res.status(200).json({
        actionURL: transactionId,
        bdorderid: bdorderid,
        mercid: mercid,
        rdata: rdata,
        oauthtoken: authtoken,
      });
    } catch (error) {
      console.error(
        "Error initiating payment:",
        error.response?.data || error.message
      );
      res.status(500).json({
        error: "Payment initiation failed",
        details: error.response?.data || error.message,
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
