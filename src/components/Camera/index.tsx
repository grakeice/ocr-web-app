"use client";

import {
	useEffect,
	useImperativeHandle,
	useRef,
	type JSX,
	type RefObject,
} from "react";

import { isMobile } from "react-device-detect";

import { useCamera } from "./useCamera";

interface CameraProps {
	cameraOptions?: MediaStreamConstraints;
	ref?: RefObject<CameraComponent | null>;
}

export interface CameraComponent {
	start(): void;
}

/**
 * カメラを扱うコンポーネント
 * @param props
 *     refを設定すると、`ref.current.start()`を実行することでカメラのリクエストを送ることができる。
 * @returns
 */
export function Camera({ ref, cameraOptions }: CameraProps): JSX.Element {
	const cameraRef = useRef<HTMLVideoElement>(null);
	const { stream, request, isPending } = useCamera(cameraOptions);

	// 外側から操作できるようにするため
	useImperativeHandle(ref, () => {
		return {
			start() {
				request();
			},
		};
	});

	useEffect(() => {
		if (cameraRef.current && stream) cameraRef.current.srcObject = stream;
	}, [stream]);

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
				></video>
			)}
		</div>
	);
}
