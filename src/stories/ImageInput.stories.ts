import { type Meta, type StoryObj } from "@storybook/nextjs-vite";

import { ImageInput } from "./ImageInput";

const meta = {
	component: ImageInput,
} satisfies Meta<typeof ImageInput>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
