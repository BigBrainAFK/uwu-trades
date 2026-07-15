"use client";

import { useEffect } from "react";
import { Button } from "../src/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">Something went wrong!</h1>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
