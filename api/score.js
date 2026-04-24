// Brevet Sales Simulation — AI Scoring Endpoint (Pages Router / Vercel Function)
// This is the ACTIVE scoring handler. It takes precedence over app/api/score/route.js
// because Vercel treats /api/*.js at the project root as serverless functions.

import Anthropic from "@anthropic-ai/sdk";

export const config = {
  maxDuration: 60,
};

// Hard timeout wrapper — guarantees no hang
function withHardTimeout(promise, ms, label = "operation") {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`${label} hard-timed-out after ${ms}ms`)),
      ms
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// Quality gate for garbage submissions
function assessSubmissionQuality(submission) {
  const fullText = (submission || "").trim();
  if (!fullText) return { quality: "empty", score: 5, skipAI: true };

  const lines = fullText.split("\n");
  const contentLines = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.match(/:\s*$/) && trimmed.length < 80) continue;
    if (trimmed.match(/\?\s*$/)) continue;
    contentLines.push(trimmed);
  }
  const teamContent = contentLines.join(" ");
  const words = teamContent.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));

  const garbageWords = new Set([
    "test", "asdf", "hello", "hi", "foo", "bar", "xxx", "aaa", "abc",
    "123", "na", "n/a", "none", "idk", "nothing", "tbd", "todo",
    "blah", "lol", "ok", "yes", "no", "x", "y", "z",
  ]);
  const nonGarbageWords = words.filter(
    (w) => !garbageWords.has(w.toLowerCase()) && w.length > 1
  );
  const garbageRatio = 1 - nonGarbageWords.length / Math.max(1, wordCount);

  if (garbageRatio >= 0.7 && wordCount <= 30) return { quality: "garbage", score: 10, skipAI: true };
  if (wordCount <= 8 && garbageRatio >= 0.5) return { quality: "garbage", score: 10, skipAI: true };
  if (uniqueWords.size <= 2 && wordCount >= 3) return { quality: "repetitive", score: 12, skipAI: true };
  if (teamContent.length < 15 && wordCount < 6) return { quality: "minimal", score: 15, skipAI: true };

  return { quality: "normal", skipAI: false };
}

function generateGarbageScore(criteria, qualityResult) {
  const baseScore = qualityResult.score;
  const criteriaScores = {};
  criteria.forEach((c) => {
    criteriaScores[c.name] = baseScore;
  });
  const feedbackByQuality = {
    empty: "There's no submission to coach on. Please walk through the framework and give me your team's real thinking.",
    garbage: "This doesn't read like a genuine attempt. Take another pass — think about what you'd actually say if you were sitting across from this CEO.",
    repetitive: "I can see this isn't a serious submission. Review the scenario, talk it through as a team, and send me something I can coach you on.",
    minimal: "There's not enough here for me to give you meaningful feedback. Dig into the scenario and build out your team's real strategic thinking.",
  };
  return {
    score: { overall: baseScore, criteria: criteriaScores, timestamp: new Date().toISOString() },
    coaching: {
      tone: "needs_work",
      mainFeedback: feedbackByQuality[qualityResult.quality] || feedbackByQuality.garbage,
      strengths: ["You engaged with the exercise — now let's see your best thinking."],
      improvements: [
        "Read the scenario carefully — the customer's stakeholders, timing, and stakes are all there.",
        "Think like a trusted advisor, not a vendor.",
        "Ground every recommendation in THIS customer's context.",
      ],
      scoreInterpretation: "Needs Development",
    },
    isQualityGated: true,
  };
}

function validateAndAdjustScores(scores) {
  const values = Object.values(scores);
  if (values.length <= 1) return scores;
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max - min >= 10) return scores;
  const adjusted = {};
  const sorted = Object.entries(scores).sort(([, a], [, b]) => a - b);
  const spreadPerStep = Math.max(4, Math.round(15 / (sorted.length - 1)));
  sorted.forEach(([name, score], index) => {
    const offset = (index - (sorted.length - 1) / 2) * spreadPerStep;
    adjusted[name] = Math.round(Math.min(100, Math.max(10, score + offset)));
  });
  return adjusted;
}

export default async function handler(req, res) {
  console.log("[score] handler invoked, method:", req.method);

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { submission, scenario, phase = "initial", wobbleResponse } = req.body || {};
  const isWobble = phase === "wobble";
  const textToScore = isWobble ? wobbleResponse : submission;
  console.log("[score] Client:", scenario?.client?.name, "phase:", phase, "text length:", textToScore?.length);

  if (!submission || !scenario) {
    console.error("[score] Missing submission or scenario");
    return res.status(400).json({ error: "Missing submission or scenario data" });
  }
  if (isWobble && !wobbleResponse) {
    console.error("[score] Wobble phase but no wobbleResponse");
    return res.status(400).json({ error: "Missing wobble response" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[score] ANTHROPIC_API_KEY not set");
    return res.status(500).json({ error: "Server missing API key" });
  }

  const activeCriteria = isWobble
    ? scenario.motion.wobble?.scoringCriteria || []
    : scenario.motion.scoringCriteria;

  // Quality gate — applied to whatever text is being scored
  const qualityResult = assessSubmissionQuality(textToScore);
  if (qualityResult.skipAI) {
    console.log("[score] Quality gate triggered:", qualityResult.quality);
    return res.status(200).json(generateGarbageScore(activeCriteria, qualityResult));
  }

  const systemPrompt = isWobble
    ? `You are an elite sales coach at Brevet, evaluating how a seller ADAPTS when the deal wobbles.

The seller has already submitted their initial strategy. Now a curveball has dropped — new intel, a competitive move, a political shift. You are scoring their RE-READ and RESPONSE to the new dynamic.

## WHAT YOU'RE LOOKING FOR
- Did they ENGAGE with the new information, or just repeat their initial thinking?
- Do they show sophisticated political / competitive reading of the new dynamics?
- Do they move toward a CONCRETE next action, not just more analysis?
- Do they stay composed — the best sellers adapt, they don't panic?

## SCORING (use the full 10-100 range)
- 90-100: Championship adaptation — directly engages the curveball with a composed, specific, executive-grade response
- 75-89: Strong adaptation — acknowledges the new reality and offers grounded next moves
- 55-74: Building Momentum — directionally correct but generic; doesn't fully engage the curveball
- 35-54: Foundation Phase — ignores or misreads the new intel; repeats initial strategy
- 10-34: Not a genuine attempt

## RULES
1. Default to the middle when unsure
2. If the response ignores the curveball, cap at 55
3. At least 12 points of spread between highest and lowest criterion
4. Score the thinking, not the grammar`
    : `You are an elite sales coach at Brevet, a consulting firm that teaches Business Value Selling. You have 25+ years of experience training sellers to engage business buyers — not procurement, not champions below the decision line, but the actual executives who make budget decisions.

Evaluate the team's response like a real coach — honest, direct, grounded in Brevet's methodology.

## METHODOLOGY
Legacy Displacement is about creating the buying decision by making the cost of the status quo unavoidable. Great responses quantify status-quo cost, connect to strategic priorities, speak executive language, and offer credible parallels. Weak responses lead with features, treat it as procurement, miss the customer context, or stay operational.

## SCORING (use the full 10-100 range)
- 90-100 Championship Caliber: specific customer references, business outcome framing, strategic clarity
- 75-89 Strong Contender: customer-specific, connects to priorities, grounded recommendations
- 55-74 Building Momentum: generic; could apply to any customer
- 35-54 Foundation Phase: feature-centric, ignores context
- 10-34 Not a genuine attempt

## RULES
1. Default to the middle when unsure
2. Generic = 65 ceiling
3. Each criterion scored independently
4. At least 12 points of spread between highest and lowest
5. Quality over quantity
6. Score the thinking, not the grammar`;

  const buildCriteriaDetails = (criteria) =>
    criteria
      .map((c) => {
        let d = `- **${c.name}** (${c.weight}% weight): ${c.description}\n`;
        if (c.poor) d += `  POOR: ${c.poor}\n`;
        if (c.champion) d += `  CHAMPION: ${c.champion}`;
        return d;
      })
      .join("\n\n");

  const scenarioContext = `## SCENARIO: ${scenario.client.name}
Industry: ${scenario.client.industry} | Motion: ${scenario.motion.name}
Size: ${scenario.client.size} | Revenue: ${scenario.client.revenue}
Current: ${scenario.client.currentSolution}

Situation: ${scenario.subtitle}

Context:
${scenario.context.map((c) => `- ${c}`).join("\n")}

Stakeholders:
${scenario.personas.map((p) => `- ${p.role} — ${p.name}: ${p.tagline} | Fears: ${p.fears} | Wants: ${p.wants} | Levers: ${p.levers}`).join("\n")}

Mission: ${scenario.mission}`;

  const scoringPrompt = isWobble
    ? `${scenarioContext}

---

## TEAM'S INITIAL STRATEGY (context — already scored)
${submission}

---

## WOBBLE — CURVEBALL DROPPED
**${scenario.motion.wobble.title}**

${scenario.motion.wobble.description}

**Question posed:** ${scenario.motion.wobble.question}

---

## TEAM'S WOBBLE RESPONSE
${wobbleResponse}

---

## WOBBLE RUBRIC
${buildCriteriaDetails(activeCriteria)}

---

Evaluate the team's WOBBLE RESPONSE ONLY (not their initial strategy). Focus on how well they adapted to the curveball.

Respond in EXACT JSON (no other text before or after):
{
  "scores": {
    ${activeCriteria.map((c) => `"${c.name}": [10-100]`).join(",\n    ")}
  },
  "overallAssessment": "[2-3 sentences on how well they adapted to the curveball, referencing what they wrote]",
  "strengths": ["[Specific strength 1]", "[Specific strength 2]"],
  "improvements": ["[Specific improvement 1]", "[Another]"],
  "coachChallenge": "[Thought-provoking question about how they handle pressure moments]"
}`
    : `${scenarioContext}

## RUBRIC
${buildCriteriaDetails(activeCriteria)}

---

## TEAM'S SUBMISSION
${submission}

---

Evaluate and respond in EXACT JSON (no other text before or after):
{
  "scores": {
    ${activeCriteria.map((c) => `"${c.name}": [10-100]`).join(",\n    ")}
  },
  "overallAssessment": "[2-3 sentences referencing what they wrote]",
  "strengths": ["[Specific strength 1]", "[Specific strength 2]"],
  "improvements": ["[Specific improvement 1]", "[Another]", "[Third]"],
  "coachChallenge": "[Thought-provoking question tied to their gaps]"
}`;

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    maxRetries: 0,
  });

  console.log("[score] Calling Claude API...");
  let response;
  try {
    response = await withHardTimeout(
      anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        temperature: 0.3,
        messages: [{ role: "user", content: scoringPrompt }],
        system: systemPrompt,
      }),
      45_000,
      "Claude API call"
    );
    console.log("[score] Claude responded, tokens:", response?.usage?.output_tokens);
  } catch (err) {
    console.error("[score] Claude call failed:", err.message);
    console.error("[score] Status:", err.status, "Type:", err.type);
    return res.status(502).json({
      error: "Claude scoring failed",
      detail: err.message,
      status: err.status,
      type: err.type,
    });
  }

  const aiText = response?.content?.[0]?.text || "";
  let aiResult;
  try {
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    aiResult = JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("[score] Failed to parse AI JSON:", e.message);
    console.error("[score] Response text:", aiText.slice(0, 300));
    return res.status(500).json({ error: "Failed to parse AI response" });
  }

  aiResult.scores = validateAndAdjustScores(aiResult.scores);

  let totalScore = 0;
  let totalWeight = 0;
  activeCriteria.forEach((c) => {
    const s = aiResult.scores[c.name] || 40;
    totalScore += s * c.weight;
    totalWeight += c.weight;
  });
  const overallScore = Math.round(totalScore / totalWeight);

  let scoreInterpretation;
  if (overallScore >= 90) scoreInterpretation = "Championship Caliber";
  else if (overallScore >= 75) scoreInterpretation = "Strong Contender";
  else if (overallScore >= 55) scoreInterpretation = "Building Momentum";
  else if (overallScore >= 35) scoreInterpretation = "Foundation Phase";
  else scoreInterpretation = "Needs Development";

  console.log("[score] Success — overall:", overallScore);

  return res.status(200).json({
    score: {
      overall: overallScore,
      criteria: aiResult.scores,
      timestamp: new Date().toISOString(),
    },
    coaching: {
      tone: overallScore >= 75 ? "good" : overallScore >= 55 ? "developing" : "needs_work",
      mainFeedback: aiResult.overallAssessment,
      strengths: aiResult.strengths,
      improvements: aiResult.improvements,
      coachChallenge: aiResult.coachChallenge,
      scoreInterpretation,
    },
  });
}
