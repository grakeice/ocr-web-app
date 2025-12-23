"use server";

import { writeFileSync } from "node:fs";
import path from "node:path";

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

export async function parseReceiptData(source: string) {
	const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
	const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

	const receiptSchema = z.array(
		z.object({
			name: z.string().describe("商品名"),
			price: z.number().describe("商品ひとつあたりの値段"),
			count: z.number().describe("商品の個数"),
			totalPrice: z
				.number()
				.describe("その商品の合計の値段(priceとcountの積)"),
		}),
	);

	// const response = await ai.models.generateContent({
	// 	model: "gemini-2.0-flash-lite",
	// 	contents: [
	// 		`
	// 		これはCloud Vision APIを使ってレシートをOCRしたデータです。これを、スキーマに基づいて、
	// 		商品ごとに、「商品名、商品ひとつあたりの値段、商品の個数、その合計」のデータを持った配列に変換してください。
	// 		商品ひとつあたりの値段と商品の個数の積がその合計と等しくなければ、値段を変えずに個数を修正してください。`.replace(
	// 			/(\n|\t)/g,
	// 			"",
	// 		),
	// 		JSON.stringify(source),
	// 	],
	// 	config: {
	// 		responseMimeType: "application/json",
	// 		responseJsonSchema: z.toJSONSchema(receiptSchema),
	// 	},
	// });

	// if (!response.text) return;

	// const data = JSON.parse(response.text) as z.infer<typeof receiptSchema>;

	const data = await (
		await fetch("https://localhost:3000/response_gemini.json")
	).json();

	// writeFileSync(
	// 	path.join(process.cwd(), "public", "response_gemini.json"),
	// 	JSON.stringify(data),
	// );

	return data;
}
