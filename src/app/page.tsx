"use client";

import { useRef } from "react";

import { Camera, type CameraComponent } from "@/components/Camera";
import { RealtimeOCR } from "@/components/RealtimeOCR";

export default function Home() {
	const cameraRef = useRef<CameraComponent>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	return (
		<div>
			<button onClick={() => cameraRef.current?.start()}>
				ボタンだよ
			</button>
			<button onClick={() => cameraRef.current?.pause()}>pause</button>
			<Camera
				ref={cameraRef}
				videoRef={videoRef}
				className={"h-[70vh]"}
			/>
			<RealtimeOCR source={videoRef} />
		</div>
	);
}
