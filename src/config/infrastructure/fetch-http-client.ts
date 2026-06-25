import type { HttpClient } from "../contract/http-client";

export class FetchHttpClient implements HttpClient {
	async post<T>(url: string, body: unknown): Promise<T> {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		return response.json() as Promise<T>;
	}
}
