"use client";

import { Image, Wrap, WrapItem, Text, VStack } from "@chakra-ui/react";
import { swrFetcher } from "../../src/util";
import useSWR from "swr";
import { Keycap } from "@prisma/client";
import { LoadingError } from "../../src/components/LoadingError";
import { Loading } from "../../src/components/Loading";

export default function Page() {
  const { data: keycaps, error: keycapsError } = useSWR<Keycap[], Error>(
    "/api/keycap",
    swrFetcher
  );

  if (keycapsError) return <LoadingError />;
  if (keycaps === undefined) return <Loading />;

  return (
    <Wrap spacing="4">
      {keycaps.map((keycap) => (
        <WrapItem key={keycap.id}>
          <VStack>
            <Text as="h2" fontSize="xl">
              {keycap.name}
            </Text>
            <Image
              src={keycap.image}
              alt={keycap.name}
              boxSize="200px"
              objectFit="cover"
            />
          </VStack>
        </WrapItem>
      ))}
    </Wrap>
  );
}
