"use client";

import { useEffect, useRef, type JSX } from "react";

interface PreviewImageProps {
	file: ArrayBuffer;
}
export function PreviewImage({ file }: PreviewImageProps): JSX.Element {
	const imagePreviewRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const canvas = imagePreviewRef.current;
		if (!file || !canvas) return;
		const image = new Image();
		image.src = URL.createObjectURL(new Blob([file]));
		image.addEventListener("load", () => {
			canvas.width = image.width;
			canvas.height = image.height;
			canvas
				.getContext("2d")
				?.drawImage(image, 0, 0, image.width, image.height);
		});
	}, [file]);
	return (
		<div className={"h-fit w-full"}>
			<canvas
				ref={imagePreviewRef}
				className={"max-w-full object-contain"}
			/>
		</div>
	);
}
