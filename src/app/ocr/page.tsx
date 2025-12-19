"use client";

import { useState, type JSX } from "react";

import { recognizeText } from "./recognizeText";

export default function OCR(): JSX.Element {
	const [text, setText] = useState("");
	return (
		<>
			<input
				type={"file"}
				onChange={async (e) => {
					const files = e.currentTarget.files;

					if (!files) return;

					const file = files[0];

					const { data } = await recognizeText(file);
					setText(data.text);
				}}
			/>
			{text}
		</>
	);
}
