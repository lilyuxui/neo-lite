export const componentExamples = {
  badge: `import { Badge } from "neo-lite-ui";

export function BadgeExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <Badge variant="accent">Accent</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  );
}`,
  button: `import { Button } from "neo-lite-ui";

export function ButtonExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="accent">Accent</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  );
}`,
  card: `import { Button, Card } from "neo-lite-ui";

export function CardExample() {
  return (
    <Card
      title="Your profile"
      footer={<Button variant="primary">Edit profile</Button>}
    >
      Manage your details in one place.
    </Card>
  );
}`,
  checkbox: `import { Checkbox } from "neo-lite-ui";

export function CheckboxExample() {
  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-2">
        <Checkbox defaultChecked />
        Receive updates
      </label>
      <label className="flex items-center gap-2">
        <Checkbox />
        Save my preferences
      </label>
    </div>
  );
}`,
  dialog: `import { useState } from "react";
import { Button, Dialog } from "neo-lite-ui";

export function DialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog open={open} onOpenChange={setOpen} title="Confirm action">
        This is a Neo-Lite dialog.
      </Dialog>
    </>
  );
}`,
  input: `import { Input } from "neo-lite-ui";

export function InputExample() {
  return (
    <Input
      label="Email"
      type="email"
      placeholder="you@example.com"
    />
  );
}`,
  selection: `import { Selection } from "neo-lite-ui";

const options = [
  { value: "designer", label: "Designer" },
  { value: "developer", label: "Developer" },
  { value: "other", label: "Other" },
];

export function SelectionExample() {
  return <Selection label="Role" options={options} />;
}`,
  tabs: `import { Tab, Tabs } from "neo-lite-ui";

export function TabsExample() {
  return (
    <Tabs defaultValue="overview">
      <Tab value="overview">Overview</Tab>
      <Tab value="activity">Activity</Tab>
      <Tab value="settings">Settings</Tab>
    </Tabs>
  );
}`,
} as const;
