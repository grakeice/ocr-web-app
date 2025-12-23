"use server";

import { writeFileSync } from "node:fs";
import path from "node:path";

import vision from "@google-cloud/vision";
import type { google } from "@google-cloud/vision/build/protos/protos";

export async function recognizeText(image: ArrayBuffer) {
	const source = Buffer.from(image);
	const client = new vision.ImageAnnotatorClient();

	// const [result] = await client.textDetection(source);

	const result = (await (
		await fetch("https://localhost:3000/response.json")
	).json()) as google.cloud.vision.v1.IAnnotateImageResponse;

	const detections = result.textAnnotations;
	const fullTextAnnotation = result.fullTextAnnotation;

	// writeFileSync(
	// 	path.join(process.cwd(), "public", "response.json"),
	// 	JSON.stringify(result),
	// );

	return { detections, fullTextAnnotation };
}
