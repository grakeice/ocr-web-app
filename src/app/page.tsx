"use client";

import { useRef, useState } from "react";

import { image2ReceiptData } from "@/lib/image2ReceiptData";

type Result<T> = T extends "buffer"
	? ArrayBuffer | null
	: T extends "url"
		? string | null
		: T extends "blob"
			? Blob
			: never;
async function readfile<T extends "buffer" | "url" | "blob">(
	file: File,
	type: T,
): Promise<Result<T>> {
	const reader = new FileReader();
	if (type === "url") reader.readAsDataURL(file);
	else reader.readAsArrayBuffer(file);

	return new Promise((resolve) => {
		reader.addEventListener("load", () => {
			resolve(
				type !== "blob"
					? (reader.result as Result<T>)
					: (new Blob([reader.result as ArrayBuffer]) as Result<T>),
			);
		});
	});
}

export default function Home() {
	const [text, setText] = useState("");
	const fileRef = useRef<HTMLInputElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	return (
		<>
			<form method={"post"}>
				<input
					type={"file"}
					accept={"image/*"}
					ref={fileRef}
					onSubmit={async (e) => {
						e.preventDefault();
						const files = e.currentTarget.files;

						if (!files) return;

						const file = files[0];

						const image = await readfile(file, "buffer");

						console.log(image);
						// const result = await recognizeText(image);

						// console.log(result);
						// setText(data.text);
					}}
				/>
				<button
					type={"button"}
					onClick={async () => {
						const files = fileRef?.current?.files;
						if (!files || !canvasRef.current) return;
						const canvas = canvasRef?.current;

						const file = files[0];

						const image = await readfile(file, "blob");
						if (!image) return;
						const img = new Image();
						img.src = URL.createObjectURL(image);
						console.log(img.src);
						img.addEventListener("load", () => {
							canvas.width = img.width;
							canvas.height = img.height;
							console.log(img.width, img.height);
							canvas
								.getContext("2d")
								?.drawImage(img, 0, 0, img.width, img.height);
						});
						const imageBuffer = await readfile(file, "buffer");
						if (!imageBuffer) return;
						const data = await image2ReceiptData(imageBuffer);
						setText(JSON.stringify(data));
						console.log(data);
					}}
				>
					読み込み
				</button>
			</form>
			<div className={"flex w-full flex-col md:flex-row"}>
				<div className={"w-80 object-contain"}>
					<canvas ref={canvasRef} className={"max-w-80"} />
				</div>
				<code className={"whitespace-pre-wrap"}>{text}</code>
			</div>
		</>
	);
}
