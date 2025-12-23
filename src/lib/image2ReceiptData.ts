"use server";

import { parseReceiptData } from "./parseReceiptData";
import { recognizeText } from "./recognizeText";

export async function image2ReceiptData(image: ArrayBuffer) {
	const { fullTextAnnotation } = await recognizeText(image);
	const text = fullTextAnnotation?.text;
	if (!text) return;

	const data = await parseReceiptData(text);
	return data;
}
