import { type Dispatch, type SetStateAction } from "react";
import { twMerge } from "tailwind-merge";

export const Range = ({
  label,
  value,
  setValue,
  className,
}: {
  label: string;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  className?: string;
}) => {
  return (
    <div className={twMerge("flex flex-col p-2", className)}>
      <label
        htmlFor={label}
        className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-300"
      >
        {label}
      </label>
      <input
        id={label}
        type="range"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-50 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300"
      />
    </div>
  );
};
