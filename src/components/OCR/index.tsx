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
	const scheduler = createScheduler();
	const [text, setText] = useState("");
	const [isPending, setIsPending] = useState(true);

	const getVideoSize = useRef(() => {
		if (source.current) {
			return {
				width: source.current.videoWidth,
				height: source.current.videoHeight,
			};
		} else {
			return {
				width: 0,
				height: 0,
			};
		}
	});

	const doOCR = useEffectEvent(
		async ({ width, height }: { width: number; height: number }) => {
			if (source.current && !isPending) {
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				canvas
					.getContext("2d")
					?.drawImage(source.current, 0, 0, width, height);
				const {
					data: { text },
				} = await scheduler.addJob("recognize", canvas);
				setText(text);
			}
		},
	);

	const [initialized, setInitialized] = useState(false);
	const initialize = async () => {
		for (const _ of [...Array(4).keys()]) {
			const worker = await createWorker(
				"jpn",
				OEM.TESSERACT_LSTM_COMBINED,
			);
			scheduler.addWorker(worker);
			console.log("worker added");
		}
		setIsPending(false);
	};
	if (!initialized) {
		initialize();
		setInitialized(true);
	}

	useEffect(() => {
		const timer = setInterval(() => doOCR(getVideoSize.current()), 1000);
		return () => {
			setInitialized(false);
			setIsPending(true);
			scheduler.terminate();
			clearInterval(timer);
		};
	}, [scheduler]);

	return <>{text}</>;
}
