import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import xIcon from "../../assets/icons/x.svg?raw";
import { Icon } from "../../assets/icons/Icon";
import { cn } from "../../utils/cn";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: ReactNode;
  children: ReactNode;

  footer?: ReactNode;

  closeLabel?: string;
  className?: string;
}

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusableElements(element: HTMLElement) {
  return Array.from(
    element.querySelectorAll<HTMLElement>(focusableSelector),
  ).filter((node) => !node.hasAttribute("disabled") && !node.getAttribute("aria-hidden"));
}

export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  footer,
  closeLabel = "Close dialog",
  className,
}: DialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocusedElementRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onOpenChange, open]);

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !dialogRef.current) {
      return;
    }

    const focusableElements = getFocusableElements(dialogRef.current);

    if (focusableElements.length === 0) {
      event.preventDefault();
      dialogRef.current.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(0,0,0,0.2)] p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "flex max-h-[calc(100vh-32px)] w-[min(640px,calc(100vw-32px))] flex-col overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-md",
          className,
        )}
        onKeyDown={handleDialogKeyDown}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex w-full items-center justify-between border-b border-border p-4">
          <h2
            id={titleId}
            className="font-sans text-xl font-bold leading-[140%] text-card-foreground"
          >
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label={closeLabel}
            className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-transparent p-[2px] text-card-foreground outline-none transition-[background-color,border-color] duration-[var(--duration)] ease-[var(--easing)] hover:bg-hover focus-visible:border-focus-ring focus-visible:hover:bg-hover [&_[data-neo-lite-icon]]:size-6"
            onClick={() => onOpenChange(false)}
          >
            <Icon svg={xIcon} />
          </button>
        </div>

        <div
          className={cn(
            "w-full overflow-y-auto p-4",
            footer ? "border-b border-border" : undefined,
          )}
        >
          {children}
        </div>

        {footer ? (
          <div className="flex w-full items-center justify-end gap-2 p-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
