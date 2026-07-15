"use client";

import { IoClose } from "react-icons/io5";
import { API_BASE } from "../const";
import { useSWRConfig } from "swr";
import { IconButton } from "./ui";

interface Props {
  id: number;
}

export function RemoveButton(props: Props) {
  const { mutate } = useSWRConfig();

  return (
    <IconButton
      aria-label="Remove listing"
      colorScheme="red"
      onClick={() =>
        fetch(`${API_BASE}/api/listing/${props.id}`, {
          method: "DELETE",
          credentials: "include",
        }).then(() =>
          // Revalidate every per-keycap listing query (`/api/listing/<id>`),
          // not the bare "/api/listing" key which nothing actually subscribes to.
          mutate(
            (key) => typeof key === "string" && key.startsWith("/api/listing"),
          )
        )
      }
    >
      <IoClose />
    </IconButton>
  );
}
