"use client";

import { useState } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import { Button } from "../ui";

export function UserActions() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session || !session.user) {
    return (
      <Button onClick={() => signIn()} className="btn-signin">
        Sign in
      </Button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-w-0 cursor-pointer items-center rounded-full"
      >
        {session.user.name}
        <img
          alt={session.user.name ?? "User avatar"}
          className="ml-4 h-8 w-8 rounded-full object-cover"
          src={
            session.user.image ??
            "https://cdn.discordapp.com/embed/avatars/0.png"
          }
        />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 min-w-[10rem] rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
