import type { ReactNode, Ref } from "react";
import { forwardRef, Fragment, useCallback, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { cva } from "class-variance-authority";
import { Check, ChevronsUpDown } from "lucide-react";
import { prpx } from "prpx";
import { usePopper } from "react-popper";
import { twMerge } from "tailwind-merge";

import type { FormInputProps } from "./utils";
import { mergeRefs, useFormInputProps } from "./utils";

export type SelectProps<T> = {
  renderRow?: (value: T) => ReactNode;
  options: T extends string ? string[] : T[];
  onBlur?: JSX.IntrinsicElements["button"]["onBlur"];
  inputProps?: JSX.IntrinsicElements["button"];
} & (
  | {
      onChange?: (value: string | number | undefined) => void;
      value?: string | number;
    }
  | {
      onChange: never;
      value: never;
    }
) &
  FormInputProps &
  Parameters<typeof Listbox>[0];

const selectVariants = cva(
  "text-zinc-900  focus-within:z-20 relative w-full cursor-default rounded-md border bg-zinc-50 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:select-none disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-100 sm:text-sm",
  {
    variants: {
      state: {
        error:
          "border-red-400 focus:border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500",
        success:
          "border-green-400 focus:border-green-500 text-green-900 placeholder-green-300 focus:ring-green-500 dark:text-green-400",
        default:
          "dark:border-zinc-700 border-zinc-300 focus:ring-zinc-500 focus:border-zinc-500",
      },
    },
  },
);

const selectIconVariants = cva(
  "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2",
  {
    variants: {
      state: {
        error: "text-red-400",
        success: "text-green-400",
        default: "dark:text-zinc-100 text-zinc-900",
      },
    },
  },
);

export const Select = forwardRef(function Select<
  T extends ({ id: string | number } & Record<string, unknown>) | string,
>(props: SelectProps<T>, forwardedRef: Ref<HTMLButtonElement>) {
  const {
    id,
    value: controlledSelected = null,
    onChange: controlledSetSelected = null,
    renderRow = (value: T) => (typeof value === "string" ? value : value.id),
    state,
    isDisabled,
    options,
    isFullWidth,
    inputProps,
    placeholder,
    ...rest
  } = useFormInputProps(props);

  const selectRef = useCallback(
    (node: HTMLButtonElement | null) => {
      node?.setAttribute("id", id);
    },
    [id],
  );
  const ref = mergeRefs([selectRef, forwardedRef]);

  const [uncontrolledSelected, uncontrolledSetSelected] = useState<
    string | number | undefined
  >();

  const setSelected = controlledSetSelected ?? uncontrolledSetSelected;

  const selected = controlledSelected ?? uncontrolledSelected ?? null;

  const getOptionKey = (option: T) =>
    typeof option === "string" || typeof option === "number"
      ? option
      : option.id;

  const selectedOption = (options as T[]).find((option) =>
    typeof option === "string" ? option === selected : option.id === selected,
  );

  const [optionElement, setOptionElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLUListElement | null>(
    null,
  );

  const { styles, attributes } = usePopper(optionElement, popperElement, {
    placement: "bottom-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 4],
        },
      },
    ],
  });

  // Invalidate selected option if it's not in the options list
  useEffect(() => {
    if (selected !== null && selectedOption === undefined) {
      setSelected(undefined);
    }
  }, [selected, selectedOption, setSelected]);

  return (
    <Listbox
      {...prpx(
        { value: selected, onChange: setSelected, disabled: isDisabled },
        rest,
      )}
    >
      {({ open }) => (
        <div className={twMerge(isFullWidth ? "w-full" : "w-48", "relative")}>
          <Listbox.Button
            {...prpx(
              { className: selectVariants({ state: state ?? "default" }), ref },
              { ref: setOptionElement },
              inputProps,
            )}
          >
            <span className="block truncate">
              {selected !== null && selectedOption !== undefined
                ? renderRow(selectedOption)
                : placeholder ?? "- Select -"}
            </span>
            <span className={selectIconVariants({ state: state ?? "default" })}>
              <ChevronsUpDown size={12} />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute z-10 max-h-60 w-full overflow-auto rounded-md bg-zinc-50 py-1 text-base shadow-lg ring-1 ring-zinc-100 ring-opacity-5 focus:outline-none dark:border-zinc-600 dark:bg-zinc-700 dark:ring-zinc-200 sm:text-sm"
              style={styles.popper}
              ref={setPopperElement}
              {...attributes.popper}
            >
              {options.map((option) => (
                <Listbox.Option
                  key={getOptionKey(option as T)}
                  className={({ active }) =>
                    twMerge(
                      active
                        ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-900/50 dark:text-zinc-200"
                        : "bg-zinc-50 text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-300",
                      "relative cursor-default select-none py-2 pl-3 pr-9",
                    )
                  }
                  value={getOptionKey(option as T)}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={twMerge(
                          selected ? "font-semibold" : "font-normal",
                          "block truncate",
                        )}
                      >
                        {renderRow(option as T)}
                      </span>

                      {selected ? (
                        <span
                          className={twMerge(
                            active
                              ? "text-zinc-900 dark:text-zinc-200"
                              : "text-zinc-900 dark:text-zinc-300",
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                          )}
                        >
                          <Check size={12} />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}) as <T extends ({ id: string | number } & Record<string, unknown>) | string>(
  props: SelectProps<T> & { ref?: Ref<HTMLButtonElement> },
) => JSX.Element;
