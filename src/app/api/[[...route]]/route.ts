import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { handle } from "hono/vercel";

import { parseReceiptData } from "@/lib/parseReceiptData";
import { recognizeText } from "@/lib/recognizeText";
import { imageUploadSchema } from "@/schemas/imageUploadSchema";

const app = new Hono()
	.basePath("/api")
	.post("/parse", zValidator("form", imageUploadSchema), async (c) => {
		const { file } = c.req.valid("form");

		const { fullTextAnnotation } = await recognizeText(
			await file.arrayBuffer(),
		);
		const text = fullTextAnnotation?.text;
		if (!text) throw new HTTPException(500);

		const data = await parseReceiptData(text);
		return c.json(data);
	});

export const GET = handle(app);
export const POST = handle(app);
export type AppType = typeof app;
