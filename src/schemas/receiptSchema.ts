import { z } from "zod";

export const receiptSchema = z.array(
	z.object({
		name: z.string().describe("商品名"),
		price: z.number().describe("商品ひとつあたりの値段"),
		count: z.number().describe("商品の個数"),
		totalPrice: z
			.number()
			.describe("その商品の合計の値段(priceとcountの積)"),
	}),
);
