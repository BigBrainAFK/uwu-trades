"use client";

import { IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { API_BASE } from "../const";
import { useSWRConfig } from "swr";

interface Props {
  id: number;
}

export function RemoveButton(props: Props) {
  const { mutate } = useSWRConfig();

  return (
    <IconButton
      aria-label="Remove listing"
      colorScheme="red"
      icon={<CloseIcon />}
      onClick={() =>
        fetch(`${API_BASE}/api/listing/${props.id}`, {
          method: "DELETE",
          credentials: "include",
        }).then(() => mutate("/api/listing"))
      }
    />
  );
}
