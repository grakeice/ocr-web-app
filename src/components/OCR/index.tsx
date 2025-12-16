"use client";

import {
	useEffect,
	useEffectEvent,
	useRef,
	useState,
	type JSX,
	type RefObject,
} from "react";

import { createScheduler, createWorker, OEM } from "tesseract.js";

interface OCRProps {
	source: RefObject<HTMLVideoElement | null>;
}

export function OCR({ source }: OCRProps): JSX.Element {
	const scheduler = useRef(createScheduler());
	const isPending = useRef(true);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [text, setText] = useState("");

	const doOCR = useEffectEvent(async () => {
		const canvas = canvasRef.current;

		if (source.current && !isPending.current && canvas) {
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
			const { data } = await scheduler.current.addJob(
				"recognize",
				canvas,
			);
			setText(data.text);
		}
	});

	useEffect(() => {
		const _scheduler = scheduler.current;

		const canvas = document.createElement("canvas");
		canvasRef.current = canvas;

		(async () => {
			const workers = [...Array(4).keys()].map(() =>
				createWorker("jpn", OEM.TESSERACT_LSTM_COMBINED),
			);

			for (const worker of await Promise.all(workers)) {
				console.log("worker added");
				_scheduler.addWorker(worker);
			}

			isPending.current = false;
		})();

		const timer = setInterval(() => doOCR(), 1000);

		return () => {
			(async () => {
				clearInterval(timer);
				isPending.current = true;
				canvasRef.current = null;
				await _scheduler.terminate();
			})();
		};
	}, []);

	return <>{text}</>;
}
