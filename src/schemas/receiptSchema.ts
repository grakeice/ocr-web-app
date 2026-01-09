import { z } from "zod";

export const receiptSchema = z
	.object({
		storeName: z.string().describe("レシートが発行された店の名前"),
		date: z.iso.datetime().describe("レシートが発行された日時(GMT)"),
		items: z.array(
			z.object({
				name: z.string().describe("商品名"),
				price: z.coerce
					.number()
					.int()
					.describe("商品ひとつあたりの値段(整数)"),
				count: z.coerce
					.number()
					.positive()
					.int()
					.describe("商品の個数(自然数)"),
				discount: z.coerce
					.number()
					.min(0)
					.int()
					.describe("商品の合計値引き額(非負整数)"),
				totalPrice: z.coerce
					.number()
					.int()
					.describe(
						"その商品の合計の値段(整数、priceとcountの積からdiscountを引いたもの)",
					),
				consumptionTax: z.object({
					class: z
						.enum(["10%", "8%", "exempted", "free", "unknown"])
						.describe("消費税の区分。exemptedは非課税、freeは免税"),
					price: z.number().min(0).describe("消費税額(非負数)"),
				}),
			}),
		),
		consumptionTax: z.coerce
			.number()
			.min(0)
			.int()
			.describe("消費税額(非負整数)"),
		totalPrice: z.coerce
			.number()
			.min(0)
			.int()
			.describe("レシートに記載された合計金額(非負整数)"),
	})
	.superRefine((data, ctx) => {
		const calculatedTotalPrice = data.items.reduce(
			(sum, item) => sum + item.totalPrice,
			0,
		);
		console.log(calculatedTotalPrice === data.totalPrice);
		if (calculatedTotalPrice !== data.totalPrice) {
			if (
				calculatedTotalPrice !==
				data.totalPrice - data.consumptionTax
			) {
				ctx.addIssue({
					code: "custom",
					message: `算出された商品の合計額（${calculatedTotalPrice}円）と入力された値とが一致しませんでした。差額は ${calculatedTotalPrice - data.totalPrice} 円です。情報を修正するか、金額調整のための項目を追加してください。`,
					path: ["totalPrice"],
				});
			}
		}
	});
