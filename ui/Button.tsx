import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import { cva } from "class-variance-authority";

export type ButtonVariant = "primary" | "secondary" | "destructive";

export const buttonVariants = cva(
  "inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none",
  {
    variants: {
      variant: {
        primary:
          "bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70",
        secondary:
          "bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70",
        destructive:
          "bg-red-600 font-medium text-white hover:bg-red-700 active:bg-red-800",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

type ButtonProps = {
  variant?: ButtonVariant;
} & (
  | (ComponentPropsWithoutRef<"button"> & { href?: undefined })
  | ComponentPropsWithoutRef<typeof Link>
);

export function Button({ variant, className, ...props }: ButtonProps) {
  className = clsx(buttonVariants({ variant }), className);

  return typeof props.href === "undefined" ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  );
}
