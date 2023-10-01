"use client";

import { HStack, Image } from "@chakra-ui/react";
import type { KeycapData } from "../types";

export function Keycap(props: KeycapData) {
  return (
    <HStack>
      {props.name}
      <Image src={props.image} alt={props.name} />
    </HStack>
  );
}
