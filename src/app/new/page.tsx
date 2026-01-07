"use client";

import {
	Activity,
	Suspense,
	useImperativeHandle,
	useRef,
	useState,
	useTransition,
	type JSX,
	type RefObject,
} from "react";

import clsx from "clsx";
import { hc } from "hono/client";
import { AnimatePresence, motion } from "motion/react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ImageInput } from "@/stories/ImageInput";

import type { AppType } from "../api/[[...route]]/route";
import { ReceiptDataField } from "./_components/ReceiptDataField";

interface ReceiptContainerComponent {
	startAnalyze(): void;
}
interface ReceiptProps {
	file: File | undefined;
	ref?: RefObject<ReceiptContainerComponent | null>;
}
function ReceiptContainer({ ref, file }: ReceiptProps): JSX.Element {
	const [started, setStarted] = useState(false);

	/**
	 * 解析が開始されたかどうかの状態は親コンポーネントで管理すべきでないという考えのもと、
	 * 解析を開始するというのは命令的な操作なので、意図的にPropsによる状態管理を避けた。
	 */ {
		useImperativeHandle(ref, () => ({
			startAnalyze: () => {
				setStarted(true);
			},
		}));
	}

	const client = hc<AppType>("/");
	const fetcher = async (args: typeof file) => {
		if (!args) return;
		const res = await client.api.parse.$post({
			form: { file: args },
		});
		if (res.ok) {
			const result = await res.json();
			return result;
		}
	};

	const receiptData = useSWR(() => (started && file ? file : null), fetcher, {
		suspense: true,
	});

	return (
		<ReceiptDataField
			key={`name=${file?.name};loaded=${started}`}
			data={receiptData.data}
		/>
	);
}

export default function Page(): JSX.Element {
	const [file, setFile] = useState<File>();
	const [isPending, startTransition] = useTransition();
	const receiptContainerRef = useRef<ReceiptContainerComponent>(null);

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
						setFile(file);
					}}
				/>
				<Button
					type={"submit"}
					className={clsx(
						"w-full",
						(isPending || !file) && "cursor-not-allowed",
					)}
					disabled={isPending}
					onClick={() => {
						startTransition(() => {
							receiptContainerRef.current?.startAnalyze();
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
				<Suspense>
					<Activity mode={!isPending && file ? "visible" : "hidden"}>
						<ReceiptContainer
							file={file}
							ref={receiptContainerRef}
							key={file?.name}
						/>
					</Activity>
				</Suspense>
			</div>
		</div>
	);
}
