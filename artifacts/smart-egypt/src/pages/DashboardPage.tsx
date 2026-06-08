import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Users, Star, Clock, Bot } from "lucide-react";

export default function DashboardPage() {
  const { t } = useLanguage();

  const stats = [
    { label: t("totalVisitors"),  value: "244K", icon: Users, trend: "+12%" },
    { label: t("appRating"),      value: "4.5/5", icon: Star, trend: "+0.2" },
    { label: t("timeSaved"),      value: "-40%",  icon: Clock, trend: "-5%" },
    { label: t("aiInteractions"), value: "107",   icon: Bot,  trend: "+23%" },
  ];

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full pt-10 pb-10 px-6">
      <h1 className="text-3xl font-bold mb-8">{t("navDashboard")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="text-primary w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 h-80 flex flex-col">
          <h3 className="font-bold text-lg mb-4">{t("visitorActivity")}</h3>
          <div className="flex-1 w-full bg-muted/30 rounded-xl border border-border/50 flex items-end px-4 pt-4 gap-2">
            {[40, 70, 45, 90, 65, 80, 55, 100, 75, 60, 85, 50].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 h-80">
          <h3 className="font-bold text-lg mb-4">{t("topRegions")}</h3>
          <div className="space-y-4 mt-6">
            {[
              { name: "Cairo",    pct: 85 },
              { name: "Luxor",    pct: 60 },
              { name: "Hurghada", pct: 45 },
            ].map((region) => (
              <div key={region.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{region.name}</span>
                  <span className="font-medium">{region.pct}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${region.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
