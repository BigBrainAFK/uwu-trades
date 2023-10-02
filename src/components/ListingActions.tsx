"use client";

import { HStack } from "@chakra-ui/react";
import { RemoveButton } from "./RemoveButton";
import { useSession } from "next-auth/react";
import { isSessionValid } from "../util";

interface Props {
  id: number;
  userId: string;
}

export function ListingActions(props: Props) {
  const { data: session, status } = useSession();

  if (!isSessionValid(status, session) || session.user.id !== props.userId) {
    return <></>;
  }

  return (
    <HStack>
      <RemoveButton id={props.id} />
    </HStack>
  );
}
