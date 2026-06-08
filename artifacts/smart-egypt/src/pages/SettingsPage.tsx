import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun, Globe } from "lucide-react";

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "es", name: "Español" },
    { code: "it", name: "Italiano" },
    { code: "zh", name: "中文" },
  ] as const;

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full pt-10 pb-10 px-6">
      <h1 className="text-3xl font-bold mb-8">{t("settingsTitle")}</h1>

      <div className="space-y-6">
        {/* Theme */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            {theme === "dark"
              ? <Moon className="w-5 h-5 text-primary" />
              : <Sun className="w-5 h-5 text-primary" />}
            {t("themeAppearance")}
          </h2>

          <div className="flex gap-4">
            <button
              data-testid="button-dark-mode"
              onClick={() => setTheme("dark")}
              className={`flex-1 flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                theme === "dark"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 bg-muted/30"
              }`}
            >
              <Moon className="w-8 h-8 mb-3" />
              <span className="font-medium">{t("darkMode")}</span>
            </button>
            <button
              data-testid="button-light-mode"
              onClick={() => setTheme("light")}
              className={`flex-1 flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                theme === "light"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 bg-muted/30"
              }`}
            >
              <Sun className="w-8 h-8 mb-3" />
              <span className="font-medium">{t("lightMode")}</span>
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            {t("language")}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                data-testid={`button-lang-${lang.code}`}
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  language === lang.code
                    ? "border-primary bg-primary text-primary-foreground font-bold shadow-md"
                    : "border-border hover:border-primary/50 hover:bg-muted"
                }`}
              >
                <span>{lang.name}</span>
                {language === lang.code && (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
