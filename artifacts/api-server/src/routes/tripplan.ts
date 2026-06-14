import { Router } from "express";
import rateLimit from "express-rate-limit";
import Groq from "groq-sdk";
import { z } from "zod";

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_KEY ?? process.env.GROQ_API_KEY });

const tripLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});

const ALLOWED_LANGUAGES = ["en", "ar", "fr", "de", "es", "it", "zh"] as const;

const TripPlanRequestSchema = z.object({
  destination: z.string().min(1).max(200),
  days: z.number().int().min(1).max(14),
  budget: z.string().max(100).optional().default("flexible"),
  interests: z.array(z.string().max(50)).max(10).optional().default([]),
  language: z.enum(ALLOWED_LANGUAGES).optional().default("en"),
});

function sanitizeForPrompt(input: string): string {
  return input.replace(/[\r\n]+/g, " ").trim().slice(0, 200);
}

router.post("/trip-plan", tripLimiter, async (req, res) => {
  const parsed = TripPlanRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.flatten().fieldErrors });
    return;
  }

  const { destination, days, budget, interests, language } = parsed.data;

  const safeDestination = sanitizeForPrompt(destination);
  const safeBudget = sanitizeForPrompt(budget);
  const safeInterests = interests.map(sanitizeForPrompt);

  const langInstruction =
    language === "ar"
      ? "Respond entirely in Arabic."
      : language === "fr"
      ? "Respond entirely in French."
      : language === "de"
      ? "Respond entirely in German."
      : language === "es"
      ? "Respond entirely in Spanish."
      : language === "it"
      ? "Respond entirely in Italian."
      : language === "zh"
      ? "Respond entirely in Chinese."
      : "Respond entirely in English.";

  const prompt = `You are Smart Egypt AI Travel Planner. Create a detailed ${days}-day travel itinerary for: ${safeDestination}, Egypt.
Budget: ${safeBudget}.
Interests: ${safeInterests.length ? safeInterests.join(", ") : "general sightseeing"}.

${langInstruction}

Return ONLY a valid JSON array with exactly ${days} objects. No markdown, no explanation, only JSON.
Format:
[
  {"day": 1, "title": "Day title", "morning": "Morning activity", "afternoon": "Afternoon activity", "evening": "Evening activity", "tip": "One practical travel tip"},
  ...
]`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content ?? "[]";

    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      res.status(500).json({ error: "Failed to parse itinerary" });
      return;
    }

    const itinerary = JSON.parse(jsonMatch[0]) as unknown;
    res.json({ itinerary });
  } catch (err) {
    req.log.error(err, "Trip plan error");
    res.status(500).json({ error: "Failed to generate trip plan" });
  }
});

export default router;
