import * as z from "zod";
import "dotenv/config";

const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	WEBHOOK_DISCORD: z.string().startsWith("https://discord.com/api/webhooks/"),
	URL_IA_API: z.string().startsWith("https://"),
});

export const env = envSchema.parse(process.env);
