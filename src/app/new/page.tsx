"use client";

import { Activity, Suspense, useState, useTransition, type JSX } from "react";

import clsx from "clsx";
import { hc } from "hono/client";
import { AnimatePresence, motion } from "motion/react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ImageInput } from "@/stories/ImageInput";

import type { AppType } from "../api/[[...route]]/route";
import { ReceiptDataField } from "./_components/ReceiptDataField";

interface ReceiptProps {
	file: File | undefined;
}
function ReceiptContainer({ file }: ReceiptProps): JSX.Element {
	const client = hc<AppType>("/");
	const fetcher = async (args: typeof file) => {
		if (!args) return;
		console.log(args);
		const res = await client.api.parse.$post({
			form: { file: args },
		});
		if (res.ok) {
			return await res.json();
		}
	};
	const receiptData = useSWR(file, fetcher, {
		suspense: true,
	});
	return <ReceiptDataField key={file?.name} data={receiptData.data} />;
}

export default function Page(): JSX.Element {
	const [file, setFile] = useState<File>();
	const [isPending, startTransition] = useTransition();

	return (
		<div className={"mx-2 mt-4 max-w-100 md:mx-auto"}>
			<div className={"flex flex-col gap-4"}>
				<ImageInput
					type={"file"}
					name={"image"}
					onChange={async (e) => {
						const inputtedFiles = e.currentTarget.files;
						if (!inputtedFiles) return;
						const file = inputtedFiles.item(0);
						if (!file) return;
						startTransition(() => {
							setFile(file);
						});
					}}
				/>
				<Button
					type={"submit"}
					className={clsx(
						"w-full",
						(isPending || !file) && "cursor-not-allowed",
					)}
					disabled={isPending}
				>
					<AnimatePresence>
						<motion.span key={"description"} layout>
							読み込む
						</motion.span>
						{isPending && (
							<motion.span
								key={"spinner"}
								layout
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<Spinner />
							</motion.span>
						)}
					</AnimatePresence>
				</Button>
				<Suspense>
					<Activity mode={!isPending && file ? "visible" : "hidden"}>
						<ReceiptContainer file={file} />
					</Activity>
				</Suspense>
			</div>
		</div>
	);
}
