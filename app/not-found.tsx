"use client";

import { Heading } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <Heading as="h1" size="xl">
      Requested resource does not exist
    </Heading>
  );
}
