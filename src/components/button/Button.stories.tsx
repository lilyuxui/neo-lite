import type { Meta, StoryObj } from "@storybook/react-vite";

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

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {sizes.map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

export const TextOnly: Story = {
  args: {
    children: "Continue",
  },
};

export const LeadingIcon: Story = {
  args: {
    children: "Back",
    leadingIcon: <ArrowLeftIcon />,
  },
};

export const TrailingIcon: Story = {
  args: {
    children: "Next",
    trailingIcon: <ArrowRightIcon />,
  },
};

export const BothIcons: Story = {
  args: {
    children: "Move",
    leadingIcon: <ArrowLeftIcon />,
    trailingIcon: <ArrowRightIcon />,
  },
};

export const IconOnly: Story = {
  args: {
    "aria-label": "Next",
    children: <ArrowRightIcon />,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const Hover: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {variants.map((variant) => (
        <Button
          key={variant}
          variant={variant}
          className={variant === "primary" ? "bg-primary-hover shadow-md" : "shadow-md"}
        >
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const FocusVisible: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {variants.map((variant) => (
        <Button
          key={variant}
          variant={variant}
          className={
            variant === "destructive"
              ? "shadow-destructive-focus"
              : "shadow-focus"
          }
        >
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const VariantSizeMatrix: Story = {
  render: () => (
    <div className="grid gap-4">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-4">
          {sizes.map((size) => (
            <Button key={`${variant}-${size}`} variant={variant} size={size}>
              {variant} {size}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};
