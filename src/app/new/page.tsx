"use client";

import { useActionState, useState, type JSX } from "react";

import { ImageIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { readFile } from "@/lib/readFile";

import { submitImage } from "./_actions/submitImage";
import { PreviewImage } from "./_components/PreviewImage";

export default function Page(): JSX.Element {
	const [state, formAction, isPending] = useActionState(submitImage, null);
	const [file, setFile] = useState<ArrayBuffer>();
	return (
		<div className={"mx-2 mt-4 max-w-100 md:mx-auto"}>
			<form action={formAction}>
				<InputGroup>
					<InputGroupAddon>
						<ImageIcon />
					</InputGroupAddon>
					<InputGroupInput
						type={"file"}
						name={"image"}
						accept={"image/jpeg, image/png"}
						onChange={async (e) => {
							const files = e.currentTarget.files;
							if (!files) return;
							const file = await readFile(files[0], "buffer");
							if (!file) return;
							setFile(file);
						}}
					/>
				</InputGroup>
				{file && <PreviewImage file={file} />}
				<Button className={"w-full"} type={"submit"}>
					<AnimatePresence>
						<motion.span key={"description"} layout>
							読み込む
						</motion.span>
						{isPending && (
							<motion.span
								key={"spinner"}
								layout
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<Spinner />
							</motion.span>
						)}
					</AnimatePresence>
				</Button>
			</form>
			{!isPending && state && (
				<>
					<code>{JSON.stringify(state)}</code>
				</>
			)}
		</div>
	);
}
