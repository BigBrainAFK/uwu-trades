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
          </ChakraProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
