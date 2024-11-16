import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const billdeskData = req.body; 
      
      const payload = {
        action: "save_details", 
        domain: "online_payment", 
        ...billdeskData,
      };

      const response = await axios.post(
        "https://erp.uniquepipedgas.com/uatgas/payment",
        { reqParam: JSON.stringify(payload) },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      res.status(200).json({ success: true, data: response.data });
    } catch (error) {
      console.error("Error forwarding to API:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
