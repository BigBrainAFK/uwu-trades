import { forwardRef } from "react";

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const buttonBase =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 " +
  "disabled:cursor-not-allowed disabled:opacity-40";

type ButtonColor = "gray" | "teal" | "red";

const buttonColors: Record<ButtonColor, string> = {
  gray: "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
  teal: "bg-teal-500 text-white hover:bg-teal-600",
  red: "bg-red-500 text-white hover:bg-red-600",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  colorScheme?: ButtonColor;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { colorScheme = "gray", isLoading, disabled, className, children, ...props },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(buttonBase, buttonColors[colorScheme], "px-4 py-2 text-sm", className)}
      {...props}
    >
      {isLoading ? <Spinner className="h-4 w-4" /> : children}
    </button>
  )
);
Button.displayName = "Button";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  colorScheme?: ButtonColor;
  size?: "md" | "lg";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ colorScheme = "gray", size = "md", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        buttonBase,
        buttonColors[colorScheme],
        size === "lg" ? "h-12 w-12 text-2xl" : "h-10 w-10 text-lg",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
IconButton.displayName = "IconButton";

export const inputClass =
  "rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 " +
  "focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 " +
  "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        className ?? "h-8 w-8"
      )}
    />
  );
}
