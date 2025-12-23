"use client";

import { useRef, useState } from "react";

import Link from "next/link";

import { ImageIcon } from "lucide-react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

export default function Home() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	return (
		<>
			<Link href={"new"}>読み込む</Link>
			<div className={"mx-auto mt-4 max-w-100"}>
				<form method={"post"}>
					<InputGroup>
						<InputGroupAddon>
							<ImageIcon />
						</InputGroupAddon>
						<InputGroupInput type={"file"} />
					</InputGroup>
				</form>
			</div>
			<div className={"flex w-full flex-col md:flex-row"}>
				<div className={"w-80 object-contain"}>
					<canvas ref={canvasRef} className={"max-w-80"} />
				</div>
			</div>
		</>
	);
}
