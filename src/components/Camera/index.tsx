"use client";

import {
	useEffect,
	useImperativeHandle,
	useRef,
	type ComponentPropsWithoutRef,
	type JSX,
	type RefObject,
} from "react";

import { isMobile } from "react-device-detect";

import { useCamera } from "./useCamera";

interface CameraProps {
	cameraOptions?: MediaStreamConstraints;
	ref?: RefObject<CameraComponent | null>;
	videoRef?: RefObject<HTMLVideoElement | null>;
}

export interface CameraComponent {
	start(): void;
	pause(): void;
	videoElement: HTMLVideoElement | null;
}

/**
 * カメラを扱うコンポーネント
 * @param props
 *     refを設定すると、`ref.current.start()`を実行することでカメラのリクエストを送ることができる。
 * @returns
 */
export function Camera({
	ref,
	cameraOptions,
	videoRef,
	...props
}: CameraProps & ComponentPropsWithoutRef<"video">): JSX.Element {
	const innerRef = useRef<HTMLVideoElement>(null);
	const cameraRef = videoRef ?? innerRef;
	const { stream, request, isPending } = useCamera(cameraOptions);

	// 外側から操作できるようにするため
	useImperativeHandle(ref, () => {
		return {
			start() {
				request();
			},
			pause() {
				videoRef?.current?.pause();
			},
			videoElement: cameraRef.current,
		};
	});

	// refアクセスをレンダリング後にするためのEffect
	useEffect(() => {
		const video = cameraRef.current;
		if (video) video.srcObject = stream ?? null;

		return () => {
			if (video) video.srcObject = null;
		};
	}, [stream, cameraRef]);

	return (
		<div>
			{isPending ? (
				<>Please allow access to the camera</>
			) : (
				<video
					ref={cameraRef}
					style={{ transform: !isMobile ? "scaleX(-1)" : "unset" }}
					autoPlay
					muted
					{...props}
				/>
			)}
		</div>
	);
}
