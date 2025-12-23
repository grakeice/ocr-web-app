type readFileResult<T> = T extends "buffer"
	? ArrayBuffer | null
	: T extends "url"
		? string | null
		: T extends "blob"
			? Blob
			: never;
export async function readFile<T extends "buffer" | "url" | "blob">(
	file: File,
	type: T,
): Promise<readFileResult<T>> {
	const reader = new FileReader();
	if (type === "url") reader.readAsDataURL(file);
	else reader.readAsArrayBuffer(file);

	return new Promise((resolve) => {
		reader.addEventListener("load", () => {
			resolve(
				type !== "blob"
					? (reader.result as readFileResult<T>)
					: (new Blob([
							reader.result as ArrayBuffer,
						]) as readFileResult<T>),
			);
		});
	});
}
