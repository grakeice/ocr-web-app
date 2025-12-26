import { z } from "zod";

export const receiptSchema = z.object({
	items: z.array(
		z.object({
			name: z.string().describe("商品名"),
			price: z.coerce.number().describe("商品ひとつあたりの値段"),
			count: z.coerce.number().describe("商品の個数"),
			discount: z.coerce.number().describe("商品の合計値引き額"),
			totalPrice: z.coerce
				.number()
				.describe(
					"その商品の合計の値段(priceとcountの積からdiscountを引いたもの)",
				),
		}),
	),
});
