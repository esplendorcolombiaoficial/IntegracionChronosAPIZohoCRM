// ==========================
//   CREDENCIALES SANDBOX
// ==========================
const CHRONOS_URL = "https://apisandbox.eonwms.com";
const CHRONOS_TOKEN = "30169ed6edb2e4bd4bbf0c349b5a9d2fa1141b12726f76cd76111e46b92043f1";

const warehouseId = 1;

// ==========================
//   GET STOCK DESDE CHRONOS
// ==========================
async function getStock() {
    try {
        const response = await fetch(
            `${CHRONOS_URL}/v1/client/products/stock?warehouse_id=${warehouseId}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${CHRONOS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const stockData = await response.json();

        console.log("\n==============================");
        console.log("📦 STOCK DE PRODUCTOS");
        console.log("==============================\n");

        stockData.data.forEach(product => {
            const { sku, description, stock } = product.attributes;

            console.log(`SKU: ${sku}`);
            console.log(`Producto: ${description}`);
            console.log(`Stock: ${stock.quantity}`);
            console.log('---');
        });

        return stockData;

    } catch (err) {
        console.error("❌ Error obteniendo stock:", err.message);
        return null;
    }
}

// ==========================
//   FUNCIÓN checkAvailability
// ==========================
function checkAvailability(stockData, sku, requiredQuantity) {
    const product = stockData.data.find(
        p => p.attributes.sku === sku
    );

    if (!product) {
        return { available: false, message: "Product not found" };
    }

    const availableStock = product.attributes.stock.quantity;

    if (availableStock >= requiredQuantity) {
        return { available: true, availableStock };
    }

    return {
        available: false,
        availableStock,
        message: `Insufficient stock. Available: ${availableStock}`
    };
}

// ==========================
//   MAIN EXECUTION
// ==========================
(async () => {
    const stockData = await getStock();

    if (!stockData) return;

    // Ejemplo de uso:
    console.log("\n=== CHECKING SKU ===");
    const result = checkAvailability(stockData, "THISISSKU01", 10);
    console.log(result);
})();
