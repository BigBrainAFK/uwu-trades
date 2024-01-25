"use client";

import { useColorModeValue } from "@chakra-ui/react";
import React, { createContext, useContext, PropsWithChildren } from "react";

interface ColorContextProps {
  color: string;
}

const ColorContext = createContext<ColorContextProps>({ color: "gray.50" });

export const useColor = () => useContext(ColorContext);

export const ColorProvider: React.FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <ColorContext.Provider
      value={{ color: useColorModeValue("gray.50", "gray.900") }}
    >
      {children}
    </ColorContext.Provider>
  );
};
