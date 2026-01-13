"use client";

import { Dispatch, SetStateAction, useState, type JSX } from "react";

import clsx from "clsx";
import {
	BadgeJapaneseYenIcon,
	BadgePercentIcon,
	BaggageClaimIcon,
	EqualIcon,
	MinusCircleIcon,
	PlusIcon,
	TagIcon,
	XIcon,
} from "lucide-react";
import { Controller, useFormState, type Control } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	NativeSelect,
	NativeSelectOptGroup,
	NativeSelectOption,
} from "@/components/ui/native-select";
import {
	Popover,
	PopoverContent,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	ConsumptionTaxClassification,
	receiptSchema,
} from "@/schemas/receiptSchema";

interface ReceiptFormProps {
	index: number;
	control: Control<z.infer<typeof receiptSchema>>;
	onRemove: (index: number) => void;
	isFormDisabled: boolean;
	setIsFormDisabled: Dispatch<SetStateAction<boolean>>;
}
export function ReceiptForm({
	index,
	control,
	onRemove,
	isFormDisabled,
}: ReceiptFormProps): JSX.Element {
	const { errors } = useFormState({ control });
	const [deletePopoverOpen, setDeletePopoverOpen] = useState(false);

	return (
		<Card className={"group py-3"}>
			<Popover
				open={deletePopoverOpen}
				onOpenChange={setDeletePopoverOpen}
			>
				<PopoverTrigger
					className={clsx(
						"bg-card text-destructive absolute w-fit -translate-x-2 -translate-y-5 cursor-pointer rounded-full transition-all group-hover:visible group-hover:opacity-100",
						isFormDisabled && "visible opacity-100",
						!isFormDisabled && "invisible opacity-0",
					)}
					aria-description={"削除"}
				>
					<MinusCircleIcon size={20} />
				</PopoverTrigger>
				<PopoverContent side={"inline-end"}>
					<PopoverHeader className={"text-destructive"}>
						<PopoverTitle>削除しますか？</PopoverTitle>
					</PopoverHeader>
					<div
						className={
							"just flex flex-row items-center justify-end gap-2"
						}
					>
						<Button
							variant={"outline"}
							onClick={() => {
								setDeletePopoverOpen(false);
							}}
						>
							キャンセル
						</Button>
						<Button
							variant={"destructive"}
							onClick={() => {
								onRemove(index);
								setDeletePopoverOpen(false);
							}}
						>
							削除
						</Button>
					</div>
				</PopoverContent>
			</Popover>
			<CardContent className={"px-3"}>
				<FieldGroup>
					<Controller
						name={`items.${index}.name`}
						control={control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									商品名
								</FieldLabel>
								<InputGroup>
									<InputGroupAddon>
										<TagIcon />
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
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Field
						className={"box-border rounded-lg border p-3 shadow-xs"}
					>
						<div className={"flex flex-row items-center gap-1"}>
							<Controller
								name={`items.${index}.price`}
								control={control}
								render={({ field, fieldState }) => (
									<Field
										className={"flex-5"}
										data-invalid={fieldState.invalid}
									>
										<FieldLabel htmlFor={field.name}>
											一個あたりの値段（税抜）
										</FieldLabel>
										<InputGroup>
											<InputGroupAddon
												align={"inline-start"}
											>
												<BadgeJapaneseYenIcon />
											</InputGroupAddon>
											<InputGroupInput
												{...field}
												id={field.name}
												aria-invalid={
													fieldState.invalid
												}
												type={"number"}
												placeholder={"---"}
												autoComplete={"off"}
											/>
											<InputGroupAddon
												align={"inline-end"}
											>
												<span>円</span>
											</InputGroupAddon>
										</InputGroup>
									</Field>
								)}
							/>
							<div>
								<XIcon
									className={"translate-y-4 text-gray-500"}
								/>
							</div>
							<Controller
								name={`items.${index}.count`}
								control={control}
								render={({ field, fieldState }) => (
									<Field
										className={"flex-2"}
										data-invalid={fieldState.invalid}
									>
										<FieldLabel htmlFor={field.name}>
											個数
										</FieldLabel>
										<InputGroup>
											<InputGroupAddon
												align={"inline-start"}
											>
												<BaggageClaimIcon />
											</InputGroupAddon>
											<InputGroupInput
												{...field}
												id={field.name}
												aria-invalid={
													fieldState.invalid
												}
												type={"number"}
												placeholder={"---"}
												autoComplete={"off"}
											/>
											<InputGroupAddon
												align={"inline-end"}
											>
												<span>個</span>
											</InputGroupAddon>
										</InputGroup>
									</Field>
								)}
							/>
						</div>
						{(errors.items?.[index]?.price ||
							errors.items?.[index]?.count) && (
							<FieldError
								errors={[
									errors.items[index]?.price,
									errors.items[index]?.count,
								]}
							/>
						)}
						<Controller
							name={`items.${index}.discount`}
							control={control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										値引き額
									</FieldLabel>
									<InputGroup>
										<InputGroupAddon align={"inline-start"}>
											値引き
										</InputGroupAddon>
										<InputGroupInput
											{...field}
											id={field.name}
											aria-invalid={fieldState.invalid}
											type={"number"}
											placeholder={"---"}
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
					</Field>
					<div className={"-my-4 flex items-center justify-center"}>
						<PlusIcon className={"text-gray-500"} />
					</div>
					<Field
						className={"box-border rounded-lg border p-3 shadow-xs"}
					>
						<div className={"flex flex-row items-center gap-1"}>
							<Controller
								name={`items.${index}.consumptionTax.classification`}
								control={control}
								render={({ field, fieldState }) => (
									<Field
										data-invalid={fieldState.invalid}
										className={"flex-1"}
									>
										<FieldLabel htmlFor={field.name}>
											税区分
										</FieldLabel>
										<NativeSelect
											{...field}
											id={field.name}
											aria-invalid={fieldState.invalid}
											onChange={field.onChange}
										>
											<NativeSelectOptGroup
												label={"税率"}
											>
												<NativeSelectOption
													value={
														ConsumptionTaxClassification[
															"10%"
														]
													}
												>
													10%
												</NativeSelectOption>
												<NativeSelectOption
													value={
														ConsumptionTaxClassification[
															"8%"
														]
													}
												>
													8%
												</NativeSelectOption>
											</NativeSelectOptGroup>
											<hr />
											<NativeSelectOptGroup
												label={"その他"}
											>
												<NativeSelectOption
													value={
														ConsumptionTaxClassification.exempted
													}
												>
													非課税
												</NativeSelectOption>
												<NativeSelectOption
													value={
														ConsumptionTaxClassification.free
													}
												>
													免税
												</NativeSelectOption>
												<NativeSelectOption
													value={
														ConsumptionTaxClassification.unknown
													}
												>
													不明
												</NativeSelectOption>
											</NativeSelectOptGroup>
										</NativeSelect>
									</Field>
								)}
							/>
							<Controller
								name={`items.${index}.consumptionTax.price`}
								control={control}
								render={({ field, fieldState }) => (
									<Field
										data-invalid={fieldState.invalid}
										className={"flex-2"}
									>
										<FieldLabel htmlFor={field.name}>
											税額
										</FieldLabel>
										<InputGroup>
											<InputGroupAddon
												align={"inline-start"}
											>
												<BadgePercentIcon />
											</InputGroupAddon>
											<InputGroupInput
												{...field}
												id={field.name}
												aria-invalid={
													fieldState.invalid
												}
												type={"number"}
												placeholder={"---"}
											/>
											<InputGroupAddon
												align={"inline-end"}
											>
												円
											</InputGroupAddon>
										</InputGroup>
									</Field>
								)}
							/>
						</div>
						{errors.items?.[index]?.consumptionTax && (
							<FieldError
								errors={[
									errors.items[index].consumptionTax
										?.classification,
									errors.items[index].consumptionTax?.price,
								]}
							/>
						)}
					</Field>
					<div className={"-my-4 flex items-center justify-center"}>
						<EqualIcon className={"rotate-90 text-gray-500"} />
					</div>
					<Controller
						name={`items.${index}.totalPriceWithTax`}
						control={control}
						render={({ field, fieldState }) => (
							<Field
								className={"-mt-4"}
								data-invalid={fieldState.invalid}
							>
								<FieldLabel htmlFor={field.name}>
									小計（税込）
								</FieldLabel>
								<InputGroup>
									<InputGroupAddon align={"inline-start"}>
										<BadgeJapaneseYenIcon />
									</InputGroupAddon>
									<InputGroupInput
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										type={"number"}
										placeholder={"---"}
									/>
									<InputGroupAddon align={"inline-end"}>
										<span>円</span>
									</InputGroupAddon>
								</InputGroup>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FieldGroup>
			</CardContent>
		</Card>
	);
}
