"use client";

import type { JSX } from "react";

import {
	BadgeJapaneseYenIcon,
	BaggageClaimIcon,
	EqualIcon,
	TagIcon,
	XIcon,
} from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import type { z } from "zod";

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
import type { receiptSchema } from "@/schemas/receiptSchema";

interface ReceiptFormProps {
	index: number;
	control: Control<z.infer<typeof receiptSchema>>;
	onRemove: (index: number) => void;
}
export function ReceiptForm({ index, control }: ReceiptFormProps): JSX.Element {
	return (
		<FieldSet>
			<FieldGroup>
				<Controller
					name={`items.${index}.name`}
					control={control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>商品名</FieldLabel>
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
				<Field className={"box-border rounded-lg border p-3 shadow-xs"}>
					<div className={"flex flex-row items-center gap-1"}>
						<Controller
							name={`items.${index}.price`}
							control={control}
							render={({ field, fieldState }) => (
								<Field
									className={"flex-3"}
									data-invalid={fieldState.invalid}
								>
									<FieldLabel htmlFor={field.name}>
										一個あたりの値段
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
						<div>
							<XIcon className={"translate-y-4 text-gray-500"} />
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
										<InputGroupAddon align={"inline-start"}>
											<BaggageClaimIcon />
										</InputGroupAddon>
										<InputGroupInput
											{...field}
											id={field.name}
											aria-invalid={fieldState.invalid}
											type={"number"}
											placeholder={"---"}
											autoComplete={"off"}
										/>
										<InputGroupAddon align={"inline-end"}>
											<span>個</span>
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
					</div>
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
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</Field>
				<div className={"-my-4 flex items-center justify-center"}>
					<EqualIcon className={"rotate-90 text-gray-500"} />
				</div>
				<Controller
					name={`items.${index}.totalPrice`}
					control={control}
					render={({ field, fieldState }) => (
						<Field
							className={"-mt-4"}
							data-invalid={fieldState.invalid}
						>
							<FieldLabel htmlFor={field.name}>合計</FieldLabel>
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
		</FieldSet>
	);
}
