import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    "aria-label": "Select item",
    disabled: false,
    error: false,
    required: false,
  },
  argTypes: {
    checked: {
      control: "boolean",
      table: {
        disable: true,
      },
    },
    disabled: {
      control: "boolean",
    },
    error: {
      control: "boolean",
    },
    required: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    error: false,
    required: false
  }
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
};
