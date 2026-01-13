"use client";

import { type JSX, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
	BadgePercentIcon,
	CalendarDaysIcon,
	CheckIcon,
	DownloadIcon,
	EditIcon,
	PlusIcon,
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
	const [isFormDisabled, setIsFormDisabled] = useState(false);
	const [downloadType, setDownloadType] = useState<"csv" | "json" | null>(
		null,
	);

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
		disabled: isFormDisabled,
	});
	const { fields, remove, append, prepend } = useFieldArray({
		control: form.control,
		name: "items",
	});

	const onSubmit = (data: z.infer<typeof receiptSchema>) => {
		if (downloadType === "csv") {
			const csv = convertToCSV(data);
			const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute(
				"download",
				`receipt-${new Date().toISOString()}.csv`,
			);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			setDownloadType(null);
		} else if (downloadType === "json") {
			const json = JSON.stringify(data, null, 2);
			const blob = new Blob([json], {
				type: "application/json;charset=utf-8;",
			});
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute(
				"download",
				`receipt-${new Date().toISOString()}.json`,
			);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			setDownloadType(null);
		}
	};

	const convertToCSV = (data: z.infer<typeof receiptSchema>) => {
		const storeName = data.storeName;
		const dateStr = format(new Date(data.date), "yyyy-MM-dd HH:mm");

		const headers = [
			"店名",
			"日時",
			"商品名",
			"単価",
			"数量",
			"割引",
			"小計",
			"消費税分類",
			"消費税額",
			"税込小計",
		];
		const rows = data.items.map((item) => [
			storeName,
			dateStr,
			item.name,
			item.price,
			item.count,
			item.discount,
			item.totalPrice,
			item.consumptionTax.classification,
			item.consumptionTax.price,
			item.totalPriceWithTax,
		]);

		const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

		return csv;
	};

	const handleDownloadCSV = () => {
		setDownloadType("csv");
		form.handleSubmit(onSubmit)();
	};

	const handleDownloadJSON = () => {
		setDownloadType("json");
		form.handleSubmit(onSubmit)();
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
											disabled={isFormDisabled}
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
					{fields.length !== 0 && (
						<DownloadButton
							handleDownloadCSV={handleDownloadCSV}
							handleDownloadJSON={handleDownloadJSON}
							disabled={isFormDisabled}
						/>
					)}
					<div className={"flex flex-row gap-2"}>
						<Button
							variant={"outline"}
							className={"flex-1"}
							disabled={isFormDisabled}
							onClick={() => {
								prepend({
									name: "",
									price: 0,
									count: 1,
									discount: 0,
									totalPrice: 0,
									consumptionTax: {
										classification: "unknown",
										price: 0,
									},
									totalPriceWithTax: 0,
								});
							}}
						>
							<PlusIcon />
							<span>追加</span>
						</Button>
						<Button
							className={"flex-0"}
							variant={"outline"}
							onClick={() => {
								setIsFormDisabled((prev) => !prev);
							}}
						>
							{isFormDisabled ? (
								<>
									<CheckIcon />
									<span>完了</span>
								</>
							) : (
								<>
									<EditIcon />
									<span>編集</span>
								</>
							)}
						</Button>
					</div>
					{fields.map((field, index) => (
						<ReceiptForm
							key={field.id}
							index={index}
							control={form.control}
							onRemove={remove}
							isFormDisabled={isFormDisabled}
							setIsFormDisabled={setIsFormDisabled}
						/>
					))}
					<div className={"flex flex-row gap-2"}>
						<Button
							variant={"outline"}
							className={"flex-1"}
							disabled={isFormDisabled}
							onClick={() => {
								append({
									name: "",
									price: 0,
									count: 1,
									discount: 0,
									totalPrice: 0,
									consumptionTax: {
										classification: "unknown",
										price: 0,
									},
									totalPriceWithTax: 0,
								});
							}}
						>
							<PlusIcon />
							<span>追加</span>
						</Button>
						<Button
							className={"flex-0"}
							variant={"outline"}
							onClick={() => {
								setIsFormDisabled((prev) => !prev);
							}}
						>
							{isFormDisabled ? (
								<>
									<CheckIcon />
									<span>完了</span>
								</>
							) : (
								<>
									<EditIcon />
									<span>編集</span>
								</>
							)}
						</Button>
					</div>
					{fields.length !== 0 && (
						<DownloadButton
							handleDownloadCSV={handleDownloadCSV}
							handleDownloadJSON={handleDownloadJSON}
							disabled={isFormDisabled}
						/>
					)}
				</div>
			</FieldSet>
		</form>
	);
}

interface DownloadButtonProps {
	handleDownloadJSON: () => void;
	handleDownloadCSV: () => void;
	disabled?: boolean;
}
function DownloadButton({
	handleDownloadCSV,
	handleDownloadJSON,
	disabled = false,
}: DownloadButtonProps): JSX.Element {
	return (
		<div className={"flex gap-2"}>
			<Button
				type={"button"}
				onClick={handleDownloadJSON}
				className={"flex-1"}
				disabled={disabled}
			>
				<DownloadIcon />
				JSON ダウンロード
			</Button>
			<Button
				type={"button"}
				onClick={handleDownloadCSV}
				className={"flex-1"}
				disabled={disabled}
			>
				<DownloadIcon />
				CSV ダウンロード
			</Button>
		</div>
	);
}
