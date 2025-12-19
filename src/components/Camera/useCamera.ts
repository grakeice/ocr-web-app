"use client";

import { useState } from "react";

import { isMobile } from "react-device-detect";

export function useCamera(
	options: MediaStreamConstraints = {
		video: true,
		audio: false,
	},
) {
	const [stream, setStream] = useState<MediaStream>();
	const [isPending, setIsPending] = useState(true);
	const request = async () => {
		try {
			// モバイルだったら外カメ
			const cameraStream = await navigator.mediaDevices.getUserMedia({
				video: isMobile
					? {
							facingMode: { exact: "environment" },
						}
					: options.video,
				audio: options.audio,
			});
			console.log(cameraStream.getVideoTracks()[0].getSettings());

			setStream(cameraStream);
			setIsPending(false);
		} catch (e) {
			console.error(e);
		}
	};
	return { request, stream, isPending };
}
