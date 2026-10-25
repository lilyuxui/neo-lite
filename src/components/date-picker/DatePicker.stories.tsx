import type { Meta, StoryObj } from "@storybook/react-vite";

import { DatePicker } from "./DatePicker";

const october2026 = new Date(2026, 9, 1);
const selectedDate = new Date(2026, 9, 23);

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Date",
  },
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    mode: "single",
    placeholder: "Select a date",
  },
};

export const Range: Story = {
  args: {
    mode: "range",
    placeholder: "Start date - End date",
  },
};

export const ConstrainedDates: Story = {
  name: "Constrained dates",
  render: () => (
    <div className="grid gap-6">
      <DatePicker label="Disabled" disabled />
      <DatePicker
        label="Constrained dates"
        hint="Choose a date from October 2026. Weekends are unavailable."
        defaultValue={selectedDate}
        minDate={october2026}
        maxDate={new Date(2026, 9, 31)}
        isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
      />
    </div>
  ),
};
