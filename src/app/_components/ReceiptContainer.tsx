"use client";

import { JSX } from "react";

import { hc } from "hono/client";
import useSWR from "swr";

import { type AppType } from "../api/[[...route]]/route";
import { ReceiptForm } from "./ReceiptForm";

interface ReceiptContainerProps {
	count?: number;
	file: File | undefined;
	highPrecisionMode?: boolean;
}
export function ReceiptContainer({
	file,
	count = 0,
	highPrecisionMode = false,
}: ReceiptContainerProps): JSX.Element {
	const client = hc<AppType>("/");
	const fetcher = async (args: [typeof file, typeof highPrecisionMode]) => {
		if (!args[0]) return;
		const res = await client.api.parse.$post({
			form: {
				file: args[0],
				highPrecisionMode: args[1].toString(),
			},
		});
		if (res.ok) return await res.json();
	};

	const receiptData = useSWR(
		file ? [file, count, highPrecisionMode] : null,
		(args) => fetcher([args[0], args[2]]),
		{
			suspense: true,
		},
	);

	return <ReceiptForm data={receiptData.data} />;
}
