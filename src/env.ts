import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		/** Gemini APIのAPIキー */
		GEMINI_API_KEY: z.string(),
		/** Cloud Vision APIのAPIキー */
		CLOUD_VISION_API_KEY: z.string(),
	},
	runtimeEnv: {
		GEMINI_API_KEY: process.env.GEMINI_API_KEY,
		CLOUD_VISION_API_KEY: process.env.CLOUD_VISION_API_KEY,
	},
});
