import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Search } from "lucide-react";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="flex-1 pb-10">
      <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=80"
          alt="Egypt Pyramids"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-4 max-w-3xl w-full">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {t("discoverEgypt")}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10">
            {t("aiTravelGuide")}
          </p>

          <div className="relative max-w-xl mx-auto flex items-center">
            <Search className="absolute left-4 text-muted-foreground w-5 h-5 z-10" />
            <input
              data-testid="input-search"
              type="text"
              placeholder={t("whereToSearch")}
              className="w-full bg-background/95 backdrop-blur rounded-full py-4 pl-12 pr-36 text-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-border/50 shadow-xl"
            />
            <button
              data-testid="button-explore-search"
              className="absolute right-2 bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              {t("exploreBtn")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
