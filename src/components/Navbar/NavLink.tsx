"use client";

import { Box, useColorModeValue } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
  href: string;
}

export function NavLink(props: Props) {
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
