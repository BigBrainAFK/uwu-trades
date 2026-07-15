"use client";

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
    <div className="flex items-center gap-2">
      <RemoveButton id={props.id} />
    </div>
  );
}
