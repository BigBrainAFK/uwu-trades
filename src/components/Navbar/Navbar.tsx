"use client";

import {
  Box,
  Flex,
  HStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { ColorModeToggle } from "./ColorModeToggle";
import { UserActions } from "./UserActions";
import { NavEntries } from "../../const";
import { NavLink } from "./NavLink";
import { MobileNavButton } from "./MobileNavButton";
import { MobileNavList } from "./MobileNavList";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue("grey.100", "grey.900")} px="4">
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
