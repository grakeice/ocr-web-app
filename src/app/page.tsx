"use client";

import { useRef } from "react";

import type { google } from "@google-cloud/vision/build/protos/protos";

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

function parseReceiptAnnotations(
	textAnnotations: google.cloud.vision.v1.IEntityAnnotation[],
	yTolerance = 10,
) {
	// データがない場合は空配列を返す
	if (!textAnnotations || textAnnotations.length <= 1) {
		return [];
	}

	// 1. 0番目(全文)を除外し、座標計算用のデータをマッピング
	const words = textAnnotations.slice(1).map((annotation) => {
		const vertices = annotation.boundingPoly?.vertices;
		if (!vertices) return;

		// 頂点データがない場合のガード
		const yValues = vertices.map((v) => v.y || 0);
		const xValues = vertices.map((v) => v.x || 0);

		const minY = Math.min(...yValues);
		const maxY = Math.max(...yValues);
		const minX = Math.min(...xValues);

		return {
			text: annotation.description,
			centerY: (minY + maxY) / 2, // 行判定用の中心Y座標
			minX: minX, // 行内の並び順用の左端X座標
		};
	});

	// 2. Y座標（上から下）でソート
	words.sort((a, b) => {
		if (a && b) return a.centerY - b.centerY;
		else return 0;
	});

	// 3. 行ごとのグルーピング
	const lines = [];
	if (words.length > 0) {
		let currentLine = [words[0]];

		for (let i = 1; i < words.length; i++) {
			const currentWord = words[i];
			const prevWord = currentLine[currentLine.length - 1];
			if (!currentWord || !prevWord) continue;
			// 前の単語とのY中心差が閾値以内なら同じ行とする
			if (
				Math.abs(currentWord.centerY - prevWord.centerY) <= yTolerance
			) {
				currentLine.push(currentWord);
			} else {
				lines.push(currentLine);
				currentLine = [currentWord];
			}
		}
		lines.push(currentLine);
	}

	// 4. 行内でX座標順にソートして結合
	return lines.map((line) => {
		line.sort((a, b) => {
			if (a && b) return a.minX - b.minX;
			else return 0;
		});
		return line.map((w) => w?.text).join(" "); // 単語間はスペース区切り
	});
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
							console.log(img.width, img.height);
							canvas
								.getContext("2d")
								?.drawImage(img, 0, 0, img.width, img.height);
						});
						const imageBuffer = await readfile(file, "buffer");
						if (!imageBuffer) return;
						const { detections: result, fullTextAnnotation } =
							await recognizeText(imageBuffer);
						if (!result) return;
						const color = pickColor();
						for (const section of result) {
							console.log(section);
							const context = canvas.getContext("2d");
							const vertices = section.boundingPoly?.vertices;
							if (!context || !vertices) continue;
							context.lineWidth = img.width / 150;
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
						console.log(result, fullTextAnnotation);
						console.log(parseReceiptAnnotations(result, 20));
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
