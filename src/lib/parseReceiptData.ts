"use server";

import { writeFileSync } from "node:fs";
import path from "node:path";
import { setTimeout } from "node:timers/promises";

import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { z } from "zod";

import { receiptSchema } from "@/schemas/receiptSchema";

export async function parseReceiptData(source: string) {
	const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
	const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash-lite",
		contents: JSON.stringify(source),
		config: {
			responseMimeType: "application/json",
			responseJsonSchema: z.toJSONSchema(receiptSchema),
			thinkingConfig: {
				thinkingBudget: 0,
			},
		},
	});

	if (!response.text) return;

	const data = JSON.parse(response.text) as z.infer<typeof receiptSchema>;

	// const data = (await (
	// 	await fetch("https://localhost:3000/response_gemini.json")
	// ).json()) as z.infer<typeof receiptSchema>;
	// // // await setTimeout(1000);

	// writeFileSync(
	// 	path.join(process.cwd(), "public", "response_gemini.json"),
	// 	JSON.stringify(data),
	// );

	return data;
}
