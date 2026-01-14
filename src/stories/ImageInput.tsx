"use client";

import {
	useId,
	useRef,
	useState,
	type ComponentProps,
	type JSX,
	type RefObject,
} from "react";

import { clsx } from "clsx";
import { ImageIcon, ImageUpIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { readFile } from "@/lib/readFile";

import { PreviewImage } from "./PreviewImage";

interface ImageInputProps {
	showPreview?: boolean;
}
export function ImageInput({
	showPreview = true,
	id,
	ref,
	multiple,
	onChange,
	accept = "image/jpeg, image/png",
	...props
}: ImageInputProps & Omit<ComponentProps<"input">, "type">): JSX.Element {
	const [isDraggedOver, setIsDraggedOver] = useState(false);
	const refInner = useRef<HTMLInputElement>(null);
	const fileInputRef = (ref ??
		refInner) as RefObject<HTMLInputElement | null>;
	const idInner = useId();
	const _id = id ?? idInner;
	const [files, setFiles] = useState<{ data: ArrayBuffer; name: string }[]>();

	return (
		<div className={"flex flex-col gap-0"}>
			<InputGroup className={"rounded-b-none"}>
				<InputGroupAddon>
					<ImageIcon />
				</InputGroupAddon>
				<InputGroupInput
					{...props}
					type={"file"}
					onChange={async (e) => {
						onChange?.(e);
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
							data: ArrayBuffer;
							name: string;
						}[];
						if (!files.length) return;
						setFiles(files);
					}}
					ref={fileInputRef}
					id={_id}
					accept={accept}
				/>
			</InputGroup>
			<AnimatePresence>
				<motion.div layout>
					<div
						aria-hidden
						className={clsx(
							"flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-lg rounded-t-none border border-t-0 border-dashed p-12 text-center text-balance",
							isDraggedOver &&
								"border-accent-foreground transition-colors",
						)}
						onClick={() => {
							fileInputRef.current?.click();
						}}
						onDragEnter={() => {
							setIsDraggedOver(true);
						}}
						onDragLeave={() => {
							setIsDraggedOver(false);
						}}
						onDragOver={(e) => {
							const fileItems = [...e.dataTransfer.items].filter(
								(item) => item.kind === "file",
							);
							if (fileItems.length > 0) {
								e.preventDefault();
								if (
									fileItems.some((item) =>
										accept.includes(item.type),
									) &&
									((!multiple && fileItems.length === 1) ||
										multiple) // 複数選択可能かもしくは複数選択不可かつファイル数が1
								) {
									e.dataTransfer.dropEffect = "copy";
								} else {
									e.dataTransfer.dropEffect = "none";
								}
							}
						}}
						onDrop={(e) => {
							setIsDraggedOver(false);
							if (
								[...e.dataTransfer.items].some(
									(item) => item.kind === "file",
								)
							)
								e.preventDefault();
							const input = fileInputRef.current;
							if (!input) return;

							/** Reactはこの操作を監視していないので強制的に発火する */ {
								input.files = e.dataTransfer.files;
								input.dispatchEvent(
									new Event("change", { bubbles: true }),
								);
							}
						}}
					>
						{showPreview && (
							<motion.div
								layout
								className={
									"pointer-events-none flex flex-col items-center justify-center gap-2 select-none"
								}
							>
								{files?.length ? (
									files.map((file) => (
										<PreviewImage
											key={file.name}
											file={file.data}
										/>
									))
								) : (
									<>
										<div
											className={
												"bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6"
											}
										>
											<ImageUpIcon />
										</div>
										<div className={"text-lg font-bold"}>
											画像をアップロードしてください
										</div>
									</>
								)}
							</motion.div>
						)}
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
