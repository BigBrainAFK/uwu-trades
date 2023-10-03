"use client";

import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { BsMoon, BsSun } from "react-icons/bs";

export function ColorModeToggle() {
  const { toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Mode Change"
      size="lg"
      icon={useColorModeValue(<BsMoon />, <BsSun />)}
      onClick={toggleColorMode}
    />
  );
}
