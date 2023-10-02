"use client";

import { Heading, Spinner } from "@chakra-ui/react";

export function Loading() {
  return (
    <Spinner>
      <Heading as="h1" size="xl">
        Loading...
      </Heading>
    </Spinner>
  );
}
