"use client";

import { Activity, Suspense, useState, useTransition, type JSX } from "react";

import { hc } from "hono/client";
import { AnimatePresence, motion } from "motion/react";
import useSWR from "swr/immutable";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ImageInput } from "@/stories/ImageInput";

import { ReceiptDataField } from "./_components/ReceiptDataField";
import type { AppType } from "./api/[[...route]]/route";

interface ReceiptProps {
	file: File | undefined;
}
function ReceiptContainer({ file }: ReceiptProps): JSX.Element {
	const client = hc<AppType>("/");
	const fetcher = async (args: typeof file) => {
		if (!args) return;
		const res = await client.api.parse.$post({
			form: { file: args },
		});
		if (res.ok) return await res.json();
	};

	const receiptData = useSWR(file ? file : null, fetcher, {
		suspense: true,
	});

	return <ReceiptDataField data={receiptData.data} />;
}

export default function Page(): JSX.Element {
	const [file, setFile] = useState<File>();
	const [isPending, startTransition] = useTransition();
	const [analysisTarget, setAnalysisTarget] = useState<File>();

	return (
		<div className={"mx-auto mt-4 max-w-100 px-2"}>
			<div className={"flex flex-col gap-4"}>
				<ImageInput
					type={"file"}
					name={"image"}
					onChange={async (e) => {
						const inputtedFiles = e.currentTarget.files;
						if (!inputtedFiles) return;
						const file = inputtedFiles.item(0);
						if (!file) return;
						setFile(file);
					}}
				/>
				<Button
					type={"submit"}
					className={"w-full"}
					disabled={isPending || !file}
					onClick={() => {
						startTransition(() => {
							setAnalysisTarget(file);
						});
					}}
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
				<Suspense fallback={<Spinner />}>
					<Activity
						mode={
							!isPending && analysisTarget ? "visible" : "hidden"
						}
					>
						<hr />
						<span className={"font-bold"}>解析結果</span>
						<ReceiptContainer
							file={analysisTarget}
							key={`${analysisTarget?.name}:${analysisTarget?.size}:${analysisTarget?.lastModified}`}
						/>
					</Activity>
				</Suspense>
			</div>
		</div>
	);
}
