"use client";

import {
  Menu,
  MenuButton,
  Button,
  Flex,
  Avatar,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useSession, signOut, signIn } from "next-auth/react";

export function UserActions() {
  const { data: session } = useSession();

  return session && session.user ? (
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
  );
}
