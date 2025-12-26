import {
	createScheduler,
	createWorker,
	OEM,
	PSM,
	type ImageLike,
} from "tesseract.js";

export async function recognizeText(image: ImageLike) {
	const scheduler = createScheduler();
	const workers = [...Array(4).keys()].map(() =>
		createWorker(["jpn"], OEM.TESSERACT_LSTM_COMBINED),
	);
	for (const worker of await Promise.all(workers)) {
		await worker.setParameters({
			tessedit_pageseg_mode: PSM.AUTO,
			// LSTMモデルで日本語の間にスペースが表示される問題への対処
			preserve_interword_spaces: "1",
		});
		scheduler.addWorker(worker);
	}
	const result = await scheduler.addJob(
		"recognize",
		image,
		{
			rotateAuto: true,
		},
		{
			blocks: true,
			text: true,
		},
	);

	scheduler.terminate();

	return result;
}
