import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { handle } from "hono/vercel";

import { image2ReceiptData } from "@/lib/image2ReceiptData";
import { imageUploadSchema } from "@/schemas/imageUploadSchema";

const app = new Hono()
	.basePath("/api")
	.post("/parse", zValidator("form", imageUploadSchema), async (c) => {
		const { file, highPrecisionMode } = c.req.valid("form");

		const result = await image2ReceiptData(
			await file.arrayBuffer(),
			highPrecisionMode,
		);

		return c.json(result);
	});

export const GET = handle(app);
export const POST = handle(app);
export type AppType = typeof app;
