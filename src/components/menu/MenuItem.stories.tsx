import type { Meta, StoryObj } from "@storybook/react-vite";

import checkIcon from "../../assets/icons/check.svg?raw";
import circleDashedIcon from "../../assets/icons/circle-dashed.svg?raw";
import { Icon } from "../../assets/icons/Icon";
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
    leadingDecoration: <Icon svg={checkIcon} />,
    children: "Selected item",
  },
  render: (args) => (
    <div className="w-60">
      <MenuItem {...args} />
    </div>
  ),
};

export const LeadingDecoration: Story = {
  args: {
    leadingDecoration: <Icon svg={circleDashedIcon} />,
    children: "Decorated item",
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
    leadingDecoration: <Icon svg={circleDashedIcon} />,
    children: "Disabled item",
  },
  render: (args) => (
    <div className="w-60">
      <MenuItem {...args} />
    </div>
  ),
};
