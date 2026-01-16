"use client";

import {
	useEffect,
	useEffectEvent,
	useMemo,
	useRef,
	useState,
	type JSX,
	type RefObject,
} from "react";

import { createScheduler, createWorker, OEM, PSM } from "tesseract.js";

interface RealtimeOCRProps {
	source: RefObject<HTMLVideoElement | null>;
}

export function RealtimeOCR({ source }: RealtimeOCRProps): JSX.Element {
	const scheduler = useMemo(() => createScheduler(), []);
	const isPending = useRef(true);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [text, setText] = useState("");

	const doOCR = useEffectEvent(async () => {
		const canvas = canvasRef.current;

		if (source.current && !isPending.current && canvas) {
			// console.log(source.current);
			canvas.width = source.current.videoWidth;
			canvas.height = source.current.videoHeight;
			canvas
				.getContext("2d")
				?.drawImage(
					source.current,
					0,
					0,
					source.current.videoWidth,
					source.current.videoHeight,
				);
			const { data } = await scheduler.addJob(
				"recognize",
				source.current,
			);
			setText(data.text);
		}
	});

	useEffect(() => {
		const canvas = document.createElement("canvas");
		canvasRef.current = canvas;

		(async () => {
			const workers = [...Array(1).keys()].map(() =>
				createWorker(["jpn", "eng"], OEM.TESSERACT_LSTM_COMBINED),
			);

			for (const worker of await Promise.all(workers)) {
				await worker.setParameters({
					tessedit_pageseg_mode: PSM.AUTO,
					// LSTMモデルで日本語の間にスペースが表示される問題への対処
					preserve_interword_spaces: "1",
				});
				console.log("worker added");
				scheduler.addWorker(worker);
			}

			isPending.current = false;
		})();

		const timer = setInterval(() => doOCR(), 1000);

		return () => {
			(async () => {
				clearInterval(timer);
				isPending.current = true;
				canvasRef.current = null;
				await scheduler.terminate();
			})();
		};
	}, [scheduler]);

	return (
		<div>
			<div id={"canvas"}></div>
			{text}
		</div>
	);
}
