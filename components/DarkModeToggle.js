import React from "react";
import useDarkMode from "../utils/useDarkMode";

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-blue-500 text-white dark:bg-gray-800 dark:text-gray-200"
    >
      {theme === "light" ? "🌙 Karanlık Mod" : "☀️ Aydınlık Mod"}
    </button>
  );
};

export default DarkModeToggle;
