"use server";

import type { z } from "zod";

import { image2ReceiptData } from "@/lib/image2ReceiptData";
import type { receiptSchema } from "@/schemas/receiptSchema";

export async function submitImage(
	_: z.infer<typeof receiptSchema> | null | undefined,
	formData: FormData,
) {
	const image = formData.get("image") as File;
	const data = await image2ReceiptData(await image.arrayBuffer());
	return data;
}
