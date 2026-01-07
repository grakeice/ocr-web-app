"use client";

import { Fragment, type JSX } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { receiptSchema } from "@/schemas/receiptSchema";

import { ReceiptForm } from "./ReceiptForm";

interface ReceiptDataFieldProps {
	data: z.infer<typeof receiptSchema> | undefined;
}
export function ReceiptDataField({ data }: ReceiptDataFieldProps): JSX.Element {
	const form = useForm<z.infer<typeof receiptSchema>>({
		/** 数値もinputを通すとstringになってしまう問題を解決するために、z.coerceを使っているので一旦unknownに変換している */
		resolver: zodResolver(receiptSchema) as unknown as Resolver<
			z.infer<typeof receiptSchema>
		>,
		defaultValues: {
			items: data?.items,
		},
	});
	const { fields, remove } = useFieldArray({
		control: form.control,
		name: "items",
	});

	const onSubmit = (data: z.infer<typeof receiptSchema>) => {
		console.log(data);
	};
	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<div className={"my-4 flex flex-col gap-8"}>
				{fields.map((field, index) => (
					<Fragment key={field.id}>
						<hr />
						<ReceiptForm
							index={index}
							control={form.control}
							onRemove={remove}
						/>
					</Fragment>
				))}
				<Button type={"submit"} className={"w-full"}>
					保存する
				</Button>
			</div>
		</form>
	);
}
