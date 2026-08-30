import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import xIcon from "../../assets/icons/x.svg";
import { Input } from "./Input";

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function CommandKey() {
  return (
    <kbd className="font-sans text-sm leading-[160%] text-muted-foreground">
      Cmd K
    </kbd>
  );
}

function SearchInputWithClear() {
  const [search, setSearch] = useState("input");

  return (
    <Input
      label="Search"
      type="search"
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      placeholder="Search components"
      className="[&::-webkit-search-cancel-button]:appearance-none"
      leadingDecoration={<SearchIcon />}
      trailingDecoration={
        <button
          type="button"
          aria-label="Clear search"
          className="grid size-4 place-items-center"
          onClick={() => setSearch("")}
        >
          <img src={xIcon} alt="" aria-hidden="true" className="size-4" />
        </button>
      }
      hint="Search by component name."
    />
  );
}

const meta = {
  title: "Components/Input",
  component: Input,
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "tel", "url"],
    },
  },
  args: {
    label: "Email",
    placeholder: "you@example.com",
    hint: "Use your work email.",
    type: "email",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="grid max-w-sm gap-4">
      <Input {...args} />
      <Input label="Name" placeholder="Joe Doe" defaultValue="Joe Doe" />
      <Input label="Disabled" placeholder="Unavailable" disabled />
    </div>
  ),
};

export const WithDecorations: Story = {
  render: () => (
    <div className="grid max-w-sm gap-4">
      <SearchInputWithClear />
      <Input
        label="Command"
        placeholder="Open command menu"
        leadingDecoration={<SearchIcon />}
        trailingDecoration={<CommandKey />}
      />
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div className="grid max-w-sm gap-4">
      <Input
        label="Email"
        type="email"
        defaultValue="wrong"
        error="Enter a valid email address."
      />
      <Input
        label="Search"
        type="search"
        placeholder="Search components"
        leadingDecoration={<SearchIcon />}
        error="No matching component was found."
      />
    </div>
  ),
};
