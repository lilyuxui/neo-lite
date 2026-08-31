import type { Meta, StoryObj } from "@storybook/react-vite";

import { Selection, type SelectionOption } from "./Selection";

const options: SelectionOption[] = [
  { value: "button", label: "Button" },
  { value: "input", label: "Input" },
  { value: "checkbox", label: "Checkbox" },
  { value: "selection", label: "Selection" },
  { value: "menu", label: "Menu", disabled: true },
];

const meta = {
  title: "Components/Selection",
  component: Selection,
  parameters: {
    layout: "centered",
  },
  args: {
    options,
    label: "Component",
    placeholder: "Select a component",
    disabled: false,
    error: false,
    required: false,
  },
  argTypes: {
    disabled: {
      control: "boolean",
    },
    error: {
      control: "boolean",
    },
    required: {
      control: "boolean",
    },
    value: {
      table: {
        disable: true,
      },
    },
    defaultValue: {
      table: {
        disable: true,
      },
    },
    onValueChange: {
      table: {
        disable: true,
      },
    },
    options: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Selection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-64">
      <Selection {...args} defaultValue="input" />
    </div>
  ),
};

export const Error: Story = {
  args: {
    error: true,
    label: "Component",
    placeholder: "Select a component",
  },
  render: (args) => (
    <div className="w-64">
      <Selection {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "checkbox",
  },
  render: (args) => (
    <div className="w-64">
      <Selection {...args} />
    </div>
  ),
};
