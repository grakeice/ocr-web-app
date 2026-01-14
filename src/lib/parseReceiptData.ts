import "server-only";

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import { env } from "@/env";
import { receiptSchema } from "@/schemas/receiptSchema";

export async function parseReceiptData(
	source: string,
	model: "gemini-2.0-flash" | "gemini-2.5-flash" = "gemini-2.0-flash",
) {
	const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

	console.time("gemini-thinking-time");
	const response = await ai.models.generateContent({
		model,
		contents: [
			"レシートや領収書が日本語であれば、レシートや領収書内の時間はJSTなので出力する時間をGMTに変換してください。",
			"個別の商品の価格に消費税が含まれているようであれば、税抜きの価格に直してください。",
			"個別の商品の価格は、必ずしも消費税額が含まれているか否かを保障できないため、合計金額を考慮し総合的に判断してください。",
			source,
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

	return data;
}
