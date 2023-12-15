import type { ExchangeType, ListingType } from "@prisma/client";
import type { ReactNode } from "react";

// as the name states it converts a string array into an object with keys equal to the array content
export type ObjectFromList<T extends ReadonlyArray<string>> = {
  [K in T extends ReadonlyArray<infer U> ? U : never]: string;
};

export interface DiscordInfo {
  name: string;
  id: string;
}

export interface KeycapListing {
  id: number;
  user: DiscordInfo;
  type: ListingType;
  exchange: ExchangeType;
  country: {
    name: string;
    flag: string;
  };
  city: string;
  actions: ReactNode;
}

export interface KeycapData {
  name: string;
  image: string;
}
