"use client";

import React, { useState, useEffect } from 'react';
import { Image, Wrap, WrapItem, Text, VStack, Button, Flex, Box } from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import { swrFetcher } from "../../src/util";
import useSWR from "swr";
import { Keycap } from "@prisma/client";
import { LoadingError } from "../../src/components/LoadingError";
import { Loading } from "../../src/components/Loading";

export default function Page() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { data: keycaps, error: keycapsError } = useSWR<Keycap[], Error>("/api/keycap", swrFetcher);

  useEffect(() => {
    if (keycaps && sortOrder) {
      keycaps.sort((a, b) => sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name));
    }
  }, [keycaps, sortOrder]);

  if (keycapsError) return <LoadingError />;
  if (keycaps === undefined) return <Loading />;

  return (
      <Box p={4}>
        <Flex justifyContent="center" alignItems="center" mb={4}>
          <Button
              onClick={() => setSortOrder('asc')}
              rightIcon={<ArrowUpIcon />}
              mr={2}
          >
            Ascending
          </Button>
          <Button
              onClick={() => setSortOrder('desc')}
              rightIcon={<ArrowDownIcon />}
          >
            Descending
          </Button>
        </Flex>
        <Wrap spacing="4" justify="center">
          {keycaps.map((keycap) => (
              <WrapItem key={keycap.id}>
                <VStack>
                  <Text as="h2" fontSize="xl">
                    {keycap.name}
                  </Text>
                  <Image src={keycap.image} alt={keycap.name} boxSize="200px" objectFit="cover" />
                </VStack>
              </WrapItem>
          ))}
        </Wrap>
      </Box>
  );
}
