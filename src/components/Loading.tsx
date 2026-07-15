"use client";

import { Spinner } from "./ui";

export function Loading() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Spinner className="h-12 w-12" />
      <h1 className="text-3xl font-bold">Loading...</h1>
    </div>
  );
}
