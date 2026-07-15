"use client";

import { IoClose, IoMenu } from "react-icons/io5";
import { IconButton } from "../ui";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function MobileNavButton(props: Props) {
  const { isOpen, onOpen, onClose } = props;

  return (
    <IconButton
      aria-label="Open Menu"
      className="mr-4 md:hidden"
      onClick={isOpen ? onClose : onOpen}
    >
      {isOpen ? <IoClose /> : <IoMenu />}
    </IconButton>
  );
}
