import { Menu as HeadlessMenu } from "@headlessui/react";
import type * as PopperJS from "@popperjs/core";
import { cva } from "class-variance-authority";
import Link, { type LinkProps } from "next/link";
import {
  type ReactNode,
  forwardRef,
  useState,
  type MouseEvent,
  type ElementType,
  type ReactElement,
  type FC,
} from "react";
import { usePopper } from "react-popper";
import { twMerge } from "tailwind-merge";
import { prpx } from "prpx";
import { type PolymorphicComponentProps } from "./types";

export type MenuProps = {
  /**
   * Placement of the menu relative to the button
   *
   * Default 'auto-end'
   */
  placement?: PopperJS.Placement;
  isFullWidth?: boolean;
  children: ReactNode;
  outerProps?: Parameters<typeof HeadlessMenu>[0];
} & Parameters<typeof HeadlessMenu.Button>[0];

export const Menu = forwardRef<HTMLButtonElement, MenuProps>(
  (
    {
      children,
      placement = "bottom-end",
      isFullWidth = false,
      outerProps = {},
      ...props
    },
    ref,
  ) => {
    const [buttonElement, setButtonElement] = useState<HTMLElement | null>(
      null,
    );
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
      null,
    );

    const { styles, attributes } = usePopper(buttonElement, popperElement, {
      placement,
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 12],
          },
        },
      ],
    });

    return (
      <HeadlessMenu
        {...prpx(
          {
            as: "div",
            className: twMerge(
              "relative inline-block text-left",
              isFullWidth && "w-full",
            ),
          },
          outerProps,
        )}
      >
        <HeadlessMenu.Button
          onClick={(e: MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
          {...prpx({ ref }, { ref: setButtonElement }, props)}
        />
        <HeadlessMenu.Items
          style={styles.popper}
          ref={setPopperElement}
          {...attributes.popper}
          className={twMerge(
            "absolute right-0 z-10 w-full origin-top-right focus:outline-none",
            !isFullWidth && "w-56",
          )}
        >
          <div
            className={twMerge(
              "overflow-hidden rounded-md border bg-zinc-50 py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800/50",
              isFullWidth && "mx-2",
            )}
          >
            {children}
          </div>
        </HeadlessMenu.Items>
      </HeadlessMenu>
    );
  },
) as ReturnType<typeof forwardRef<HTMLButtonElement, MenuProps>> & {
  Item: <C extends ElementType>(props: MenuItemProps<C>) => ReactElement;
  Divider: FC<JSX.IntrinsicElements["hr"]>;
};

Menu.displayName = "Menu";

type MenuItemProps<C extends ElementType> = PolymorphicComponentProps<
  C,
  {
    href?: LinkProps["href"];
    label: string;
    variant?: "primary" | "destructive" | undefined;
    isPrimary?: boolean;
  }
>;

Menu.Item = function MenuItem<C extends ElementType>({
  onClick,
  href,
  label,
  variant,
  className,
  ...props
}: MenuItemProps<C>) {
  let Component: ElementType = "div";
  if (href !== undefined) Component = Link;
  if (onClick !== undefined) Component = "button";

  return (
    <HeadlessMenu.Item>
      {({ active }) => (
        <Component
          {...prpx(
            {
              href,
              onClick,
              className: cva(
                "group flex w-full items-center gap-3 px-4 py-2 text-sm",
                {
                  variants: {
                    active: {
                      true: "",
                      false: "",
                    },
                    variant: {
                      destructive: "",
                      primary: "font-semibold",
                    },
                  },
                  compoundVariants: [
                    {
                      active: true,
                      variant: undefined,
                      className:
                        "bg-zinc-50 text-zinc-900 dark:bg-zinc-800/50 dark:text-white",
                    },
                    {
                      active: false,
                      variant: undefined,
                      className: "text-zinc-700 dark:text-zinc-300",
                    },
                    {
                      active: true,
                      variant: "destructive",
                      className:
                        "bg-danger-100 text-danger-900 dark:bg-danger-900 dark:text-white",
                    },
                    {
                      active: false,
                      variant: "destructive",
                      className: "text-danger-700 dark:text-danger-300",
                    },
                    {
                      active: true,
                      variant: "primary",
                      className: "bg-zinc-800 text-zinc-100 dark:bg-zinc-700",
                    },
                    {
                      active: false,
                      variant: "primary",
                      className: " text-zinc-100",
                    },
                  ],
                },
              )({
                active,
                variant,
              }),
            },
            { ...props, className: className ?? "" },
          )}
        >
          <span className="flex-grow truncate text-left">{label}</span>
        </Component>
      )}
    </HeadlessMenu.Item>
  );
};

Menu.Divider = function MenuDivider() {
  return <hr className="my-1" />;
};
