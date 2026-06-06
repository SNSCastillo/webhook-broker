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

    const event = req.header("x-github-event");

    if (event !== "push") {
      return res.sendStatus(200);
    }

    const repo = data.repository?.name;
    const user = data.pusher?.name;
    const branch = data.ref.replace("refs/heads/", "");

    const commits = data.commits
      .filter((c: any) => c.distinct)
      .map((c: any) => `• ${c.message.split("\n")[0]}`)
      .join("\n");

    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            title: "🚀 Nuevo Push",
            color: 0x57f287,
            fields: [
              {
                name: "📦 Repositorio",
                value: repo ?? "Desconocido",
                inline: true,
              },
              {
                name: "🌿 Rama",
                value: branch ?? "Desconocida",
                inline: true,
              },
              {
                name: "👤 Autor",
                value: user ?? "Desconocido",
                inline: true,
              },
              {
                name: "📝 Commits",
                value: commits || "Sin cambios",
              },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});