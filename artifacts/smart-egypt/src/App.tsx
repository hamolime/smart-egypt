import React, { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import ChatbotPage from "./pages/ChatbotPage";
import MapPage from "./pages/MapPage";
import TripPlanPage from "./pages/TripPlanPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "home":       return <HomePage />;
      case "explore":    return <ExplorePage />;
      case "chatbot":    return <ChatbotPage />;
      case "map":        return <MapPage />;
      case "trip-plan":  return <TripPlanPage />;
      case "dashboard":  return <DashboardPage />;
      case "settings":   return <SettingsPage />;
      default:           return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Header
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onNavigateHome={() => setCurrentPage("home")}
      />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />

      <main className="flex-1 flex flex-col pt-16">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
