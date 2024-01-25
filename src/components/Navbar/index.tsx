"use client";

import { Box, Flex, HStack, useDisclosure } from "@chakra-ui/react";
import { ColorModeToggle } from "./ColorModeToggle";
import { UserActions } from "./UserActions";
import { NavEntries } from "../../const";
import { NavLink } from "./NavLink";
import { MobileNavButton } from "./MobileNavButton";
import { MobileNavList } from "./MobileNavList";
import { useColor } from "../../context/ColorProvider";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const colorContext = useColor();

  return (
    <>
      <Box bg={colorContext.color} px="4">
        <Flex h="16" alignItems="center" justifyContent="spacing-between">
          <MobileNavButton isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
          <ColorModeToggle />
          <HStack
            marginLeft="auto"
            marginRight="auto"
            spacing={8}
            alignItems="center"
          >
            <HStack as="nav" spacing="4" display={{ base: "none", md: "flex" }}>
              {NavEntries.map((entry) => (
                <NavLink key={entry.name} href={entry.href}>
                  {entry.name}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems="center">
            <UserActions />
          </Flex>
        </Flex>

        <MobileNavList isOpen={isOpen} />
      </Box>
    </>
  );
}
