import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import verticalCardImage from "../../assets/images/image_vertical_card.png";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card } from "./Card";

type CardStoryArgs = ComponentProps<typeof Card> & {
  showImage: boolean;
  showBadges: boolean;
  showButtons: boolean;
};

function CardImage() {
  return (
    <img
      src={verticalCardImage}
      alt=""
      className="size-full object-cover"
    />
  );
}

function CardExample({
  title = "Neo-Lite Card",
  subtitle = "Component primitive",
  showImage = true,
  showBadges = true,
  showButtons = true,
}: {
  title?: string;
  subtitle?: string;
  showImage?: boolean;
  showBadges?: boolean;
  showButtons?: boolean;
}) {
  return (
    <div className="w-[min(100vw-32px,24rem)]">
      <Card
        image={showImage ? <CardImage /> : undefined}
        badges={
          showBadges ? (
            <>
              <Badge variant="secondary">Badge</Badge>
              <Badge variant="primary">Badge</Badge>
            </>
          ) : undefined
        }
        subtitle={subtitle}
        title={title}
        footer={
          showButtons ? (
            <>
              <Button variant="accent">Accent</Button>
              <Button variant="primary">Primary</Button>
            </>
          ) : undefined
        }
      >
        A reusable content container with composed badges, body content, and
        footer actions.
      </Card>
    </div>
  );
}

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  args: {
    title: "Neo-Lite Card",
    subtitle: "Component primitive",
    showImage: true,
    showBadges: true,
    showButtons: true,
  },
  argTypes: {
    image: {
      table: {
        disable: true,
      },
    },
    showImage: {
      control: "boolean",
      name: "Show image",
    },
    badges: {
      table: {
        disable: true,
      },
    },
    showBadges: {
      control: "boolean",
      name: "Show badges",
    },
    showButtons: {
      control: "boolean",
      name: "Show buttons",
    },
    children: {
      table: {
        disable: true,
      },
    },
    footer: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<CardStoryArgs>;

export default meta;

type Story = StoryObj<CardStoryArgs>;

export const Playground: Story = {
  render: (args) => (
    <CardExample
      title={String(args.title)}
      subtitle={args.subtitle ? String(args.subtitle) : undefined}
      showImage={args.showImage}
      showBadges={args.showBadges}
      showButtons={args.showButtons}
    />
  ),
};

export const WithoutImage: Story = {
  name: "Without image",
  render: () => <CardExample showImage={false} />,
};
