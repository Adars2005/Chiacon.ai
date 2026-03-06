import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ── AI Opportunity Generator endpoint ──────────────────────────────
app.post("/generate", async (req, res) => {
  const { problem } = req.body;

  if (!problem || !problem.trim()) {
    return res.status(400).json({ error: "Please provide a business problem." });
  }

  const prompt = `
You are an elite AI strategy consultant working for Chiacon, a leading AI consultancy.

A company reports the following business problem:
"${problem}"

Provide a structured response using exactly these section headers (with the markdown ## prefix):

## Problem Summary
Briefly summarize the core business problem in 2-3 sentences.

## AI Opportunities
Provide 3 realistic, specific AI-powered solutions that could address this problem. Number them 1-3 and include a brief explanation for each.

## Expected Business Impact
Explain in 3-4 bullet points how these AI solutions could measurably improve efficiency, revenue, or decision-making. Be specific with potential metrics where possible.

Keep the response concise, actionable, and professional. Use clear formatting.`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Groq API error:", response.status, errorBody);
      return res
        .status(502)
        .json({ error: "AI service unavailable. Please try again later." });
    }

    const data = await response.json();
    res.json({ output: data.choices[0].message.content });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ── AI Email Generator endpoint ────────────────────────────────────
app.post("/generate-email", async (req, res) => {
  const { companyName, industry, role } = req.body;

  if (!companyName?.trim() || !industry?.trim() || !role?.trim()) {
    return res
      .status(400)
      .json({ error: "Please fill in all fields: Company Name, Industry, and Role." });
  }

  const prompt = `
You are a senior business development professional at Chiacon, a leading AI consultancy.

Write a personalized outreach email to a ${role} at ${companyName}, a company in the ${industry} industry.

The email should:
1. Have a compelling subject line
2. Open with a personalized hook relevant to the ${industry} industry
3. Briefly introduce Chiacon's AI capabilities (predictive analytics, automation, decision support)
4. Mention 2 specific AI use cases relevant to the ${industry} industry and the ${role} role
5. Include a clear call-to-action for a discovery call
6. Be professional, concise, and persuasive

Format the response exactly like this:

## Subject Line
[Write the subject line here]

## Email Body
[Write the complete email body here with proper greeting and sign-off]

Keep it under 250 words. Make it feel personal, not templated.`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Groq API error:", response.status, errorBody);
      return res
        .status(502)
        .json({ error: "AI service unavailable. Please try again later." });
    }

    const data = await response.json();
    res.json({ output: data.choices[0].message.content });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ── Health check ───────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`✅ Chiacon AI server running → http://localhost:${PORT}`);
});
