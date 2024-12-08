"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "@/app/actions";
import { enableDarkMode, disableDarkMode } from "@/utils/darkMode";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideSettings } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function Setting({
  font,
  setFont,
}: {
  font: string;
  setFont: (font: string) => void;
}) {
  const [theme, setTheme] = useState<string>("light");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedFont, setSelectedFont] = useState<string>("sans");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const settings = await getSettings();
        setTheme(settings.theme);
        setFont(settings.font);

        if (settings.theme === "dark") {
          enableDarkMode();
        } else {
          disableDarkMode();
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    }

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      await updateSettings(theme, selectedFont);

      const settings = await getSettings();
      setTheme(settings.theme);
      setFont(settings.font);
      if (theme === "dark") {
        enableDarkMode();
      } else {
        disableDarkMode();
      }
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Failed to update settings:", error);
      alert("Failed to update settings.");
    }
  };

  if (isLoading) return <p>Loading settings...</p>;

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-white text-black hover:bg-slate-700 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-700">
            <LucideSettings />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="text-xl font-bold mb-4 dark:text-white">
            Settings
          </DialogTitle>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Font
            </label>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="serif">Serif</option>
              <option value="sans">Sans-serif</option>
              <option value="mono">Mono</option>
            </select>
            <div className="font-serif">Serif</div>
            <div className="font-sans">Sans-serif</div>
            <div className="font-mono">Mono</div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-white text-black hover:bg-slate-700 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-700"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
