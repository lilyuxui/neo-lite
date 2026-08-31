import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";

import { cn } from "../../utils/cn";

type RegisteredTab = {
  value: string;
  disabled: boolean;
  ref: RefObject<HTMLButtonElement | null>;
};

type TabsContextValue = {
  value: string | undefined;
  registerTab: (tab: RegisteredTab) => void;
  unregisterTab: (value: string) => void;
  selectTab: (value: string) => void;
  moveFocus: (currentValue: string, direction: 1 | -1 | "first" | "last") => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("Tab must be used inside Tabs.");
  }

  return context;
}

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
  role,
  ...props
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [tabs, setTabs] = useState<RegisteredTab[]>([]);
  const selectedValue = value ?? uncontrolledValue;
  const isControlled = value !== undefined;

  const enabledTabs = useMemo(
    () => tabs.filter((tab) => !tab.disabled),
    [tabs],
  );

  const selectTab = useCallback(
    (nextValue: string) => {
      const nextTab = tabs.find((tab) => tab.value === nextValue);

      if (!nextTab || nextTab.disabled) {
        return;
      }

      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange, tabs],
  );

  const registerTab = useCallback((tab: RegisteredTab) => {
    setTabs((currentTabs) => {
      const existingIndex = currentTabs.findIndex(
        (currentTab) => currentTab.value === tab.value,
      );

      if (existingIndex === -1) {
        return [...currentTabs, tab];
      }

      return currentTabs.map((currentTab, index) =>
        index === existingIndex ? tab : currentTab,
      );
    });
  }, []);

  const unregisterTab = useCallback((tabValue: string) => {
    setTabs((currentTabs) =>
      currentTabs.filter((tab) => tab.value !== tabValue),
    );
  }, []);

  const moveFocus = useCallback(
    (currentValue: string, direction: 1 | -1 | "first" | "last") => {
      if (enabledTabs.length === 0) {
        return;
      }

      const nextTab =
        direction === "first"
          ? enabledTabs[0]
          : direction === "last"
            ? enabledTabs[enabledTabs.length - 1]
            : enabledTabs[
                (enabledTabs.findIndex((tab) => tab.value === currentValue) +
                  direction +
                  enabledTabs.length) %
                  enabledTabs.length
              ];

      if (!nextTab) {
        return;
      }

      nextTab.ref.current?.focus();
      selectTab(nextTab.value);
    },
    [enabledTabs, selectTab],
  );

  useEffect(() => {
    if (isControlled || selectedValue !== undefined || enabledTabs.length === 0) {
      return;
    }

    setUncontrolledValue(enabledTabs[0].value);
  }, [enabledTabs, isControlled, selectedValue]);

  const contextValue = useMemo<TabsContextValue>(
    () => ({
      value: selectedValue,
      registerTab,
      unregisterTab,
      selectTab,
      moveFocus,
    }),
    [moveFocus, registerTab, selectTab, selectedValue, unregisterTab],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        role={role ?? "tablist"}
        className={cn(
          "inline-flex w-fit items-center gap-1 rounded-sm border border-foreground bg-background p-1",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}
