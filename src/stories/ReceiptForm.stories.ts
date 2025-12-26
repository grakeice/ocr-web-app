import { type Meta, type StoryObj } from "@storybook/nextjs-vite";

import { ReceiptForm } from "./ReceiptForm";

const meta = {
	component: ReceiptForm,
} satisfies Meta<typeof ReceiptForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
