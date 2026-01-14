"use client";

import { Activity, Suspense, useState, useTransition, type JSX } from "react";

import { hc } from "hono/client";
import { RotateCwIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import useSWR from "swr/immutable";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ImageInput } from "@/stories/ImageInput";

import { ReceiptDataField } from "./_components/ReceiptDataField";
import type { AppType } from "./api/[[...route]]/route";

interface ReceiptContainerProps {
	count?: number;
	file: File | undefined;
}
function ReceiptContainer({
	file,
	count = 0,
}: ReceiptContainerProps): JSX.Element {
	const client = hc<AppType>("/");
	const fetcher = async (args: typeof file) => {
		if (!args) return;
		const res = await client.api.parse.$post({
			form: { file: args },
		});
		if (res.ok) return await res.json();
	};

	const receiptData = useSWR(
		file ? [file, count] : null,
		(args) => fetcher(args[0]),
		{
			suspense: true,
		},
	);

	return <ReceiptDataField data={receiptData.data} />;
}

export default function Page(): JSX.Element {
	const [file, setFile] = useState<File>();
	const [isPending, startTransition] = useTransition();
	const [analysisTarget, setAnalysisTarget] = useState<File>();
	const [requestCount, setRequestCount] = useState(0);

	return (
		<div className={"mx-auto mt-4 max-w-100 px-2"}>
			<div className={"flex flex-col gap-4"}>
				<ImageInput
					name={"image"}
					accept={"image/jpeg, image/png, image/webp"}
					onChange={async (e) => {
						const inputtedFiles = e.currentTarget.files;
						if (!inputtedFiles) return;
						const file = inputtedFiles.item(0);
						if (!file) return;
						setFile(file);
					}}
				/>
				<div className={"flex w-full flex-row gap-2"}>
					<motion.div layout style={{ flex: 1 }}>
						<Button
							className={"w-full"}
							disabled={isPending || !file}
							onClick={() => {
								startTransition(() => {
									setAnalysisTarget(file);
									setRequestCount((prev) => {
										if (prev === 0) return 1;
										else return prev;
									});
								});
							}}
						>
							<AnimatePresence>
								<motion.span
									key={"button.load.description"}
									layout
								>
									読み込む
								</motion.span>
								{isPending && (
									<motion.span
										key={"button.load.spinner"}
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
					</motion.div>
					{!isPending && analysisTarget && (
						<motion.div
							layout
							style={{ flex: 0 }}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							key={"button.reload"}
						>
							<Button
								className={"w-full"}
								onClick={() => {
									startTransition(() => {
										setRequestCount((prev) => prev + 1);
									});
								}}
								aria-label={"再読み込み"}
							>
								<RotateCwIcon />
							</Button>
						</motion.div>
					)}
				</div>
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
							key={`${analysisTarget?.name}:${analysisTarget?.size}:${analysisTarget?.lastModified}:${requestCount}`}
							count={requestCount}
						/>
					</Activity>
				</Suspense>
			</div>
		</div>
	);
}
