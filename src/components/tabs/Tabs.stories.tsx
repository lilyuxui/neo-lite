import type { Meta, StoryObj } from "@storybook/react-vite";

import arrowLeftIcon from "../../assets/icons/arrow-left.svg?raw";
import bookmarkIcon from "../../assets/icons/bookmark.svg?raw";
import listFilterIcon from "../../assets/icons/list-filter.svg?raw";
import { Icon } from "../../assets/icons/Icon";
import { Tab, Tabs } from "./";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  args: {
    children: null,
    defaultValue: "overview",
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Tabs {...args}>
      <Tab value="overview">Overview</Tab>
      <Tab value="activity">Activity</Tab>
      <Tab value="settings">Settings</Tab>
    </Tabs>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="saved">
      <Tab value="back" leadingIcon={<Icon svg={arrowLeftIcon} />}>
        Back
      </Tab>
      <Tab value="saved" leadingIcon={<Icon svg={bookmarkIcon} />}>
        Saved
      </Tab>
      <Tab value="filters" leadingIcon={<Icon svg={listFilterIcon} />}>
        Filters
      </Tab>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <Tab value="overview">Overview</Tab>
      <Tab value="activity" disabled>
        Activity
      </Tab>
      <Tab value="settings">Settings</Tab>
    </Tabs>
  ),
};
