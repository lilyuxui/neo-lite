import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { RadioButton } from "./RadioButton";
import { RadioGroup } from "./RadioGroup";

const meta = {
  title: "Components/Radio",
  component: RadioGroup,
  subcomponents: { RadioButton },
  parameters: {
    layout: "centered",
  },
  args: {
    name: "radio-story",
    children: null,
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RadioButtonStory: Story = {
  name: "Radio button",
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      <RadioButton name="standalone-options" value="first" label="Heading" description="Description" />
      <RadioButton name="standalone-options" value="second" label="Heading" description="Description" defaultChecked />
    </div>
  ),
};

export const RadioGroupStory: Story = {
  name: "Radio group",
  render: () => (
    <RadioGroup name="delivery" aria-label="Delivery method" defaultValue="delivery">
      <RadioButton value="pickup" label="Pick up" />
      <RadioButton value="delivery" label="Delivery" />
      <RadioButton value="courier" label="Courier" />
    </RadioGroup>
  ),
};

function ControlledExample() {
  const [value, setValue] = useState("standard");

  return (
    <div className="grid gap-4">
      <RadioGroup
        name="plan"
        aria-label="Choose a plan"
        value={value}
        onValueChange={setValue}
      >
        <RadioButton value="standard" label="Standard" />
        <RadioButton value="premium" label="Premium" />
      </RadioGroup>
      <p className="m-0 text-sm leading-[160%] text-subtle-foreground">
        Selected: {value}
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

export const Disabled: Story = {
  render: () => (
    <div className="grid gap-6">
      <RadioGroup name="disabled-group" aria-label="Disabled group" defaultValue="selected" disabled>
        <RadioButton value="selected" label="Selected" />
        <RadioButton value="other" label="Other" />
      </RadioGroup>
      <RadioGroup name="disabled-option" aria-label="Individual option" defaultValue="available">
        <RadioButton value="available" label="Available" />
        <RadioButton value="disabled" label="Unavailable" disabled />
      </RadioGroup>
    </div>
  ),
};
