import {
	createScheduler,
	createWorker,
	OEM,
	type ImageLike,
} from "tesseract.js";

export async function recognizeText(image: ImageLike) {
	const scheduler = createScheduler();
	const workers = [...Array(4).keys()].map(() =>
		createWorker("jpn", OEM.TESSERACT_LSTM_COMBINED),
	);
	for (const worker of await Promise.all(workers)) {
		scheduler.addWorker(worker);
	}
	const result = await scheduler.addJob("recognize", image);

	await scheduler.terminate();

	return result;
}
