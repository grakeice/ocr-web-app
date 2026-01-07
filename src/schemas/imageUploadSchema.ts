import { z } from "zod";

export const imageUploadSchema = z.object({ file: z.file() });
