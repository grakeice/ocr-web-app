"use server";

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

	// const result = (await (
	// 	await fetch("https://localhost:3000/response.json")
	// ).json()) as google.cloud.vision.v1.IAnnotateImageResponse;
	// await setTimeout(1000);

	const detections = result.textAnnotations;
	const fullTextAnnotation = result.fullTextAnnotation;

	// writeFileSync(
	// 	path.join(process.cwd(), "public", "response.json"),
	// 	JSON.stringify(result),
	// );

	return { detections, fullTextAnnotation };
}
