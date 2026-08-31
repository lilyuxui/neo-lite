import type { Meta, StoryObj } from "@storybook/react-vite";

import { MenuItem } from "./MenuItem";

const meta = {
  title: "Components/Menu Item",
  component: MenuItem,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Menu item",
    disabled: false,
    selected: false,
  },
  argTypes: {
    disabled: {
      control: "boolean",
    },
    selected: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof MenuItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-60">
      <MenuItem {...args} />
    </div>
  ),
};

export const Selected: Story = {
  args: {
    selected: true,
    children: "Selected item",
  },
  render: (args) => (
    <div className="w-60">
      <MenuItem {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled item",
  },
  render: (args) => (
    <div className="w-60">
      <MenuItem {...args} />
    </div>
  ),
};
