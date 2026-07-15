"use client";

import type { KeycapData } from "../types";

export function Keycap(props: KeycapData) {
  return (
    <div className="flex items-center gap-2">
      {props.name}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={props.image} alt={props.name} />
    </div>
  );
}
