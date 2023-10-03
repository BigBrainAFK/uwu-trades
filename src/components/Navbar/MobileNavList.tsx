"use client";

import { Stack, Box } from "@chakra-ui/react";
import { NavLink } from "./NavLink";
import { NavEntries } from "../../const";

interface Props {
  isOpen: boolean;
}

export function MobileNavList(props: Props) {
  return props.isOpen ? (
    <Box pb="4" display={{ md: "none" }}>
      <Stack as="nav" spacing="4">
        {NavEntries.map((entry) => (
          <NavLink key={entry.name} href={entry.href}>
            {entry.name}
          </NavLink>
        ))}
      </Stack>
    </Box>
  ) : (
    <></>
  );
}
