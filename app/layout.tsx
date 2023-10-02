import { Flex, ChakraProvider } from "@chakra-ui/react";
import AuthProvider from "../src/context/AuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "../src/const";
import Navbar from "../src/components/Navbar";

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
          <ChakraProvider>
            <Flex height="100%" width="100%" direction="column">
              <Navbar />
              <Flex
                height="100%"
                width="100%"
                direction="column"
                justify="center"
                align="center"
              >
                {children}
              </Flex>
            </Flex>
          </ChakraProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
