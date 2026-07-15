"use client";

import { useState } from "react";
import { ColorModeToggle } from "./ColorModeToggle";
import { UserActions } from "./UserActions";
import { NavEntries } from "../../const";
import { NavLink } from "./NavLink";
import { MobileNavButton } from "./MobileNavButton";
import { MobileNavList } from "./MobileNavList";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <div className="bg-gray-50 px-4 dark:bg-gray-900">
      <div className="flex h-16 items-center justify-between">
        <MobileNavButton isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        <ColorModeToggle />
        <div className="mx-auto flex items-center gap-8">
          <nav className="hidden items-center gap-4 md:flex">
            {NavEntries.map((entry) => (
              <NavLink key={entry.name} href={entry.href}>
                {entry.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center">
          <UserActions />
        </div>
      </div>

      <MobileNavList isOpen={isOpen} />
    </div>
  );
}
