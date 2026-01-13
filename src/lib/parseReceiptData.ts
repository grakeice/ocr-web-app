"use server";

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import { env } from "@/env";
import { receiptSchema } from "@/schemas/receiptSchema";

export async function parseReceiptData(source: string) {
	const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

	console.time("gemini-thinking-time");
	const response = await ai.models.generateContent({
		model: "gemini-2.0-flash",
		contents: [
			"レシートが日本語であれば、レシート内の時間はJSTなので出力する時間をGMTに変換してください。",
			"個別の商品の価格に消費税が含まれているようであれば、税抜きの価格に直してください。",
			"個別の商品の価格は、必ずしも消費税額が含まれているか否かを保障できないため、合計金額を考慮し総合的に判断してください。",
			JSON.stringify(source),
		],
		config: {
			responseMimeType: "application/json",
			responseJsonSchema: z.toJSONSchema(receiptSchema),
			thinkingConfig: {
				thinkingBudget: 0,
			},
		},
	});
	console.timeEnd("gemini-thinking-time");

	if (!response.text) return;

	const data = JSON.parse(response.text) as z.infer<typeof receiptSchema>;

	// const data = (await (
	// 	await fetch("https://localhost:3000/response_gemini.json")
	// ).json()) as z.infer<typeof receiptSchema>;
	// await setTimeout(1000);

	// writeFileSync(
	// 	path.join(process.cwd(), "public", "response_gemini.json"),
	// 	JSON.stringify(data),
	// );

	return data;
}
