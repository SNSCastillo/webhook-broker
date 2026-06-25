import "dotenv/config";
import express from "express";
import { env } from "./config/env";
import { FetchHttpClient } from "./config/infrastructure/fetch-http-client";
import { GithubDiscordController } from "./modules/github-discord/github-discord.controller";
import { MessageDiscord } from "./modules/github-discord/github-discord.service";

const app = express();
const PORT = env.PORT;

app.use(express.json());

const messageDiscord = new MessageDiscord(new FetchHttpClient());
const githubDiscordController = new GithubDiscordController(messageDiscord);

app.post("/github-webhook", githubDiscordController.handleWebhook);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
