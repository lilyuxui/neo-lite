import type { Meta, StoryObj } from "@storybook/react-vite";

import { Menu, MenuItem } from "./";

const meta = {
  title: "Components/Menu",
  component: Menu,
  parameters: {
    layout: "centered",
  },
  args: {
    children: (
      <>
        <MenuItem>Profile</MenuItem>
        <MenuItem selected>Billing</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem disabled>Disabled item</MenuItem>
      </>
    ),
  },
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-64">
      <Menu {...args} />
    </div>
  ),
};

export const Surface: Story = {
  render: () => (
    <div className="w-80">
      <Menu>
        <MenuItem>Account</MenuItem>
        <MenuItem>Team</MenuItem>
        <MenuItem selected>Component library</MenuItem>
        <MenuItem>Keyboard shortcuts</MenuItem>
        <MenuItem disabled>Archived workspace</MenuItem>
      </Menu>
    </div>
  ),
};

export const FluidWidth: Story = {
  render: () => (
    <div className="grid w-[min(32rem,80vw)] gap-4">
      <Menu>
        <MenuItem>Short label</MenuItem>
        <MenuItem selected>
          Longer selected item that stretches with its parent container
        </MenuItem>
        <MenuItem>Another action</MenuItem>
      </Menu>
    </div>
  ),
};
