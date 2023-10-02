"use client";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { signIn, signOut, useSession } from "next-auth/react";

interface Props {
  children: React.ReactNode;
  href: string;
}

const NavEntries = [
  { name: "Home", href: "/" },
  { name: "Add listing", href: "/listing/create" },
  { name: "Keycap Overview", href: "/overview" },
  { name: "About", href: "/about" },
];

function NavLink(props: Props) {
  const { children, href } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={href}
    >
      {children}
    </Box>
  );
}

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px="4">
        <Flex h="16" alignItems="center" justifyContent="spacing-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
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
            {session && session.user ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                  minWidth="0"
                >
                  <Flex alignItems="center">
                    {session.user.name}
                    <Avatar
                      size="sm"
                      marginLeft="4"
                      src={
                        session.user.image ??
                        "https://cdn.discordapp.com/embed/avatars/0.png"
                      }
                    />
                  </Flex>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => signOut()}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button onClick={() => signIn()} className="btn-signin">
                Sign in
              </Button>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb="4" display={{ md: "none" }}>
            <Stack as="nav" spacing="4">
              {NavEntries.map((entry) => (
                <NavLink key={entry.name} href={entry.href}>
                  {entry.name}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
