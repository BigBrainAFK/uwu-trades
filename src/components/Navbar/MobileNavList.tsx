"use client";

import { NavLink } from "./NavLink";
import { NavEntries } from "../../const";

interface Props {
  isOpen: boolean;
}

export function MobileNavList(props: Props) {
  if (!props.isOpen) return <></>;

  return (
    <div className="pb-4 md:hidden">
      <nav className="flex flex-col gap-4">
        {NavEntries.map((entry) => (
          <NavLink key={entry.name} href={entry.href}>
            {entry.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
