"use client";

import Link from "next/link";

interface Props {
  children: React.ReactNode;
  href: string;
}

export function NavLink(props: Props) {
  const { children, href } = props;

  return (
    <Link
      href={href}
      className="rounded-md px-2 py-1 hover:bg-gray-200 hover:no-underline dark:hover:bg-gray-700"
    >
      {children}
    </Link>
  );
}
