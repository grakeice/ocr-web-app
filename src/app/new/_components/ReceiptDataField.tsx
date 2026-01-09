"use client";

import { type JSX } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
	BadgePercentIcon,
	CalendarDaysIcon,
	ReceiptJapaneseYenIcon,
	StoreIcon,
} from "lucide-react";
import {
	Controller,
	useFieldArray,
	useForm,
	type Resolver,
} from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
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
			storeName: data?.storeName,
			date: data?.date,
			items: data?.items,
			consumptionTax: data?.consumptionTax,
			totalPrice: data?.totalPrice,
		},
	});
	const { fields, remove } = useFieldArray({
		control: form.control,
		name: "items",
	});

	const onSubmit = (data: z.infer<typeof receiptSchema>) => {
		console.log(form.formState.errors);
		console.log(data);
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<FieldSet>
				<div className={"my-4 flex flex-col gap-4"}>
					<FieldGroup>
						<Controller
							name={"storeName"}
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										店名
									</FieldLabel>
									<InputGroup>
										<InputGroupAddon>
											<StoreIcon />
										</InputGroupAddon>
										<InputGroupInput
											{...field}
											id={field.name}
											aria-invalid={fieldState.invalid}
											placeholder={"---"}
											autoComplete={"off"}
										/>
									</InputGroup>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
						<Controller
							name={"date"}
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										日時
									</FieldLabel>
									<InputGroup>
										<InputGroupAddon>
											<CalendarDaysIcon />
										</InputGroupAddon>
										<input {...field} hidden />
										<InputGroupInput
											id={field.name}
											type={"datetime-local"}
											aria-invalid={fieldState.invalid}
											placeholder={"---"}
											autoComplete={"off"}
											value={format(
												field.value,
												"yyyy-MM-dd'T'HH:mm",
											)}
											onChange={(e) => {
												form.setValue(
													"date",
													new Date(
														e.target.value,
													).toISOString(),
												);
											}}
										/>
									</InputGroup>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
						<Controller
							name={"consumptionTax"}
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										消費税額
									</FieldLabel>
									<InputGroup>
										<InputGroupAddon align={"inline-start"}>
											<BadgePercentIcon />
										</InputGroupAddon>
										<InputGroupInput
											{...field}
											type={"number"}
											id={field.name}
											aria-invalid={fieldState.invalid}
											placeholder={"---"}
											autoComplete={"off"}
										/>
										<InputGroupAddon align={"inline-end"}>
											<span>円</span>
										</InputGroupAddon>
									</InputGroup>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
						<Controller
							name={"totalPrice"}
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										総額
									</FieldLabel>
									<InputGroup>
										<InputGroupAddon align={"inline-start"}>
											<ReceiptJapaneseYenIcon />
										</InputGroupAddon>
										<InputGroupInput
											{...field}
											type={"number"}
											id={field.name}
											aria-invalid={fieldState.invalid}
											placeholder={"---"}
											autoComplete={"off"}
										/>
										<InputGroupAddon align={"inline-end"}>
											<span>円</span>
										</InputGroupAddon>
									</InputGroup>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
					</FieldGroup>
					<hr className={"my-3"} />
					{fields.map((field, index) => (
						<ReceiptForm
							key={field.id}
							index={index}
							control={form.control}
							onRemove={remove}
						/>
					))}
					{fields.length !== 0 && (
						<Button type={"submit"} className={"w-full"}>
							保存する
						</Button>
					)}
				</div>
			</FieldSet>
		</form>
	);
}
