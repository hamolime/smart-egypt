import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { MapPin, X, Clock, Star } from "lucide-react";

interface Destination {
  name: string;
  img: string;
  tag: string;
  desc: string;
  highlights: string[];
}

const destinations: Destination[] = [
  {
    name: "Cairo",
    img: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&q=80&fit=crop",
    tag: "Capital City",
    desc: "Egypt's sprawling capital is a city of contrasts — ancient mosques tower beside modern skyscrapers, and the scent of street food mingles with history at every corner. Home to the iconic Khan El-Khalili bazaar and the world-class Grand Egyptian Museum.",
    highlights: ["Khan El-Khalili", "Islamic Cairo", "Grand Egyptian Museum", "Nile Corniche"],
  },
  {
    name: "Giza",
    img: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80&fit=crop",
    tag: "Ancient Wonder",
    desc: "Home to one of the Seven Wonders of the Ancient World. The Great Pyramids of Giza and the enigmatic Sphinx have stood for over 4,500 years, a testament to the ingenuity of ancient Egyptian civilization.",
    highlights: ["Great Pyramid of Khufu", "The Sphinx", "Solar Boat Museum", "Sound & Light Show"],
  },
  {
    name: "Luxor",
    img: "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=800&q=80&fit=crop",
    tag: "Open-Air Museum",
    desc: "Often called the world's greatest open-air museum, Luxor sits on the banks of the Nile surrounded by millennia of history. The East Bank holds the living city; the West Bank belongs to the dead — and the magnificent.",
    highlights: ["Valley of the Kings", "Karnak Temple", "Luxor Temple", "Hot Air Balloon Ride"],
  },
  {
    name: "Aswan",
    img: "https://images.unsplash.com/photo-1502013867623-64da150937a4?w=800&q=80&fit=crop",
    tag: "Nubian Gateway",
    desc: "Egypt's southernmost major city is a serene retreat on the Nile. Aswan offers a slower pace, vibrant Nubian culture, and some of the most spectacular sunsets in the country. Gateway to Abu Simbel.",
    highlights: ["Philae Temple", "Nubian Village", "Abu Simbel Day Trip", "Felucca on the Nile"],
  },
  {
    name: "Hurghada",
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&fit=crop",
    tag: "Red Sea Escape",
    desc: "A premier Red Sea resort destination with crystal-clear turquoise waters and some of the finest coral reefs in the world. Perfect for snorkeling, scuba diving, and water sports year-round.",
    highlights: ["Coral Reef Diving", "Giftun Island", "Desert Safari", "Parasailing & Windsurfing"],
  },
  {
    name: "Sharm El-Sheikh",
    img: "https://images.unsplash.com/photo-1540202404-b711e68078cc?w=800&q=80&fit=crop",
    tag: "Resort Paradise",
    desc: "A world-renowned resort town at the tip of the Sinai Peninsula, framed by dramatic mountains and the Red Sea. Famous for its vibrant nightlife, luxury hotels, and legendary dive sites like Ras Mohammed.",
    highlights: ["Ras Mohammed National Park", "Naama Bay", "Tiran Island Snorkeling", "Mount Sinai Sunrise"],
  },
  {
    name: "Alexandria",
    img: "https://images.unsplash.com/photo-1588015209044-d778d0f74ab2?w=800&q=80&fit=crop",
    tag: "Mediterranean Gem",
    desc: "Founded by Alexander the Great in 331 BC, Alexandria is Egypt's window to the Mediterranean. The city blends Greco-Roman heritage with a cosmopolitan European feel, and its seafront Corniche is one of the most beautiful in the region.",
    highlights: ["Bibliotheca Alexandrina", "Qaitbay Citadel", "Montazah Palace Gardens", "Roman Catacombs"],
  },
  {
    name: "Siwa Oasis",
    img: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80&fit=crop",
    tag: "Desert Oasis",
    desc: "A remote paradise deep in the Western Desert, surrounded by vast sand dunes and salt lakes. Siwa is home to the famous Oracle Temple of Amun where Alexander the Great received a divine verdict. Swim in natural freshwater springs under a blanket of stars.",
    highlights: ["Temple of the Oracle", "Great Sand Sea Safari", "Cleopatra's Spring", "Shali Fortress"],
  },
  {
    name: "Dahab",
    img: "https://images.unsplash.com/photo-1525183995014-bd94c0750cd5?w=800&q=80&fit=crop",
    tag: "Diver's Haven",
    desc: "A laid-back coastal town on the Sinai Peninsula beloved by backpackers, divers, and free spirits. The legendary Blue Hole dive site draws adventurers from around the world. By day, dive into the deep; by night, relax on rooftop restaurants over the sea.",
    highlights: ["Blue Hole Diving", "Canyon Snorkeling", "Camel Safari", "Bedouin Beach Camps"],
  },
  {
    name: "Marsa Matruh",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&fit=crop",
    tag: "Hidden Beach",
    desc: "Egypt's best-kept secret on the Mediterranean coast. Marsa Matruh boasts some of the most spectacularly turquoise and calm waters in the entire Mediterranean, with near-deserted white sand beaches that feel untouched by time.",
    highlights: ["Agiba Beach", "Rommel's Cave Museum", "Cleopatra's Bath", "Glass Beach"],
  },
  {
    name: "Abu Simbel",
    img: "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=800&q=80&fit=crop",
    tag: "UNESCO Heritage",
    desc: "The twin temples of Ramesses II are among the most awe-inspiring monuments in the world. Carved directly into a mountainside, these colossal temples were relocated in an extraordinary UNESCO engineering feat to save them from the rising waters of Lake Nasser.",
    highlights: ["Temple of Ramesses II", "Temple of Nefertari", "Sun Festival (Feb & Oct)", "Lake Nasser Cruise"],
  },
  {
    name: "Fayoum",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&fit=crop",
    tag: "Ancient Oasis",
    desc: "Egypt's largest oasis, just 100km from Cairo, hides dramatic desert landscapes, ancient pyramid fields, and the vast Wadi El-Rayan waterfalls. Wadi El-Hitan (Valley of the Whales) is a UNESCO World Heritage Site home to ancient whale fossils.",
    highlights: ["Wadi El-Hitan (Valley of Whales)", "Qarun Lake", "Wadi El-Rayan Waterfalls", "Pyramid of Meidum"],
  },
];

export default function ExplorePage() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<Destination | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImgError = (name: string) => {
    setImgErrors((prev) => ({ ...prev, [name]: true }));
  };

  return (
    <div className="flex-1 pb-10">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <h2 className="text-3xl font-bold mb-2">{t("popularDestinations")}</h2>
        <p className="text-muted-foreground mb-8">Click on any destination to learn more</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.name}
              data-testid={`card-destination-${dest.name.toLowerCase().replace(/\s/g, "-")}`}
              onClick={() => setSelected(dest)}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-border hover:border-primary/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(45,212,191,0.3)]"
            >
              {/* Image or fallback gradient */}
              {!imgErrors[dest.name] ? (
                <img
                  src={dest.img}
                  alt={dest.name}
                  onError={() => handleImgError(dest.name)}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0F2A44] to-[#0B4D3B]" />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/70" />

              {/* Tag badge */}
              <div className="absolute top-4 left-4 bg-primary/90 text-black text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                {dest.tag}
              </div>

              {/* Name */}
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="text-primary w-5 h-5 shrink-0" />
                  <span className="text-white font-bold text-xl">{dest.name}</span>
                </div>
                <span className="text-white/60 text-xs group-hover:text-primary transition-colors">Explore →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelected(null)}
          style={{ animation: "fadeIn 0.2s ease-out" }}
        >
          <div
            className="relative bg-card border border-border rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
              {!imgErrors[selected.name] ? (
                <img
                  src={selected.img}
                  alt={selected.name}
                  onError={() => handleImgError(selected.name)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0F2A44] to-[#0B4D3B]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Name overlay */}
              <div className="absolute bottom-4 left-5">
                <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">{selected.tag}</span>
                <h2 className="text-white text-3xl font-bold mt-2">{selected.name}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-muted-foreground leading-relaxed mb-6">{selected.desc}</p>

              <div>
                <h3 className="font-semibold text-sm text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4" /> Top Highlights
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selected.highlights.map((h) => (
                    <span key={h} className="bg-muted border border-border text-sm px-3 py-1.5 rounded-full">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
