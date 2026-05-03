import { Laptop, MoonStar, Sun } from "lucide-react";
import { useState, useEffect } from "react";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "system",
  );

  useEffect(() => {
    if (theme === "system") {
      const systemTheme = getSystemTheme();
      document.documentElement.classList.toggle("dark", systemTheme === "dark");
      localStorage.removeItem("theme");
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }

    window.dispatchEvent(new Event("themeChange"))
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = () => {
      if (!localStorage.getItem("theme")) {
        document.documentElement.classList.toggle("dark", media.matches);
      }
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  function getThemeIcon(currentTheme) {
    switch (currentTheme) {
      case "light":
        return <Sun size={18} />;
      case "dark":
        return <MoonStar size={18} />;
      default:
        return <Laptop size={18} />;
    }
  }

  function buttonClass(isActive = false) {
    return `flex items-center justify-center rounded-full p-2 transition-colors cursor-pointer ${isActive
        ? "bg-gray-200 text-black dark:bg-gray-600 dark:text-white"
        : "bg-gray-300 hover:bg-gray-200 text-black dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
      }`;
  }

  return (
    <div className="fixed top-2 right-2 z-50">
      <div className="group relative flex flex-col items-end">
        <button className={buttonClass(true)}>{getThemeIcon(theme)}</button>

        <div
          className="mt-2 flex flex-col gap-2 opacity-0 scale-95 pointer-events-none
                     translate-y-1 transition-all duration-200
                     group-hover:opacity-100 group-hover:scale-100
                     group-hover:pointer-events-auto group-hover:translate-y-0"
        >
          {theme !== "light" && (
            <button
              onClick={() => setTheme("light")}
              className={buttonClass()}
              aria-label="Switch to light mode"
            >
              <Sun size={18} />
            </button>
          )}

          {theme !== "dark" && (
            <button
              onClick={() => setTheme("dark")}
              className={buttonClass()}
              aria-label="Switch to dark mode"
            >
              <MoonStar size={18} />
            </button>
          )}

          {theme !== "system" && (
            <button
              onClick={() => setTheme("system")}
              className={buttonClass()}
              aria-label="Switch to system mode"
            >
              <Laptop size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
