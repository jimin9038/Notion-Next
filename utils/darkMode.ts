import { getSettings, updateSettings } from "@/app/actions";

export function enableDarkMode() {
  document.documentElement.classList.add("dark");
}

export function disableDarkMode() {
  document.documentElement.classList.remove("dark");
}

export async function initializeDarkModeFromSettings() {
  const settings = await getSettings();
  if (settings.theme === "dark") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
}

export async function toggleDarkModeInSettings() {
  const settings = await getSettings();
  const newTheme = settings.theme === "dark" ? "light" : "dark";
  if (newTheme === "dark") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
  await updateSettings(newTheme, settings.font);
}
