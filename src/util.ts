import type { ISODateString, Session } from "next-auth";
import type { DiscordInfo, ObjectFromList } from "./types";
import { REST } from "@discordjs/rest";
import { Routes, APIUser } from "discord-api-types/v10";
import Cache from "memory-cache";
import { ExchangeType, ListingType } from "@prisma/client";

export function getRequiredEnvObject<
  T extends ReadonlyArray<string>,
  O extends ObjectFromList<T>
>(
  envKeys: T
): // sneaky hack so the linter doesnt show "ObjectFromArray<...>" but an actual object
{ [K in T extends ReadonlyArray<infer U> ? U : never]: string } {
  let returnValues = {};

  for (const envKey of envKeys) {
    const value = process.env[envKey];

    if (value == undefined) {
      throw new Error(`Required env key ${envKey} is not defined`);
    }

    returnValues = { ...returnValues, [envKey]: value };
  }

  return returnValues as O;
}

export class MilliTime {
  static fromSeconds(seconds: number) {
    return seconds * 1000;
  }

  static fromMinutes(minutes: number) {
    return this.fromSeconds(minutes * 60);
  }

  static fromHours(hours: number) {
    return this.fromMinutes(hours * 60);
  }

  static fromDays(days: number) {
    return this.fromHours(days * 24);
  }
}

interface ValidSession {
  expires: ISODateString;
  user: { id: string; name: string; image: string };
}

export function isSessionValid(
  status: string,
  session: Session | null
): session is ValidSession {
  return (
    status === "authenticated" &&
    session != null &&
    session.user != undefined &&
    session.user != null
  );
}

export async function getDiscordUser(id: string) {
  const { DISCORD_TOKEN } = getRequiredEnvObject(["DISCORD_TOKEN"] as const);

  const cachedUser = Cache.get(id);

  if (cachedUser != null && cachedUser != undefined) {
    return cachedUser;
  }

  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

  try {
    const user = await rest.get(Routes.user(id)).then((res) => res as APIUser);

    const formattedUser: DiscordInfo = {
      id: user.id,
      name: `${user.username}${
        user.discriminator === "0" ? "" : user.discriminator
      }`,
    };

    Cache.put(id, formattedUser, MilliTime.fromHours(1));

    return formattedUser;
  } catch (error) {
    console.error(error);
  }
}

export const swrFetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

export function stringToListingType(type: string) {
  switch (type.toLowerCase()) {
    case "has":
      return ListingType.HAS;
    case "want":
      return ListingType.WANT;
  }
}

export function stringToExchangeType(exchange: string) {
  switch (exchange.toLowerCase()) {
    case "irl":
      return ExchangeType.IRL;
    case "mail":
      return ExchangeType.MAIL;
  }
}
