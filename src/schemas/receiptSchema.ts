import { z } from "zod";

const consumptionTaxClassificationSchema = z
	.enum(["10%", "8%", "exempted", "free", "unknown"])
	.describe("消費税の区分。exemptedは非課税、freeは免税");
export const ConsumptionTaxClassification =
	consumptionTaxClassificationSchema.enum;

export const receiptSchema = z
	.object({
		storeName: z.string().describe("レシートや領収書が発行された店の名前"),
		date: z.iso
			.datetime()
			.describe("レシートや領収書が発行された日時(GMT)"),
		items: z.array(
			z.object({
				name: z.string().describe("商品名"),
				price: z.coerce
					.number()
					.int()
					.describe("商品ひとつあたりの金額(税抜、整数)"),
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
						"その商品の税抜小計(整数、priceとcountの積からdiscountを引いたもの)",
					),
				consumptionTax: z.object({
					classification: consumptionTaxClassificationSchema,
					price: z.coerce
						.number()
						.min(0)
						.describe("消費税額(非負数)"),
				}),
				totalPriceWithTax: z.coerce
					.number()
					.int()
					.describe(
						"その商品の税込小計(整数, totalPriceにconsumptionTax.priceを足したもの)",
					),
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
			.describe("レシートに記載された合計金額(税込、非負整数)"),
	})
	.superRefine((data, ctx) => {
		const calculatedTotalPrice = data.items.reduce(
			(sum, item) => sum + item.totalPriceWithTax,
			0,
		);
		console.log(calculatedTotalPrice === data.totalPrice);
		if (calculatedTotalPrice !== data.totalPrice) {
			ctx.addIssue({
				code: "custom",
				message: `算出された商品の合計額（${calculatedTotalPrice}円）と入力された値とが一致しませんでした。差額は ${data.totalPrice - calculatedTotalPrice} 円です。情報を修正するか、金額調整のための項目を追加してください。Tips: 差額が大きい場合、含まれていない商品があるか、一個あたりの値段が税込になっている可能性があります。`,
				path: ["totalPrice"],
			});
		}
	});
