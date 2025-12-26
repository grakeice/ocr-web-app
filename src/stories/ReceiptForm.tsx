"use client";

import type { JSX } from "react";

import {
	BadgeJapaneseYenIcon,
	BaggageClaimIcon,
	EqualIcon,
	TagIcon,
	XIcon,
} from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import type { z } from "zod";

import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import type { receiptSchema } from "@/schemas/receiptSchema";

interface ReceiptFormProps {
	index: number;
	register: UseFormRegister<z.infer<typeof receiptSchema>>;
	onRemove: (index: number) => void;
}
export function ReceiptForm({
	index,
	register,
}: ReceiptFormProps): JSX.Element {
	return (
		<FieldSet>
			<FieldGroup>
				<Field>
					<FieldLabel>商品名</FieldLabel>
					<InputGroup>
						<InputGroupAddon>
							<TagIcon />
						</InputGroupAddon>
						<InputGroupInput
							placeholder={"---"}
							autoComplete={"off"}
							{...register(`items.${index}.name`)}
						/>
					</InputGroup>
				</Field>
				<Field className={"box-border rounded-lg border p-3 shadow-xs"}>
					<div className={"flex flex-row items-center gap-1"}>
						<Field className={"flex-3"}>
							<FieldLabel>一個あたりの値段</FieldLabel>
							<InputGroup>
								<InputGroupAddon align={"inline-start"}>
									<BadgeJapaneseYenIcon />
								</InputGroupAddon>
								<InputGroupInput
									type={"number"}
									placeholder={"---"}
									autoComplete={"off"}
									{...register(`items.${index}.price`)}
								/>
								<InputGroupAddon align={"inline-end"}>
									<span>円</span>
								</InputGroupAddon>
							</InputGroup>
						</Field>
						<div>
							<XIcon className={"translate-y-4 text-gray-500"} />
						</div>
						<Field className={"flex-2"}>
							<FieldLabel>個数</FieldLabel>
							<InputGroup>
								<InputGroupAddon align={"inline-start"}>
									<BaggageClaimIcon />
								</InputGroupAddon>
								<InputGroupInput
									type={"number"}
									placeholder={"---"}
									autoComplete={"off"}
									{...register(`items.${index}.count`)}
								/>
								<InputGroupAddon align={"inline-end"}>
									<span>個</span>
								</InputGroupAddon>
							</InputGroup>
						</Field>
					</div>
					<Field>
						<FieldLabel>値引き額</FieldLabel>
						<InputGroup>
							<InputGroupAddon align={"inline-start"}>
								値引き
							</InputGroupAddon>
							<InputGroupInput
								type={"number"}
								placeholder={"---"}
								{...register(`items.${index}.discount`)}
							/>
							<InputGroupAddon align={"inline-end"}>
								<span>円</span>
							</InputGroupAddon>
						</InputGroup>
					</Field>
				</Field>
				<div className={"-my-4 flex items-center justify-center"}>
					<EqualIcon className={"rotate-90 text-gray-500"} />
				</div>
				<Field className={"-mt-4"}>
					<FieldLabel>合計</FieldLabel>
					<InputGroup>
						<InputGroupAddon align={"inline-start"}>
							<BadgeJapaneseYenIcon />
						</InputGroupAddon>
						<InputGroupInput
							type={"number"}
							placeholder={"---"}
							{...register(`items.${index}.totalPrice`)}
						/>
						<InputGroupAddon align={"inline-end"}>
							<span>円</span>
						</InputGroupAddon>
					</InputGroup>
				</Field>
			</FieldGroup>
		</FieldSet>
	);
}
