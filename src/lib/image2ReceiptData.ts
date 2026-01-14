import "server-only";

import { parseReceiptData } from "./parseReceiptData";
import { recognizeText } from "./recognizeText";

export async function image2ReceiptData(
	image: ArrayBuffer,
	highPrecisionMode: boolean = false,
) {
	const { fullTextAnnotation } = await recognizeText(image);
	switch (highPrecisionMode) {
		case true: {
			if (!fullTextAnnotation) return;
			const data = await parseReceiptData(
				JSON.stringify(fullTextAnnotation),
				"gemini-2.5-flash",
			);
			return data;
		}
		case false: {
			const text = fullTextAnnotation?.text;
			if (!text) return;

			const data = await parseReceiptData(text, "gemini-2.0-flash");
			return data;
		}
	}
}
