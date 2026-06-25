import type { Commit } from "../../common/types/github.types";
import type { IAResponse } from "../../common/types/ia.interface";
import type { HttpClient } from "../../config/contract/http-client";
import { env } from "../../config/env";

export class MessageDiscord {
	constructor(private readonly httpClient: HttpClient) {}
	private readonly URL_DISCORD = env.WEBHOOK_DISCORD;
	private readonly URL_IA_API = env.URL_IA_API;

	async sendMessage(payload: any, event: string | undefined) {
		if (event !== "push") {
			return;
		}

		const repo = payload?.repository?.name;
		const user = payload?.pusher?.name;
		const branch = payload?.ref?.replace("refs/heads/", "");

		const commits = payload?.commits
			.filter((c: Commit) => c.distinct)
			.map((c: Commit) => `• ${c.message.split("\n")[0]}`)
			.join("\n");

		const response = await this.httpClient.post<IAResponse>(
			`${this.URL_IA_API}/chat`,
			{
				messages: [
					{
						role: "user",
						content: `Genera un resumen breve de los siguientes commits:\n${commits}`,
					},
				],
			},
		);

		const summary = response;

		await this.httpClient.post(this.URL_DISCORD, {
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
						{
							name: "🤖 Resumen con IA",
							value: summary || "Sin resumen",
						},
					],
					timestamp: new Date().toISOString(),
				},
			],
		});
	}
}
