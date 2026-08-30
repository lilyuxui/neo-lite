import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { Button, type ButtonSize, type ButtonVariant } from "./Button";

const variants: ButtonVariant[] = ["accent", "primary", "secondary", "destructive"];
const sizes: ButtonSize[] = ["xs", "sm", "lg"];

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ButtonMatrix({
  children,
  leadingIcon,
  trailingIcon,
  iconOnly = false,
  disabled = false,
}: {
  children: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  iconOnly?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-4">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-4">
          {sizes.map((size) => (
            <Button
              key={`${variant}-${size}`}
              variant={variant}
              size={size}
              leadingIcon={leadingIcon}
              trailingIcon={trailingIcon}
              aria-label={iconOnly ? `${variant} ${size}` : undefined}
              disabled={disabled}
            >
              {iconOnly ? <ArrowRightIcon /> : `${children} ${variant} ${size}`}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: variants,
    },
    size: {
      control: "select",
      options: sizes,
    },
  },
  args: {
    children: "Button",
    variant: "accent",
    size: "xs",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <ButtonMatrix>Button</ButtonMatrix>,
};

export const TextOnly: Story = {
  render: () => <ButtonMatrix>Text</ButtonMatrix>,
};

export const LeadingIcon: Story = {
  render: () => <ButtonMatrix leadingIcon={<ArrowLeftIcon />}>Leading</ButtonMatrix>,
};

export const TrailingIcon: Story = {
  render: () => <ButtonMatrix trailingIcon={<ArrowRightIcon />}>Trailing</ButtonMatrix>,
};

export const BothIcons: Story = {
  render: () => (
    <ButtonMatrix leadingIcon={<ArrowLeftIcon />} trailingIcon={<ArrowRightIcon />}>
      Both
    </ButtonMatrix>
  ),
};

export const IconOnly: Story = {
  render: () => <ButtonMatrix iconOnly>Icon only</ButtonMatrix>,
};

export const Disabled: Story = {
  render: () => <ButtonMatrix disabled>Disabled</ButtonMatrix>,
};
