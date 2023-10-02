"use client";

import { VStack, Text, Link } from "@chakra-ui/react";

export default function Page() {
  return (
    <VStack fontSize="xl" fontWeight="bold" spacing="2rem">
      <Text>
        All trades or arrangements made between individuals are the sole
        responsibility of the parties involved.
      </Text>
      <Text>
        I (Discord: @bigbrainafk) do NOT guarantee or enforce any trade
        behavior, nor provide any escrow services.
      </Text>
      <Text>All trading is done at the individual's own risk: be careful!</Text>
      <Text>
        The Website is provided as is and all source code can be found at{" "}
        <Link href="https://github.com/BigBrainAFK/uwu-trades">GitHub</Link>
      </Text>
    </VStack>
  );
}
