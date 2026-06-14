import { Router } from "express";
import Groq from "groq-sdk";

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_KEY ?? process.env.GROQ_API_KEY });

router.post("/trip-plan", async (req, res) => {
  const { destination, days, budget, interests, language } = req.body as {
    destination: string;
    days: number;
    budget: string;
    interests: string[];
    language?: string;
  };

  if (!destination || !days) {
    res.status(400).json({ error: "destination and days are required" });
    return;
  }

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

  const prompt = `You are Smart Egypt AI Travel Planner. Create a detailed ${days}-day travel itinerary for: ${destination}, Egypt.
Budget: ${budget || "flexible"}.
Interests: ${interests?.length ? interests.join(", ") : "general sightseeing"}.

${langInstruction}

Return ONLY a valid JSON array with exactly ${days} objects. No markdown, no explanation, only JSON.
Format:
[
  {"day": 1, "title": "Day title", "morning": "Morning activity", "afternoon": "Afternoon activity", "evening": "Evening activity", "tip": "One practical travel tip"},
  ...
]`;

  try {
    const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
    const completion = await groq.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content ?? "[]";

    // Extract JSON from the response
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      req.log.error({ raw: raw.slice(0, 200) }, "No JSON array found in AI response");
      res.status(500).json({ error: "Failed to parse itinerary" });
      return;
    }

    const itinerary = JSON.parse(jsonMatch[0]);
    res.json({ itinerary });
  } catch (err) {
    req.log.error(err, "Trip plan error");
    res.status(500).json({ error: "Failed to generate trip plan" });
  }
});

export default router;
