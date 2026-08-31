import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "../badge";
import { Button } from "../button";
import { Card, type CardOrientation } from "./Card";

const orientations: CardOrientation[] = ["vertical", "horizontal"];

function CardImage() {
  return (
    <div className="grid size-full min-h-48 place-items-center bg-muted">
      <div className="grid size-24 grid-cols-2 gap-2">
        <div className="border border-border bg-accent" />
        <div className="border border-border bg-background" />
        <div className="border border-border bg-primary" />
        <div className="border border-destructive-border bg-destructive" />
      </div>
    </div>
  );
}

function CardExample({
  orientation = "vertical",
  title = "Neo-Lite Card",
  subtitle = "Component primitive",
}: {
  orientation?: CardOrientation;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div
      className={
        orientation === "horizontal"
          ? "w-[min(100vw-32px,44rem)]"
          : "w-[min(100vw-32px,24rem)]"
      }
    >
      <Card
        orientation={orientation}
        image={<CardImage />}
        badges={
          <>
            <Badge variant="secondary">Badge</Badge>
            <Badge variant="primary">Badge</Badge>
          </>
        }
        subtitle={subtitle}
        title={title}
        footer={
          <>
            <Button variant="accent">Accent</Button>
            <Button variant="primary">Primary</Button>
          </>
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
    orientation: "vertical",
    title: "Neo-Lite Card",
    subtitle: "Component primitive",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: orientations,
    },
    image: {
      table: {
        disable: true,
      },
    },
    badges: {
      table: {
        disable: true,
      },
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
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <CardExample
      orientation={args.orientation}
      title={String(args.title)}
      subtitle={args.subtitle ? String(args.subtitle) : undefined}
    />
  ),
};

export const Vertical: Story = {
  render: () => <CardExample orientation="vertical" />,
};

export const Horizontal: Story = {
  render: () => <CardExample orientation="horizontal" />,
};
