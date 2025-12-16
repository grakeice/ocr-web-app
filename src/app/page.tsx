"use client";

import { useRef } from "react";

import { Camera, type CameraComponent } from "@/components/Camera";
import { OCR } from "@/components/OCR";

export default function Home() {
	const cameraRef = useRef<CameraComponent>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	return (
		<div>
			<button onClick={() => cameraRef.current?.start()}>
				ボタンだよ
			</button>
			<Camera ref={cameraRef} videoRef={videoRef} />
			<OCR source={videoRef} />
		</div>
	);
}
