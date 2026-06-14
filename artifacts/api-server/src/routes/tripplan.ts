import { Router } from "express";
import Groq from "groq-sdk";

const router = Router();

const groqApiKey = process.env.GROQ_KEY ?? process.env.GROQ_API_KEY;
if (!groqApiKey) {
  console.warn("[tripplan] GROQ_KEY / GROQ_API_KEY not set — trip-plan endpoint will return 503");
}
const groq = new Groq({ apiKey: groqApiKey });

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

  if (!groqApiKey) {
    res.status(503).json({ error: "AI service not configured" });
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
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content ?? "[]";

    // Extract JSON from the response
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      req.log.warn({ raw }, "AI response did not contain a JSON array");
      res.status(502).json({ error: "Failed to parse itinerary from AI response" });
      return;
    }

    let itinerary: unknown;
    try {
      itinerary = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      req.log.warn({ parseErr, raw: jsonMatch[0] }, "JSON parse failed on AI response");
      res.status(502).json({ error: "AI returned malformed JSON" });
      return;
    }

    res.json({ itinerary });
  } catch (err) {
    req.log.error(err, "Trip plan error");
    res.status(502).json({ error: "Failed to generate trip plan" });
  }
});

export default router;
