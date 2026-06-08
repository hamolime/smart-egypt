import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { MapPin } from "lucide-react";

export default function MapPage() {
  const { t } = useLanguage();

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full pt-10 pb-10 px-6">
      <h1 className="text-3xl font-bold mb-6">{t("navMap")}</h1>

      <div className="w-full h-[600px] bg-card border border-border rounded-2xl relative overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, var(--color-border) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative text-center z-10">
          <MapPin className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-muted-foreground">{t("mapIntegrationTitle")}</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">{t("mapIntegrationDesc")}</p>
        </div>
      </div>
    </div>
  );
}
