import type { Meta, StoryObj } from "@storybook/react-vite";

import bookmarkIcon from "../../assets/icons/bookmark.svg?raw";
import { Icon } from "../../assets/icons/Icon";
import { Badge, type BadgeVariant } from "./Badge";

const variants: BadgeVariant[] = [
  "accent",
  "secondary",
  "primary",
  "destructive",
];

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Badge",
    variant: "accent",
  },
  argTypes: {
    variant: {
      control: "select",
      options: variants,
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Badge {...args} />,
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {variants.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {variants.map((variant) => (
        <Badge
          key={variant}
          variant={variant}
          leadingIcon={<Icon svg={bookmarkIcon} />}
        >
          {variant}
        </Badge>
      ))}
    </div>
  ),
};
