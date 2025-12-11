import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// =======================================
//   ENVIAR ORDEN A CHRONOS (PRODUCCIÓN)
// =======================================
const sendOrderToChronos = async (orderData) => {
  try {
    const response = await fetch(
      `${process.env.EON_API}/v1/client/shipment/create`,   // ← PRODUCCIÓN
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.CHRONOS_TOKEN}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(orderData)
      }
    );

    const json = await response.json();
    return { status: response.status, data: json };

  } catch (err) {
    return { status: 500, data: { error: err.message } };
  }
};

// =======================================
//     ENDPOINT PARA ZOHO
// =======================================
app.post("/zoho-orders", async (req, res) => {
  try {
    const zohoOrder = req.body;
    console.log("📨 Recibido de Zoho:", JSON.stringify(zohoOrder, null, 2));

    const chronosResponse = await sendOrderToChronos(zohoOrder);

    console.log("📦 Respuesta Chronos:", chronosResponse);

    return res.status(chronosResponse.status).json({
      ok: chronosResponse.status >= 200 && chronosResponse.status < 300,
      chronos: chronosResponse.data
    });

  } catch (err) {
    console.error("❌ Error:", err);
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Ordenes API ON en puerto ${PORT}`);
});
