"use client";

import { useState } from "react";

import { recognizeText } from "@/lib/recognizeText";

export default function Home() {
	const [text, setText] = useState("");
	return (
		<>
			<input
				type={"file"}
				accept={"image/*"}
				onChange={async (e) => {
					const files = e.currentTarget.files;

					if (!files) return;

					const file = files[0];

					const { data } = await recognizeText(file);

					console.log(data);

					setText(data.text);
				}}
			/>
			<p className={"whitespace-pre-wrap"}>{text}</p>
		</>
	);
}
