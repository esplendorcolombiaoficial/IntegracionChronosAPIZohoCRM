import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// =============================
// ✔ ENDPOINT PARA PRODUCTOS
// =============================
app.post("/zoho-products", (req, res) => {
  const p = req.body;

  console.log("\n======= 🛒 PRODUCTO RECIBIDO DESDE ZOHO CRM =======");
  console.log(`🏷️ Nombre: ${p.productName}`);
  console.log(`🆔 Código: ${p.productCode}`);
  console.log(`📦 Offer_ID: ${p.offer_id}`);
  console.log(`💲 Precio: ${p.unit_price}`);
  console.log(`⚡ Activo: ${p.producto_activo}`);
  console.log("====================================================\n");

  res.status(200).send("OK");
});

// =============================
// ✔ ENDPOINT PARA ORDENES
// =============================
app.post("/zoho-orders", async (req, res) => {
  try {
    const zohoOrder = req.body;

    const orderChronos = {
      unique_order_number: zohoOrder.unique_order_number,
      shipping_service: zohoOrder.shipping_service,
      invoice: zohoOrder.invoice || null,
      warehouse_id: zohoOrder.warehouse_id,
      cod: zohoOrder.cod,
      consignee: zohoOrder.consignee,
      order_details: zohoOrder.order_details,
      total_price: zohoOrder.total_price
    };

    const response = await fetch("https://apisandbox.eonwms.com/shipment/create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CHRONOS_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(orderChronos)
    });

    const data = await response.json();

    console.log("📦 Respuesta de Chronos:", data);

    res.json({
      ok: true,
      chronos_response: data
    });

  } catch (err) {
    console.error("❌ Error enviando orden:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// =============================
// SERVIDOR
// =============================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
