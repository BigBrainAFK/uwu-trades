import { Flex } from "@chakra-ui/react";
import AuthProvider from "../src/context/AuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "../src/const";
import Navbar from "../src/components/Navbar/Navbar";
import { Metadata } from "next";
import { StyleProviders } from "./styleProviders";

export const metadata: Metadata = {
  title: "UwU Keycap Trades",
  description: "Small website for trading Wooting UwU keycaps",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <AuthProvider session={session}>
          <StyleProviders>
            <Flex direction="column" height="100vh">
              <Navbar />
              <Flex
                direction="column"
                justifyContent="center"
                alignItems="center"
                flexGrow="1"
              >
                {children}
              </Flex>
            </Flex>
          </StyleProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
