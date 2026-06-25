import type { Request, Response } from "express";
import type { MessageDiscord } from "./github-discord.service";

export class GithubDiscordController {
	constructor(private readonly messageDiscord: MessageDiscord) {}

	handleWebhook = async (req: Request, res: Response) => {
		try {
			const event = req.header("x-github-event");

			await this.messageDiscord.sendMessage(req.body, event);

			return res.sendStatus(200);
		} catch (error) {
			console.error(error);
			return res.sendStatus(500);
		}
	};
}
