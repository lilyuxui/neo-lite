import type { Meta, StoryObj } from "@storybook/react-vite";

import { Calendar } from "./Calendar";

const meta = {
  title: "Components/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  args: {
    defaultMonth: new Date(2026, 9, 1),
    defaultValue: new Date(2026, 9, 23),
    showOutsideDays: true,
  },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
