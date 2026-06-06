import "dotenv/config";
import express, { type Request, type Response } from "express";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
const DISCORD_WEBHOOK = process.env.WEBHOOK_DISCORD;

app.use(express.json());

app.post("/github-webhook", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!DISCORD_WEBHOOK) {
      console.error("WEBHOOK_DISCORD no está definido");
      return res.sendStatus(500);
    }
    console.log("Webhook recibido:", data);

    const repo = data.repository?.name;
    const user = data.pusher?.name;

    const message = `🚀 Push en ${repo} por ${user}`;

    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: message
      })
    });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

const DISCORD_CHANNEL_ID = process.env.MONEY_WEBHOOKS_DISCORD;
const URL_BASE = process.env.URL_BASE;

async function notificarCotizacionUSD() {
  try {
    const response = await fetch(`${URL_BASE}/cotizaciones/usd`);
    const data = await response.json();
    const price = data.compra;

    if (!DISCORD_CHANNEL_ID) {
      console.error("MONEY_WEBHOOKS_DISCORD no está definido");
      return;
    }

    const message = `=====================================
      💰 Precio actual del Dólar: $${price}
      Precio de compra: $${data.compra}
      Precio de venta: $${data.venta}
      Precio fix: $${data.fix}
      Fecha de actualización: ${data.fechaActualizacion}
      =====================================
    `;

    await fetch(DISCORD_CHANNEL_ID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: message
      })
    });
  } catch (err) {
    console.error(err);
  }
}

function msHasta6AM(): number {
  const ahora = new Date();
  const proxima = new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    ahora.getDate(),
    6, 0, 0, 0
  );
  if (proxima <= ahora) {
    proxima.setDate(proxima.getDate() + 1);
  }
  return proxima.getTime() - ahora.getTime();
}

setTimeout(() => {
  notificarCotizacionUSD();
  setInterval(notificarCotizacionUSD, 24 * 60 * 60 * 1000);
}, msHasta6AM());

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});