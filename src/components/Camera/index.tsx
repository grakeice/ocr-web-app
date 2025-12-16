"use client";

import {
	useEffect,
	useImperativeHandle,
	useRef,
	type ComponentPropsWithRef,
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
}: CameraProps & Omit<ComponentPropsWithRef<"video">, "ref">): JSX.Element {
	const innerRef = useRef<HTMLVideoElement | null>(null);
	const cameraRef = videoRef ?? innerRef;
	const { stream, request, isPending } = useCamera(cameraOptions);

	// 外側から操作できるようにするため
	useImperativeHandle(ref, () => {
		return {
			start() {
				request();
			},
			videoElement: cameraRef.current,
		};
	});

	useEffect(() => {
		if (cameraRef.current && stream) cameraRef.current.srcObject = stream;
	});

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
