import { z } from "zod";

export const imageUploadSchema = z.object({
	file: z.file(),
	highPrecisionMode: z
		.string()
		.transform((val) => val === "true")
		.pipe(z.boolean()),
});
