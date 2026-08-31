import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import checkIcon from "../../assets/icons/check.svg?raw";
import { Icon } from "../../assets/icons/Icon";
import { Menu, MenuItem } from "./";

const menuItems = [
  { value: "profile", label: "Profile" },
  { value: "billing", label: "Billing" },
  { value: "settings", label: "Settings" },
  { value: "archive", label: "Archived workspace", disabled: true },
];

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
        <MenuItem selected leadingDecoration={<Icon svg={checkIcon} />}>
          Billing
        </MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem disabled>Disabled item</MenuItem>
      </>
    ),
  },
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [selectedValue, setSelectedValue] = useState("billing");

    return (
      <div className="w-64">
        <Menu {...args}>
          {menuItems.map((item) => {
            const selected = item.value === selectedValue;

            return (
              <MenuItem
                key={item.value}
                selected={selected}
                disabled={item.disabled}
                leadingDecoration={
                  selected ? <Icon svg={checkIcon} /> : undefined
                }
                aria-pressed={selected}
                onClick={() => setSelectedValue(item.value)}
              >
                {item.label}
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    );
  },
};

export const Surface: Story = {
  render: () => (
    <div className="w-80">
      <Menu>
        <MenuItem>Account</MenuItem>
        <MenuItem>Team</MenuItem>
        <MenuItem selected leadingDecoration={<Icon svg={checkIcon} />}>
          Component library
        </MenuItem>
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
        <MenuItem selected leadingDecoration={<Icon svg={checkIcon} />}>
          Longer selected item that stretches with its parent container
        </MenuItem>
        <MenuItem>Another action</MenuItem>
      </Menu>
    </div>
  ),
};
