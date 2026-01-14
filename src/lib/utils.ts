import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatNumberWithCommas(
	value: number | string | null | undefined,
): string {
	if (value === null || value === undefined || value === "") {
		return "";
	}
	const num = Number(value);
	if (isNaN(num)) {
		return String(value); // Return original value if it can't be converted to a number
	}
	return new Intl.NumberFormat("ja-JP").format(num);
}

export function parseNumberFromFormattedString(
	formattedString: string | null | undefined,
): number | "" {
	if (
		formattedString === null ||
		formattedString === undefined ||
		formattedString === ""
	) {
		return "";
	}
	const cleanedString = formattedString.replace(/,/g, ""); // Remove commas
	const num = Number(cleanedString);
	if (isNaN(num)) {
		return ""; // Return empty string if it can't be converted to a number
	}
	return num;
}
