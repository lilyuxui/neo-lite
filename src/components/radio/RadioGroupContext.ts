import { createContext } from "react";

export interface RadioGroupContextValue {
  name: string;
  value?: string;
  disabled: boolean;
  required: boolean;
  onValueChange: (value: string) => void;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
