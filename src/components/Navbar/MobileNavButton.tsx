"use client";

import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function MobileNavButton(props: Props) {
  const { isOpen, onOpen, onClose } = props;

  return (
    <IconButton
      size="md"
      icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
      aria-label="Open Menu"
      display={{ md: "none" }}
      onClick={isOpen ? onClose : onOpen}
      marginRight="4"
    />
  );
}
