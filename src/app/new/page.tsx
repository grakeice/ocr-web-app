"use client";

import { Fragment, useActionState, useEffect, useState, type JSX } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import type { z } from "zod";

import { ReceiptForm } from "@/app/new/_components/ReceiptForm";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { readFile } from "@/lib/readFile";
import { receiptSchema } from "@/schemas/receiptSchema";
import { ImageInput } from "@/stories/ImageInput";

import { submitImage } from "./_actions/submitImage";

export default function Page(): JSX.Element {
	const [state, formAction, isPending] = useActionState(submitImage, null);
	const [, setFiles] = useState<{ data: ArrayBuffer; name: string }[]>();
	const form = useForm<z.infer<typeof receiptSchema>>({
		resolver: zodResolver(receiptSchema) as unknown as Resolver<
			z.infer<typeof receiptSchema>
		>,
		defaultValues: {
			items: [
				{ name: "", price: 0, count: 0, discount: 0, totalPrice: 0 },
			],
		},
	});
	const { fields, remove } = useFieldArray({
		control: form.control,
		name: "items",
	});

	const onSubmit = (data: z.infer<typeof receiptSchema>) => {
		console.log(data);
	};

	useEffect(() => {
		form.reset({ items: state?.items });
	}, [form, state]);
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
				<Button
					type={"submit"}
					className={clsx(
						"w-full",
						!isPending && state && "cursor-not-allowed",
					)}
					disabled={Boolean(!isPending && state)}
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
			</form>
			{!isPending && state && (
				<>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className={"my-4 flex flex-col gap-8"}>
							{fields.map((field, index) => (
								<Fragment key={field.id}>
									<hr />
									<ReceiptForm
										index={index}
										control={form.control}
										onRemove={remove}
									/>
								</Fragment>
							))}
							<Button type={"submit"} className={"w-full"}>
								保存する
							</Button>
						</div>
					</form>
				</>
			)}
		</div>
	);
}
