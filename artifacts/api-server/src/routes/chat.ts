import { Router } from "express";
import rateLimit from "express-rate-limit";
import Groq from "groq-sdk";
import { z } from "zod";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_KEY ?? process.env.GROQ_API_KEY });

const chatLimiter = rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});

const ChatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(50),
});

router.post("/chat", chatLimiter, async (req, res) => {
  const parsed = ChatRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.flatten().fieldErrors });
    return;
  }

  const { messages } = parsed.data;

  const history: ChatCompletionMessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      messages: [
        {
          role: "system",
          content:
            "You are Smart Egypt AI Guide — a knowledgeable, friendly travel assistant specializing in Egypt. You help tourists discover historical sites, local food, culture, transportation, accommodation, and activities across Egypt (Cairo, Luxor, Aswan, Hurghada, Sharm El-Sheikh, Alexandria, etc.). Keep answers concise, engaging, and practical. Respond in the same language the user writes in.",
        },
        ...history,
      ],
      max_tokens: 512,
      temperature: 0.7,
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "Sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (err) {
    req.log.error(err, "Groq API error");
    res.status(500).json({ error: "AI service unavailable" });
  }
});

export default router;
