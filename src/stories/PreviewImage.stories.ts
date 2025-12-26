import { type Meta, type StoryObj } from "@storybook/nextjs-vite";

import { PreviewImage } from "./PreviewImage";

const meta = {
	component: PreviewImage,
} satisfies Meta<typeof PreviewImage>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		file: new ArrayBuffer(),
	},
};
