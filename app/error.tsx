"use client";

import { Button, Heading } from "@chakra-ui/react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Heading as="h1" size="xl">
        Something went wrong!
      </Heading>
      <Button onClick={() => reset()}>Try again</Button>
    </>
  );
}
