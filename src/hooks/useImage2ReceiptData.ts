"use client";

import { cache } from "react";

import { image2ReceiptData } from "@/lib/image2ReceiptData";

export const fetchImage2ReceiptData = cache(
	async (file: ArrayBuffer) => await image2ReceiptData(file),
);
