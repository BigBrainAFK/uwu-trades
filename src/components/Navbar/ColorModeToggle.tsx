"use client";

import { useEffect, useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { IconButton } from "../ui";

export function ColorModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleColorMode = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.theme = next ? "dark" : "light";
    setIsDark(next);
  };

  return (
    <IconButton aria-label="Mode Change" size="lg" onClick={toggleColorMode}>
      {isDark ? <BsSun /> : <BsMoon />}
    </IconButton>
  );
}
