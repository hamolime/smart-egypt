import React from "react";
import { X, Home, Compass, MessageSquare, Map as MapIcon, Calendar, LayoutDashboard, Settings } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  setPage: (page: string) => void;
}

export default function Drawer({ isOpen, onClose, currentPage, setPage }: DrawerProps) {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const navItems = [
    { id: "explore",   icon: Compass,         label: t("navExplore") },
    { id: "chatbot",   icon: MessageSquare,   label: t("navChatbot") },
    { id: "map",       icon: MapIcon,         label: t("navMap") },
    { id: "trip-plan", icon: Calendar,        label: t("navTripPlan") },
    { id: "dashboard", icon: LayoutDashboard, label: t("navDashboard") },
    { id: "settings",  icon: Settings,        label: t("navSettings") },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 bottom-0 w-72 bg-card border-border z-50 transition-transform duration-300 ease-in-out ${
          isRTL
            ? `left-0 border-r ${isOpen ? "translate-x-0" : "-translate-x-full"}`
            : `right-0 border-l ${isOpen ? "translate-x-0" : "translate-x-full"}`
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <span className="font-bold text-lg">{t("menuTitle")}</span>
          <button
            data-testid="button-close-drawer"
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                data-testid={`nav-${item.id}`}
                onClick={() => { setPage(item.id); onClose(); }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors w-full text-start ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-primary" : ""}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
