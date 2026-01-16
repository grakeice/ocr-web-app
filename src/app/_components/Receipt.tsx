"use client";

import { JSX, Suspense, Activity, useState, useTransition } from "react";

import { RotateCwIcon, CircleQuestionMarkIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImageInput } from "@/stories/ImageInput";

import { ReceiptContainer } from "./ReceiptContainer";

export function Receipt(): JSX.Element {
	const [file, setFile] = useState<File>();
	const [isPending, startTransition] = useTransition();
	const [analysisTarget, setAnalysisTarget] = useState<{
		file: File | undefined;
		highPrecisionMode: boolean;
	}>();
	const [requestCount, setRequestCount] = useState(0);
	const [toolTipOpen, setToolTipOpen] = useState(false);
	const [highPrecisionMode, setHighPrecisionMode] = useState(false);

	return (
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
								setAnalysisTarget({
									file,
									highPrecisionMode,
								});
								setRequestCount((prev) => {
									if (prev === 0) return 1;
									else return prev;
								});
							});
						}}
					>
						<AnimatePresence>
							<motion.span key={"button.load.description"} layout>
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
							title={"再読み込み"}
						>
							<RotateCwIcon />
						</Button>
					</motion.div>
				)}
			</div>
			<div className={"flex items-center gap-3"}>
				<Checkbox
					id={"use-high-precision-mode"}
					checked={highPrecisionMode}
					onCheckedChange={(e) => setHighPrecisionMode(e.valueOf())}
				/>
				<Label htmlFor={"use-high-precision-mode"}>
					高精度モードを利用する（高コスト）
					<Tooltip open={toolTipOpen} onOpenChange={setToolTipOpen}>
						<TooltipTrigger
							onTouchStart={() => setToolTipOpen(true)}
						>
							<CircleQuestionMarkIcon
								className={"text-gray-500"}
								cursor={"pointer"}
							/>
						</TooltipTrigger>
						<TooltipContent>
							<p>
								Gemini 2.5 Flash
								に画像内の文字の位置情報を与え、より高精度な推論を期待します。
							</p>
						</TooltipContent>
					</Tooltip>
				</Label>
			</div>
			<Suspense fallback={<Spinner />}>
				<Activity
					mode={!isPending && analysisTarget ? "visible" : "hidden"}
				>
					<hr />
					<span className={"font-bold"}>解析結果</span>
					<ReceiptContainer
						file={analysisTarget?.file}
						key={`${analysisTarget?.file?.name}:${analysisTarget?.file?.size}:${analysisTarget?.file?.lastModified}:${requestCount}:${analysisTarget?.highPrecisionMode}`}
						count={requestCount}
						highPrecisionMode={analysisTarget?.highPrecisionMode}
					/>
				</Activity>
			</Suspense>
		</div>
	);
}
