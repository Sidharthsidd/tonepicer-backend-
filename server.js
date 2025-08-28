import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/adjust-tone", async (req, res) => {
  const { text, tone } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text" });

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          {
            role: "system",
            content: `Rewrite the following text in a ${tone.formality}, ${tone.verbosity} style.`,
          },
          { role: "user", content: text },
        ],
      }),
    });

    const data = await response.json();
    const result = data?.choices?.[0]?.message?.content || text;
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: "Failed to call Mistral API" });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
