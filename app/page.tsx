"use client";

import {
  Image,
  Wrap,
  WrapItem,
  Text,
  VStack,
  IconButton,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { swrFetcher } from "../src/util";
import useSWR from "swr";
import { Keycap } from "@prisma/client";
import { LoadingError } from "../src/components/LoadingError";
import { Loading } from "../src/components/Loading";
import {
  TbSortAscendingLetters,
  TbSortDescendingLetters,
} from "react-icons/tb";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useColor } from "../src/context/ColorProvider";

export default function Page() {
  const colorContext = useColor();
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
  if ("error" in keycaps) throw new Error("No keycaps found");

  return (
    <>
      <Heading fontSize={{ base: "xl", "2xl": "4xl" }}>Select Keycap</Heading>
      <HStack spacing="4" marginTop="4" marginBottom="4">
        <IconButton
          aria-label="Sort ascending"
          onClick={() => setSortOrder("asc")}
          icon={<TbSortAscendingLetters />}
          size={{ base: "md", "2xl": "lg" }}
          fontSize={{ base: "md", "2xl": "3xl" }}
        />
        <IconButton
          aria-label="Sort descending"
          onClick={() => setSortOrder("desc")}
          icon={<TbSortDescendingLetters />}
          size={{ base: "md", "2xl": "lg" }}
          fontSize={{ base: "md", "2xl": "3xl" }}
        />
      </HStack>
      <Wrap spacing="4" justify="center">
        {keycaps.map((keycap) => (
          <WrapItem
            key={keycap.id}
            mb="4"
            borderRadius="20px"
            overflow="hidden"
            backgroundColor={colorContext.color}
          >
            <Link href={`/keycap/${keycap.id}`}>
              <VStack>
                <Text as="h2" fontSize={{ base: "md", "2xl": "xl" }} flex="1">
                  {keycap.name}
                </Text>
                <Image
                  src={keycap.image}
                  alt={keycap.name}
                  boxSize={{ base: "120px", "2xl": "200px" }}
                  objectFit="cover"
                />
              </VStack>
            </Link>
          </WrapItem>
        ))}
      </Wrap>
    </>
  );
}
