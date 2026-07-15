"use client";

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
import { IconButton } from "../src/components/ui";

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
  if ("error" in keycaps) throw new Error("No keycaps found");

  return (
    <>
      <h1 className="text-xl font-bold 2xl:text-4xl">Select Keycap</h1>
      <div className="my-4 flex items-center gap-4">
        <IconButton
          aria-label="Sort ascending"
          size="lg"
          onClick={() => setSortOrder("asc")}
        >
          <TbSortAscendingLetters />
        </IconButton>
        <IconButton
          aria-label="Sort descending"
          size="lg"
          onClick={() => setSortOrder("desc")}
        >
          <TbSortDescendingLetters />
        </IconButton>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {keycaps.map((keycap) => (
          <div
            key={keycap.id}
            className="mb-4 overflow-hidden rounded-[15px] bg-gray-50 dark:bg-gray-900"
          >
            <Link href={`/keycap/${keycap.id}`}>
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-base 2xl:text-xl">{keycap.name}</h2>
                <div className="overflow-hidden rounded-[15px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={keycap.image}
                    alt={keycap.name}
                    className="h-[120px] w-[120px] object-cover 2xl:h-[200px] 2xl:w-[200px]"
                  />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
