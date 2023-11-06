import type { LegacyRef, MutableRefObject, RefCallback } from "react";
import { createContext, useContext, useId } from "react";

export type FormInputProps = {
  state?: "error" | "success";
  isDisabled?: boolean;
  isFullWidth?: boolean;
  id?: string;
  htmlFor?: string;
};

export function useFormInputProps<T extends FormInputProps>(
  props: T,
): T & {
  id: string;
  state?: "error" | "success";
  isDisabled: boolean;
  isFullWidth: boolean;
} {
  const inherited = useContext(FormContext);
  const reactId = useId();
  const id = props.id ?? props.htmlFor ?? inherited.id ?? reactId;
  const state = props.state ?? inherited.state;
  const isDisabled = props.isDisabled ?? inherited.isDisabled ?? false;
  const isFullWidth = props.isFullWidth ?? inherited.isFullWidth ?? false;

  return {
    ...props,
    id,
    state,
    isDisabled,
    isFullWidth,
  };
}

export const FormContext = createContext<Partial<FormInputProps>>({});

export function mergeRefs<T>(
  refs: Array<MutableRefObject<T> | LegacyRef<T>>,
): RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as MutableRefObject<T | null>).current = value;
      }
    });
  };
}
