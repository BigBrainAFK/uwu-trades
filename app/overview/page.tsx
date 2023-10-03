"use client";

import {
  Image,
  Wrap,
  WrapItem,
  Text,
  VStack,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { swrFetcher } from "../../src/util";
import useSWR from "swr";
import { Keycap } from "@prisma/client";
import { LoadingError } from "../../src/components/LoadingError";
import { Loading } from "../../src/components/Loading";
import {
  TbSortAscendingLetters,
  TbSortDescendingLetters,
} from "react-icons/tb";
import { useState, useEffect } from "react";

export default function Page() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { data: keycaps, error: keycapsError } = useSWR<Keycap[], Error>(
    "/api/keycap",
    swrFetcher
  );

  useEffect(() => {
    if (keycaps && sortOrder) {
      keycaps.sort((a, b) =>
        sortOrder === "asc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name)
      );
    }
  }, [keycaps, sortOrder]);

  if (keycapsError) return <LoadingError />;
  if (keycaps === undefined) return <Loading />;

  return (
    <>
      <HStack spacing="4" marginTop="4" marginBottom="4">
        <IconButton
          aria-label="Sort ascending"
          onClick={() => setSortOrder("asc")}
          icon={<TbSortAscendingLetters />}
          size="lg"
          fontSize="3xl"
        />
        <IconButton
          aria-label="Sort descending"
          onClick={() => setSortOrder("desc")}
          icon={<TbSortDescendingLetters />}
          size="lg"
          fontSize="3xl"
        />
      </HStack>
      <Wrap spacing="4" justify="center">
        {keycaps.map((keycap) => (
          <WrapItem key={keycap.id}>
            <VStack>
              <Text as="h2" fontSize="xl" flex="1">
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
    </>
  );
}
