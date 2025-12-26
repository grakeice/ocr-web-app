"use client";

import { useActionState, useState, type JSX } from "react";

import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { readFile } from "@/lib/readFile";

import { ImageInput } from "../../stories/ImageInput";
import { submitImage } from "./_actions/submitImage";

export default function Page(): JSX.Element {
	const [state, formAction, isPending] = useActionState(submitImage, null);
	const [, setFiles] = useState<{ data: ArrayBuffer; name: string }[]>();
	return (
		<div className={"mx-2 mt-4 max-w-100 md:mx-auto"}>
			<form action={formAction} className={"flex flex-col gap-4"}>
				<ImageInput
					type={"file"}
					name={"image"}
					onChange={async (e) => {
						const inputtedFiles = e.currentTarget.files;
						if (!inputtedFiles) return;
						const files = (
							await Promise.all(
								[...inputtedFiles].map(async (file) => ({
									data: await readFile(file, "buffer"),
									name: file.name,
								})),
							)
						).filter((item) => !!item.data) as {
							// 型推論が効かなかった
							data: ArrayBuffer;
							name: string;
						}[];
						if (!files.length) return;
						// console.time("Tesseract.jsによるOCRの解析時間");
						// console.log(
						// 	await recognizeText(Buffer.from(files[0].data)),
						// );
						// console.timeEnd("Tesseract.jsによるOCRの解析時間");
						setFiles(files);
					}}
				/>
				<Button className={"w-full"} type={"submit"}>
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
			</form>
			{!isPending && state && (
				<>
					<code>{JSON.stringify(state)}</code>
				</>
			)}
		</div>
	);
}
