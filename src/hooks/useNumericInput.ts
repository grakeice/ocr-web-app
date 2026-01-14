import { type ChangeEvent, useState, type InputHTMLAttributes } from "react";

import type {
	ControllerRenderProps,
	FieldPath,
	FieldValues,
} from "react-hook-form";

import {
	formatNumberWithCommas,
	parseNumberFromFormattedString,
} from "@/lib/utils";

interface UseNumericInputProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
	field: ControllerRenderProps<TFieldValues, TName>;
	allowDecimals?: boolean;
}

export function useNumericInput<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ field, allowDecimals = true }: UseNumericInputProps<TFieldValues, TName>) {
	const [editingValue, setEditingValue] = useState<string | null>(null);

	const onFocus = () => {
		setEditingValue(field.value?.toString() ?? "");
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value;
		let sanitizedValue: string;

		if (allowDecimals) {
			sanitizedValue = rawValue.replace(/[^0-9.]/g, "");
			const dotIndex = sanitizedValue.indexOf(".");
			if (dotIndex !== -1) {
				const afterDot = sanitizedValue.substring(dotIndex + 1);
				sanitizedValue =
					sanitizedValue.substring(0, dotIndex + 1) +
					afterDot.replace(/\./g, "");
			}
		} else {
			sanitizedValue = rawValue.replace(/[^0-9]/g, "");
		}

		setEditingValue(sanitizedValue);
		const parsedValue = parseNumberFromFormattedString(sanitizedValue);

		if (typeof parsedValue === "number") {
			field.onChange(parsedValue);
		} else if (sanitizedValue === "") {
			field.onChange("");
		}
	};

	const onBlur = () => {
		setEditingValue(null);
		field.onBlur();
	};

	const displayValue =
		editingValue !== null
			? editingValue
			: formatNumberWithCommas(field.value);

	return {
		value: displayValue,
		onFocus,
		onChange,
		onBlur,
		inputMode: (allowDecimals
			? "decimal"
			: "numeric") as InputHTMLAttributes<HTMLInputElement>["inputMode"],
	};
}
