import "server-only";

import vision from "@google-cloud/vision";

import { env } from "@/env";

export async function recognizeText(image: ArrayBuffer) {
	const source = Buffer.from(image);
	const client = new vision.ImageAnnotatorClient({
		apiKey: env.CLOUD_VISION_API_KEY,
	});

	console.time("cloud-vision-analyze-time");
	const [result] = await client.textDetection(source);
	console.timeEnd("cloud-vision-analyze-time");

	const detections = result.textAnnotations;
	const fullTextAnnotation = result.fullTextAnnotation;

	return { detections, fullTextAnnotation };
}
