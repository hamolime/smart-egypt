import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Sparkles, Calendar as CalendarIcon, Wallet, Heart, MapPin, Sun, Coffee, Moon, Lightbulb, Loader2, RotateCcw } from "lucide-react";

interface DayPlan {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  tip: string;
}

const INTEREST_ICONS: Record<string, string> = {
  History: "🏛️", التاريخ: "🏛️", Histoire: "🏛️", Geschichte: "🏛️", Historia: "🏛️", Storia: "🏛️", 历史: "🏛️",
  Beaches: "🏖️", الشواطئ: "🏖️", Plages: "🏖️", Strände: "🏖️", Playas: "🏖️", Spiagge: "🏖️", 海滩: "🏖️",
  Culture: "🎭", الثقافة: "🎭", Cuisine: "🍽️", Gastronomie: "🍽️", Essen: "🍽️",
  Food: "🍽️", الطعام: "🍽️",
  Adventure: "🧗", المغامرة: "🧗", Aventure: "🧗", Abenteuer: "🧗", Avventura: "🧗", 冒险: "🧗",
  Relaxation: "🌿", الاسترخاء: "🌿", Détente: "🌿", Entspannung: "🌿", Relax: "🌿", 放松: "🌿",
};

export default function TripPlanPage() {
  const { t, language } = useLanguage();

  const interests = [
    t("interest_history"),
    t("interest_beaches"),
    t("interest_culture"),
    t("interest_food"),
    t("interest_adventure"),
    t("interest_relaxation"),
  ];

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<DayPlan[] | null>(null);
  const [error, setError] = useState("");

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleGenerate = async () => {
    if (!destination.trim()) {
      setError(language === "ar" ? "من فضلك أدخل الوجهة" : "Please enter a destination");
      return;
    }
    setError("");
    setLoading(true);
    setItinerary(null);
    try {
      const res = await fetch("/api/trip-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: destination.trim(),
          days,
          budget: budget.trim() || "flexible",
          interests: selectedInterests,
          language,
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json() as { itinerary: DayPlan[] };
      setItinerary(data.itinerary);
    } catch {
      setError(language === "ar" ? "حدث خطأ، حاول مرة أخرى" : "Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setError("");
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full pt-10 pb-10 px-6">
      <h1 className="text-3xl font-bold mb-2">{t("navTripPlan")}</h1>
      <p className="text-muted-foreground mb-8">
        {language === "ar"
          ? "أخبرنا عن رحلتك وسيصمم الذكاء الاصطناعي خطة مخصصة لك"
          : "Tell us about your trip and our AI will design a custom itinerary just for you"}
      </p>

      {!itinerary && !loading && (
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-8">

          {/* Destination */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              {language === "ar" ? "الوجهة" : "Destination"}
              <span className="text-red-500">*</span>
            </label>
            <input
              data-testid="input-destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={language === "ar" ? "مثال: القاهرة والأقصر، أو الغردقة..." : "e.g. Cairo & Luxor, or Hurghada..."}
              className="w-full bg-muted border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Days */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-3">
              <CalendarIcon className="w-5 h-5 text-primary" />
              {t("duration")}
              <span className="text-muted-foreground text-sm font-normal">({days} {language === "ar" ? "أيام" : "days"})</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                data-testid="input-days"
                type="range"
                min={1}
                max={14}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <input
                type="number"
                min={1}
                max={14}
                value={days}
                onChange={(e) => setDays(Math.min(14, Math.max(1, Number(e.target.value))))}
                className="w-20 bg-muted border border-border rounded-xl py-2 px-3 text-center focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1</span><span>7</span><span>14</span>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-3">
              <Wallet className="w-5 h-5 text-primary" />
              {t("budget")}
              <span className="text-muted-foreground text-sm font-normal">({language === "ar" ? "اختياري" : "optional"})</span>
            </label>
            <input
              data-testid="input-budget"
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder={language === "ar" ? "مثال: 1000 دولار أو 5000 جنيه..." : "e.g. $1000, 5000 EGP, budget traveler..."}
              className="w-full bg-muted border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-3">
              <Heart className="w-5 h-5 text-primary" />
              {t("interests")}
            </label>
            <div className="flex flex-wrap gap-3">
              {interests.map((interest) => {
                const isActive = selectedInterests.includes(interest);
                const icon = INTEREST_ICONS[interest] ?? "✨";
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                        : "border-border hover:border-primary/60 hover:bg-muted"
                    }`}
                  >
                    {icon} {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            data-testid="button-generate-plan"
            onClick={handleGenerate}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-5 h-5" />
            {t("generatePlan")}
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-card border border-border rounded-2xl p-16 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg font-medium">
            {language === "ar" ? "جاري إنشاء خطتك..." : "Crafting your itinerary..."}
          </p>
          <p className="text-muted-foreground text-sm">
            {language === "ar" ? "هذا قد يستغرق بضع ثوانٍ" : "This may take a few seconds"}
          </p>
        </div>
      )}

      {/* Itinerary result */}
      {itinerary && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="text-primary w-6 h-6" />
                {days}-{language === "ar" ? "يوم في" : "Day"} {destination}
              </h2>
              {selectedInterests.length > 0 && (
                <p className="text-muted-foreground text-sm mt-1">
                  {selectedInterests.join(" · ")}
                </p>
              )}
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border hover:border-primary/50 rounded-xl px-4 py-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {language === "ar" ? "خطة جديدة" : "New Plan"}
            </button>
          </div>

          <div className="space-y-4">
            {itinerary.map((item) => (
              <div
                key={item.day}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-colors"
              >
                {/* Day header */}
                <div className="flex items-center gap-4 p-5 border-b border-border bg-muted/20">
                  <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center shrink-0">
                    {item.day}
                  </div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                </div>

                {/* Activities */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Sun className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                        {language === "ar" ? "الصباح" : "Morning"}
                      </p>
                      <p className="text-sm leading-relaxed">{item.morning}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Coffee className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                        {language === "ar" ? "بعد الظهر" : "Afternoon"}
                      </p>
                      <p className="text-sm leading-relaxed">{item.afternoon}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-indigo-500/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Moon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                        {language === "ar" ? "المساء" : "Evening"}
                      </p>
                      <p className="text-sm leading-relaxed">{item.evening}</p>
                    </div>
                  </div>
                </div>

                {/* Tip */}
                {item.tip && (
                  <div className="px-5 pb-4">
                    <div className="flex gap-2 bg-primary/5 border border-primary/20 rounded-xl p-3">
                      <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">{item.tip}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl border border-border hover:border-primary/50 hover:bg-muted font-medium transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {language === "ar" ? "إنشاء خطة جديدة" : "Generate a New Plan"}
          </button>
        </div>
      )}
    </div>
  );
}
