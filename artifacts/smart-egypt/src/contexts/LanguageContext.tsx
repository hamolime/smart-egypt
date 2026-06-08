import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "ar" | "fr" | "de" | "es" | "it" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<Language, string>> = {
  // Home / Explore hero
  discoverEgypt:       { en: "Discover Egypt",            ar: "اكتشف مصر",                    fr: "Découvrez l'Égypte",                          de: "Entdecke Ägypten",               es: "Descubre Egipto",                             it: "Scopri l'Egitto",                              zh: "探索埃及" },
  aiTravelGuide:       { en: "AI travel guide for exploring Egypt's wonders", ar: "دليل سفر ذكي لاستكشاف عجائب مصر", fr: "Guide de voyage IA pour explorer les merveilles d'Égypte", de: "KI-Reiseführer für Ägyptens Wunder", es: "Guía de viaje IA para explorar las maravillas de Egipto", it: "Guida turistica IA per esplorare le meraviglie dell'Egitto", zh: "探索埃及奇迹的AI旅行指南" },
  whereToSearch:       { en: "Where to? (Cairo, Luxor, Hurghada...)", ar: "إلى أين؟ (القاهرة، الأقصر، الغردقة...)", fr: "Où aller? (Le Caire, Louxor, Hurghada...)", de: "Wohin? (Kairo, Luxor, Hurghada...)", es: "¿Adónde? (El Cairo, Luxor, Hurghada...)", it: "Dove? (Cairo, Luxor, Hurghada...)", zh: "去哪里？（开罗、卢克索、赫尔格达...）" },
  exploreBtn:          { en: "Explore",       ar: "استكشف",    fr: "Explorer",   de: "Erkunden",    es: "Explorar",   it: "Esplora",    zh: "探索" },
  popularDestinations: { en: "Popular Destinations", ar: "الوجهات الشهيرة", fr: "Destinations Populaires", de: "Beliebte Reiseziele", es: "Destinos Populares", it: "Destinazioni Popolari", zh: "热门目的地" },

  // Nav items
  navExplore:    { en: "Explore",          ar: "استكشف",           fr: "Explorer",         de: "Erkunden",       es: "Explorar",       it: "Esplora",      zh: "探索" },
  navChatbot:    { en: "AI Chatbot",       ar: "المساعد الذكي",    fr: "Chatbot IA",       de: "KI-Chatbot",     es: "Chatbot IA",     it: "Chatbot IA",   zh: "AI聊天机器人" },
  navMap:        { en: "Interactive Map",  ar: "الخريطة التفاعلية", fr: "Carte Interactive", de: "Interaktive Karte", es: "Mapa Interactivo", it: "Mappa Interattiva", zh: "互动地图" },
  navTripPlan:   { en: "AI Trip Plan",     ar: "خطة رحلة ذكية",   fr: "Plan de Voyage IA", de: "KI-Reiseplan",   es: "Plan de Viaje IA", it: "Piano Viaggio IA", zh: "AI行程规划" },
  navDashboard:  { en: "Dashboard",        ar: "لوحة التحكم",      fr: "Tableau de Bord",  de: "Dashboard",      es: "Panel",          it: "Dashboard",    zh: "仪表板" },
  navSettings:   { en: "Settings",         ar: "الإعدادات",        fr: "Paramètres",       de: "Einstellungen",  es: "Configuración",  it: "Impostazioni", zh: "设置" },
  menuTitle:     { en: "Menu",             ar: "القائمة",          fr: "Menu",             de: "Menü",           es: "Menú",           it: "Menu",         zh: "菜单" },

  // Settings
  settingsTitle:    { en: "Settings & Preferences", ar: "الإعدادات والتفضيلات", fr: "Paramètres et Préférences", de: "Einstellungen", es: "Configuración", it: "Impostazioni", zh: "设置与首选项" },
  themeAppearance:  { en: "Theme Appearance",        ar: "مظهر الثيم",           fr: "Apparence du Thème",        de: "Erscheinungsbild", es: "Apariencia",   it: "Aspetto Tema",  zh: "主题外观" },
  darkMode:         { en: "Dark Mode",    ar: "الوضع الداكن", fr: "Mode Sombre", de: "Dunkelmodus", es: "Modo Oscuro", it: "Modalità Scura",  zh: "深色模式" },
  lightMode:        { en: "Light Mode",   ar: "الوضع الفاتح", fr: "Mode Clair",  de: "Hellmodus",   es: "Modo Claro",  it: "Modalità Chiara", zh: "浅色模式" },
  language:         { en: "Language",     ar: "اللغة",        fr: "Langue",      de: "Sprache",     es: "Idioma",      it: "Lingua",          zh: "语言" },

  // Chatbot
  askQuestion:   { en: "Ask a question about Egypt...", ar: "اسأل سؤالاً عن مصر...", fr: "Posez une question sur l'Égypte...", de: "Stelle eine Frage über Ägypten...", es: "Haz una pregunta sobre Egipto...", it: "Fai una domanda sull'Egitto...", zh: "提出关于埃及的问题..." },
  chatbotWelcome:{ en: "Welcome to Smart Egypt! How can I help you plan your journey today?", ar: "أهلاً بك في Smart Egypt! كيف يمكنني مساعدتك في تخطيط رحلتك اليوم؟", fr: "Bienvenue sur Smart Egypt ! Comment puis-je vous aider à planifier votre voyage ?", de: "Willkommen bei Smart Egypt! Wie kann ich Ihnen helfen, Ihre Reise zu planen?", es: "¡Bienvenido a Smart Egypt! ¿Cómo puedo ayudarte a planificar tu viaje?", it: "Benvenuto su Smart Egypt! Come posso aiutarti a pianificare il tuo viaggio?", zh: "欢迎来到Smart Egypt！我如何帮助您规划今天的旅程？" },
  alwaysOnline:  { en: "Powered by Groq · llama-3.3-70b", ar: "مدعوم بـ Groq · llama-3.3-70b", fr: "Propulsé par Groq · llama-3.3-70b", de: "Betrieben von Groq · llama-3.3-70b", es: "Impulsado por Groq · llama-3.3-70b", it: "Alimentato da Groq · llama-3.3-70b", zh: "由 Groq · llama-3.3-70b 提供" },
  thinking:      { en: "Thinking...", ar: "جاري التفكير...", fr: "En train de réfléchir...", de: "Denke nach...", es: "Pensando...", it: "Sto pensando...", zh: "思考中..." },

  // Map
  mapIntegrationTitle: { en: "Interactive Map Integration",  ar: "تكامل الخريطة التفاعلية",  fr: "Intégration Carte Interactive",  de: "Interaktive Kartenintegration",  es: "Integración de Mapa Interactivo",  it: "Integrazione Mappa Interattiva",  zh: "互动地图集成" },
  mapIntegrationDesc:  { en: "Mapbox or Google Maps integration goes here, complete with 3D terrain and custom Egypt travel markers.", ar: "يتم هنا دمج Mapbox أو Google Maps مع تضاريس ثلاثية الأبعاد وعلامات السياحة المخصصة.", fr: "L'intégration Mapbox ou Google Maps vient ici, avec un terrain 3D et des marqueurs personnalisés.", de: "Mapbox oder Google Maps Integration hier, mit 3D-Gelände und benutzerdefinierten Markierungen.", es: "La integración de Mapbox o Google Maps va aquí, con terreno 3D y marcadores personalizados.", it: "L'integrazione di Mapbox o Google Maps va qui, con terreno 3D e marcatori personalizzati.", zh: "Mapbox或Google地图集成在这里，包含3D地形和自定义埃及旅游标记。" },

  // Trip Plan
  setDuration:      { en: "1. Set Duration",   ar: "١. تحديد المدة",      fr: "1. Définir la Durée", de: "1. Dauer festlegen", es: "1. Establecer Duración", it: "1. Imposta Durata",   zh: "1. 设置时长" },
  chooseInterests:  { en: "2. Choose Interests", ar: "٢. اختيار الاهتمامات", fr: "2. Choisir les Intérêts", de: "2. Interessen wählen", es: "2. Elegir Intereses", it: "2. Scegli Interessi",  zh: "2. 选择兴趣" },
  setBudget:        { en: "3. Set Budget",      ar: "٣. تحديد الميزانية",  fr: "3. Définir le Budget", de: "3. Budget festlegen", es: "3. Establecer Presupuesto", it: "3. Imposta Budget", zh: "3. 设置预算" },
  generatePlan:     { en: "Generate AI Plan",   ar: "توليد الخطة الذكية",  fr: "Générer le Plan IA",   de: "KI-Plan erstellen",  es: "Generar Plan IA",       it: "Genera Piano IA",   zh: "生成AI计划" },
  backToPlanner:    { en: "← Back to planner",  ar: "← العودة للمخطط",    fr: "← Retour au planificateur", de: "← Zurück zum Planer", es: "← Volver al planificador", it: "← Torna al pianificatore", zh: "← 返回规划器" },
  yourItinerary:    { en: "Your 7-Day Egypt Experience", ar: "تجربتك في مصر لمدة ٧ أيام", fr: "Votre Expérience de 7 Jours en Égypte", de: "Ihr 7-Tage-Ägypten-Erlebnis", es: "Tu Experiencia de 7 Días en Egipto", it: "La Tua Esperienza di 7 Giorni in Egitto", zh: "您的7天埃及之旅" },
  duration:         { en: "Duration (Days)",  ar: "المدة (أيام)",    fr: "Durée (Jours)",  de: "Dauer (Tage)", es: "Duración (Días)", it: "Durata (Giorni)", zh: "时长（天）" },
  interests:        { en: "Interests",        ar: "الاهتمامات",      fr: "Intérêts",       de: "Interessen",   es: "Intereses",       it: "Interessi",       zh: "兴趣" },
  budget:           { en: "Budget",           ar: "الميزانية",       fr: "Budget",         de: "Budget",       es: "Presupuesto",     it: "Budget",          zh: "预算" },
  interest_history:     { en: "History",     ar: "التاريخ",    fr: "Histoire",   de: "Geschichte",  es: "Historia",   it: "Storia",    zh: "历史" },
  interest_beaches:     { en: "Beaches",     ar: "الشواطئ",    fr: "Plages",     de: "Strände",     es: "Playas",     it: "Spiagge",   zh: "海滩" },
  interest_culture:     { en: "Culture",     ar: "الثقافة",    fr: "Culture",    de: "Kultur",      es: "Cultura",    it: "Cultura",   zh: "文化" },
  interest_food:        { en: "Food",        ar: "الطعام",     fr: "Gastronomie",de: "Essen",       es: "Gastronomía",it: "Cucina",    zh: "美食" },
  interest_adventure:   { en: "Adventure",   ar: "المغامرة",   fr: "Aventure",   de: "Abenteuer",   es: "Aventura",   it: "Avventura", zh: "冒险" },
  interest_relaxation:  { en: "Relaxation",  ar: "الاسترخاء",  fr: "Détente",    de: "Entspannung", es: "Relajación", it: "Relax",     zh: "放松" },
  day_1_title: { en: "Arrival in Cairo",        ar: "الوصول إلى القاهرة",         fr: "Arrivée au Caire",              de: "Ankunft in Kairo",            es: "Llegada a El Cairo",             it: "Arrivo al Cairo",                zh: "抵达开罗" },
  day_1_desc:  { en: "Settle in. Evening Nile dinner cruise.", ar: "الاستقرار في الفندق. رحلة عشاء على النيل مساءً.", fr: "Installation à l'hôtel. Croisière dînatoire sur le Nil.", de: "Einchecken. Abend-Nilkreuzfahrt.", es: "Instalarse. Crucero cena por el Nilo.", it: "Sistemazione. Crociera cena sul Nilo.", zh: "安顿下来。尼罗河晚餐游船之旅。" },
  day_2_title: { en: "Giza Pyramids",           ar: "أهرامات الجيزة",             fr: "Pyramides de Gizeh",            de: "Gizeh-Pyramiden",             es: "Pirámides de Guiza",             it: "Piramidi di Giza",               zh: "吉萨金字塔" },
  day_2_desc:  { en: "Tour the Great Pyramids, Sphinx & Grand Egyptian Museum.", ar: "جولة في الأهرامات والأبو الهول والمتحف المصري الكبير.", fr: "Visite des Pyramides, Sphinx et Grand Musée Égyptien.", de: "Pyramiden, Sphinx & Großes Ägyptisches Museum.", es: "Tour de Pirámides, Esfinge y Gran Museo Egipcio.", it: "Tour delle Piramidi, Sfinge e Grande Museo Egiziano.", zh: "参观大金字塔、狮身人面像和大埃及博物馆。" },
  day_3_title: { en: "Fly to Luxor",            ar: "السفر إلى الأقصر",           fr: "Vol pour Louxor",               de: "Flug nach Luxor",             es: "Vuelo a Luxor",                  it: "Volo per Luxor",                 zh: "飞往卢克索" },
  day_3_desc:  { en: "Explore Karnak and Luxor temples on the East Bank.", ar: "استكشاف معابد الكرنك والأقصر على الضفة الشرقية.", fr: "Exploration des temples de Karnak et Louxor.", de: "Karnak und Luxor-Tempel am Ostufer erkunden.", es: "Explorar los templos de Karnak y Luxor.", it: "Esplora i templi di Karnak e Luxor.", zh: "游览卡纳克神庙和卢克索神庙。" },
  day_4_title: { en: "Valley of the Kings",     ar: "وادي الملوك",                fr: "Vallée des Rois",               de: "Tal der Könige",              es: "Valle de los Reyes",             it: "Valle dei Re",                   zh: "帝王谷" },
  day_4_desc:  { en: "Sunrise hot air balloon ride. Visit tombs and Hatshepsut temple.", ar: "رحلة بالمنطاد عند الشروق. زيارة المقابر ومعبد حتشبسوت.", fr: "Montgolfière au lever du soleil. Tombes et temple d'Hatshepsout.", de: "Heißluftballon bei Sonnenaufgang. Gräber & Hatschepsut-Tempel.", es: "Globo aerostático al amanecer. Tumbas y templo de Hatshepsut.", it: "Mongolfiera all'alba. Tombe e tempio di Hatshepsut.", zh: "日出热气球之旅。参观陵墓和哈特谢普苏特神庙。" },
  day_5_title: { en: "Red Sea Relaxation",      ar: "استرخاء على البحر الأحمر",   fr: "Détente en Mer Rouge",          de: "Rotes Meer Entspannung",      es: "Relajación en el Mar Rojo",      it: "Relax nel Mar Rosso",            zh: "红海休闲" },
  day_5_desc:  { en: "Transfer to Hurghada. Afternoon snorkeling.", ar: "الانتقال إلى الغردقة. الغطس في الظهيرة.", fr: "Transfert à Hurghada. Plongée en après-midi.", de: "Transfer nach Hurghada. Nachmittags Schnorcheln.", es: "Traslado a Hurghada. Snorkel por la tarde.", it: "Transfer a Hurghada. Snorkeling nel pomeriggio.", zh: "前往赫尔格达。下午浮潜。" },

  // Dashboard
  totalVisitors:   { en: "Total Visitors",  ar: "إجمالي الزوار",                fr: "Total des Visiteurs", de: "Besucher gesamt",  es: "Total de Visitantes", it: "Visitatori Totali",  zh: "总访客" },
  appRating:       { en: "App Rating",      ar: "تقييم التطبيق",                fr: "Note de l'App",       de: "App-Bewertung",     es: "Calificación",        it: "Valutazione App",    zh: "应用评分" },
  timeSaved:       { en: "Time Saved",      ar: "الوقت الموفر",                 fr: "Temps Gagné",         de: "Zeit gespart",      es: "Tiempo Ahorrado",     it: "Tempo Risparmiato",  zh: "节省时间" },
  aiInteractions:  { en: "AI Interactions", ar: "تفاعلات الذكاء الاصطناعي",    fr: "Interactions IA",     de: "KI-Interaktionen",  es: "Interacciones IA",    it: "Interazioni IA",     zh: "AI交互" },
  visitorActivity: { en: "Visitor Activity",ar: "نشاط الزوار",                  fr: "Activité des Visiteurs", de: "Besucheraktivität", es: "Actividad de Visitantes", it: "Attività Visitatori", zh: "访客活动" },
  topRegions:      { en: "Top Regions",     ar: "أهم المناطق",                  fr: "Meilleures Régions",  de: "Top-Regionen",      es: "Principales Regiones",it: "Regioni Principali", zh: "热门地区" },

  // Send button
  send: { en: "Send", ar: "إرسال", fr: "Envoyer", de: "Senden", es: "Enviar", it: "Invia", zh: "发送" },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("se-lang");
    return (saved as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("se-lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, []);

  const t = (key: string): string => {
    return translations[key]?.[language] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
