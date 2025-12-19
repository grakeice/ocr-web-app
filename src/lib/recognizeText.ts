"use server";

import vision from "@google-cloud/vision";

export async function recognizeText(image: ArrayBuffer) {
	const source = Buffer.from(image);
	const client = new vision.ImageAnnotatorClient();

	const [result] = await client.documentTextDetection(source);
	const detections = result.textAnnotations;
	// console.log(JSON.stringify(detections))
	// const detections = await import("./response.json") as google.cloud.vision.v1.IEntityAnnotation;
	return detections;
}
