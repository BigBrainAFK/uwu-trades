import "./globals.css";
import AuthProvider from "../src/context/AuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "../src/const";
import Navbar from "../src/components/Navbar";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "../src/components/Loading";

export const metadata: Metadata = {
  title: "UwU Keycap Trades",
  description: "Small website for trading Wooting UwU keycaps",
};

// Set the theme before first paint to avoid a flash of the wrong color mode.
// See https://tailwindcss.com/docs/dark-mode#with-system-theme-support
const themeScript = `
  try {
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  } catch (_) {}
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning={true}>
        <AuthProvider session={session}>
          <div className="flex h-screen flex-col">
            <Navbar />
            <div className="flex flex-grow flex-col items-center justify-center text-[0.625rem] 2xl:text-base">
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
