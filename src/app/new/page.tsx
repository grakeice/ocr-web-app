"use client";

import { useActionState, type JSX } from "react";

import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { submitImage } from "./_actions/submitImage";
import { ImageInput } from "./_components/ImageInput";

export default function Page(): JSX.Element {
	const [state, formAction, isPending] = useActionState(submitImage, null);

	return (
		<div className={"mx-2 mt-4 max-w-100 md:mx-auto"}>
			<form action={formAction} className={"flex flex-col gap-4"}>
				<ImageInput type={"file"} name={"image"} />

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
