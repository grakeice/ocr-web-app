"use client";

import { useRef } from "react";

import { recognizeText } from "@/lib/recognizeText";

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

function* pickColor(): Generator<string> {
	while (true) {
		yield "red";
		yield "blue";
		yield "orange";
	}
}

export default function Home() {
	// const [text, setText] = useState("");
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
							canvas
								.getContext("2d")
								?.drawImage(img, 0, 0, img.width, img.height);
						});
						const imageBuffer = await readfile(file, "buffer");
						if (!imageBuffer) return;
						const result = await recognizeText(imageBuffer);
						if (!result) return;
						const color = pickColor();
						for (const section of result) {
							console.log(section);
							const context = canvas.getContext("2d");
							const vertices = section.boundingPoly?.vertices;
							if (!context || !vertices) continue;
							context.lineWidth = 3;
							context.strokeStyle = color.next().value;
							context.beginPath();
							for (const [index, vertex] of vertices.entries()) {
								if (!vertex.x || !vertex.y) continue;
								if (index === 0)
									context.moveTo(vertex.x, vertex.y);
								else context.lineTo(vertex.x, vertex.y);
							}
							context.closePath();
							context.stroke();
						}
						console.log(result[0].description);
					}}
				>
					読み込み
				</button>
			</form>
			{/* <p className={"whitespace-pre-wrap"}>{text}</p> */}
			<canvas ref={canvasRef} className={"w-100"} />
		</>
	);
}
