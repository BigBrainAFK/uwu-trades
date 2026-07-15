"use client";

import ReactSelect, { GroupBase, Props } from "react-select";

export function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: Props<Option, IsMulti, Group>) {
  return (
    <ReactSelect
      unstyled
      classNames={{
        container: () => "min-w-[16rem]",
        control: ({ isFocused }) =>
          [
            "rounded-md border bg-white px-2 py-1 dark:bg-gray-800",
            isFocused
              ? "border-teal-500 ring-1 ring-teal-500"
              : "border-gray-300 dark:border-gray-600",
          ].join(" "),
        valueContainer: () => "gap-1",
        placeholder: () => "text-gray-400",
        singleValue: () => "text-gray-900 dark:text-gray-100",
        input: () => "text-gray-900 dark:text-gray-100",
        indicatorSeparator: () => "bg-gray-300 dark:bg-gray-600 mx-1 w-px",
        dropdownIndicator: () => "text-gray-400 px-1",
        clearIndicator: () => "text-gray-400 px-1",
        menu: () =>
          "mt-1 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 z-50 overflow-hidden",
        menuList: () => "py-1",
        groupHeading: () =>
          "px-3 py-1 text-xs font-semibold uppercase text-gray-500",
        option: ({ isFocused, isSelected }) =>
          [
            "cursor-pointer px-3 py-2",
            isSelected
              ? "bg-teal-500 text-white"
              : isFocused
                ? "bg-gray-100 dark:bg-gray-700"
                : "",
          ].join(" "),
        noOptionsMessage: () => "px-3 py-2 text-gray-400",
      }}
      {...props}
    />
  );
}
