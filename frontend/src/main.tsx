import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";

function Root() {
  const [appearance, setAppearance] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setAppearance(isDark ? "dark" : "light");

    // Listen for theme changes
    const handleThemeChange = (theme: "light" | "dark") => {
      setAppearance(theme);
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    // Make handleThemeChange globally available for App component
    (window as any).setTheme = handleThemeChange;
  }, []);

  return (
    <Theme
      appearance={appearance}
      accentColor="gray"
      grayColor="slate"
      radius="medium"
    >
      <App />
    </Theme>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
