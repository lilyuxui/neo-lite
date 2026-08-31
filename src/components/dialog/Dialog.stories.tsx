import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "../button";
import { Input } from "../input";
import { Dialog } from "./Dialog";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: "This is the dialog title",
    children: "Dialog content",
  },
  argTypes: {
    open: {
      table: {
        disable: true,
      },
    },
    onOpenChange: {
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
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Edit profile"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary">Submit</Button>
            </>
          }
        >
          <div className="grid gap-4 text-sm leading-[160%] text-foreground">
            <p>Make changes to your profile here. Click save when you're done.</p>
            <Input label="Name" placeholder="Joe Doe" />
            <Input label="Username" placeholder="Placeholder text" />
          </div>
        </Dialog>
      </>
    );
  },
};

export const LongContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open long dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Scrollable dialog"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary">Save</Button>
            </>
          }
        >
          <div className="grid gap-4 text-sm leading-[160%]">
            {Array.from({ length: 12 }, (_, index) => (
              <p key={index}>
                Neo-Lite dialog content can grow naturally while the modal shell
                remains within the viewport. This paragraph is here to exercise
                body scrolling and keyboard reachability.
              </p>
            ))}
          </div>
        </Dialog>
      </>
    );
  },
};

export const WithoutFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Dialog without footer"
        >
          This dialog omits the footer area cleanly.
        </Dialog>
      </>
    );
  },
};
