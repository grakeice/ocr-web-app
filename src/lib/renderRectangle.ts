"use client";

export function renderRectangle({
	canvas,
	vertices,
	lineWidth,
	color,
}: {
	canvas: HTMLCanvasElement;
	vertices: { x: number; y: number }[];
	lineWidth: number;
	color: string;
}) {
	const context = canvas.getContext("2d");
	if (!context || !vertices) return;
	context.lineWidth = lineWidth;
	context.strokeStyle = color;
	context.beginPath();
	for (const [index, vertex] of vertices.entries()) {
		const { x, y } = vertex;
		if (!x || !y) continue;
		if (index === 0) context.moveTo(x, y);
		else context.lineTo(x, y);
	}
	context.closePath();
	context.stroke();
}
