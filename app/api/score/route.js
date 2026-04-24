// Brevet Sales Simulation — AI Scoring Endpoint (App Router version)
// Mirrors /api/score.js — whichever Vercel routes to, the result is the same.

import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

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
  criteria.forEach((c) => { criteriaScores[c.name] = baseScore; });
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

// Structured wobble scoring (choice / ranking / multi-select)
function interpretationFromScore(score) {
  if (score >= 90) return "Championship Caliber";
  if (score >= 75) return "Strong Contender";
  if (score >= 55) return "Building Momentum";
  if (score >= 35) return "Foundation Phase";
  return "Needs Development";
}
function tierFromScore(score) {
  if (score >= 85) return "excellent";
  if (score >= 65) return "good";
  if (score >= 40) return "average";
  return "poor";
}
function computeStructuredWobbleScore(wobble, response) {
  const type = wobble.type;
  let overall = wobble.defaultScore ?? 40;
  let coachCopy = "";
  let strengths = [];
  let improvements = [];
  let criteriaScores = {};

  if (type === "choice") {
    const chosenOption = (wobble.options || []).find((o) => o.id === response);
    overall = chosenOption?.points ?? 40;
    coachCopy = wobble.scoringCopy?.[response] || "";
    criteriaScores = { "Decision Quality": overall };
    if (overall >= 75) {
      strengths = ["Picked the executive-grade move under pressure."];
      improvements = ["Make sure your follow-through matches the quality of the decision."];
    } else if (overall >= 50) {
      strengths = ["You didn't panic or concede."];
      improvements = ["There was a stronger move available."];
    } else {
      strengths = ["You engaged with the curveball instead of ignoring it."];
      improvements = [
        "This move plays the game on the other side's terms.",
        "Strong sellers change the frame instead of arguing within it.",
      ];
    }
  } else if (type === "ranking") {
    overall = wobble.rankingScores?.[response] ?? wobble.defaultScore ?? 40;
    const tier = tierFromScore(overall);
    coachCopy = wobble.scoringCopy?.[tier] || "";
    criteriaScores = { "Sequencing": overall };
    if (tier === "excellent" || tier === "good") {
      strengths = ["Sequenced the moves in the right order for the political reality."];
      improvements = ["Translate the sequencing into a concrete 30/60/90 plan."];
    } else {
      strengths = ["You had a plan — not every seller does."];
      improvements = [
        "The order of moves matters. Commercial concessions early signal desperation.",
        "What does the NEW exec need to see from you first?",
      ];
    }
  } else if (type === "multi-select") {
    const sortedKey = response.split(",").sort().join(",");
    const scoreTable = wobble.multiSelectScores || {};
    overall = scoreTable[sortedKey] ?? scoreTable[response] ?? wobble.defaultScore ?? 40;
    const tier = tierFromScore(overall);
    coachCopy = wobble.scoringCopy?.[tier] || "";
    criteriaScores = { "Move Pairing": overall };
    if (tier === "excellent" || tier === "good") {
      strengths = ["Two complementary moves that reinforce each other."];
      improvements = ["Build the 60-day execution plan that makes both visible."];
    } else {
      strengths = ["You made a choice — indecision is the worst outcome here."];
      improvements = [
        "One of your two moves may be undercutting the other.",
        "The best pairs work together: one creates narrative, the other provides political cover.",
      ];
    }
  }

  return {
    score: { overall, criteria: criteriaScores, timestamp: new Date().toISOString() },
    coaching: {
      tone: overall >= 75 ? "good" : overall >= 55 ? "developing" : "needs_work",
      mainFeedback: coachCopy || "No coaching notes available for this response.",
      strengths,
      improvements,
      coachChallenge: "In the real deal, what would you do in the next 24 hours to compound this move?",
      scoreInterpretation: interpretationFromScore(overall),
    },
    isStructured: true,
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

export async function POST(req) {
  console.log("[score:app] POST received");

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { submission, scenario, phase = "initial", wobbleResponse } = body;
  const isWobble = phase === "wobble";
  const textToScore = isWobble ? wobbleResponse : submission;
  console.log("[score:app] Client:", scenario?.client?.name, "phase:", phase);

  if (!submission || !scenario) {
    return Response.json({ error: "Missing submission or scenario" }, { status: 400 });
  }
  if (isWobble && !wobbleResponse) {
    return Response.json({ error: "Missing wobble response" }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Server missing API key" }, { status: 500 });
  }

  const wobbleType = scenario.motion.wobble?.type || "text";
  const isStructuredWobble = isWobble && wobbleType !== "text";

  if (isStructuredWobble) {
    console.log("[score:app] Structured wobble, type:", wobbleType);
    const result = computeStructuredWobbleScore(scenario.motion.wobble, wobbleResponse);
    return Response.json(result);
  }

  const activeCriteria = isWobble
    ? scenario.motion.wobble?.scoringCriteria || []
    : scenario.motion.scoringCriteria;

  const qualityResult = assessSubmissionQuality(textToScore);
  if (qualityResult.skipAI) {
    return Response.json(generateGarbageScore(activeCriteria, qualityResult));
  }

  const systemPrompt = isWobble
    ? `You are an elite sales coach at Brevet, evaluating how a seller ADAPTS when the deal wobbles.

The seller has already submitted their initial strategy. Now a curveball has dropped — new intel, a competitive move, a political shift. You are scoring their RE-READ and RESPONSE to the new dynamic.

## WHAT YOU'RE LOOKING FOR
- Did they ENGAGE with the new information, or just repeat their initial thinking?
- Do they show sophisticated political / competitive reading?
- Do they move toward a CONCRETE next action, not just more analysis?
- Do they stay composed — the best sellers adapt, they don't panic?

## SCORING (use the full 10-100 range)
- 90-100: Championship adaptation — engages the curveball with composed, specific, executive-grade response
- 75-89: Strong adaptation — acknowledges new reality, offers grounded moves
- 55-74: Building Momentum — directionally correct but generic
- 35-54: Foundation Phase — ignores or misreads the new intel
- 10-34: Not a genuine attempt

## RULES
1. If the response ignores the curveball, cap at 55
2. At least 12 points of spread between highest and lowest
3. Score the thinking, not the grammar`
    : `You are an elite sales coach at Brevet, a consulting firm that teaches Business Value Selling. You have 25+ years of experience training sellers to engage business buyers — not procurement, not champions below the decision line, but the actual executives who make budget decisions.

Evaluate the team's response like a real coach — honest, direct, grounded in Brevet's methodology.

## METHODOLOGY
Legacy Displacement is about creating the buying decision by making the cost of the status quo unavoidable. Great responses quantify status-quo cost, connect to strategic priorities, speak executive language, and offer credible parallels. Weak responses lead with features, treat it as procurement, miss the customer context, or stay operational.

## SCORING (use the full 10-100 range)
- 90-100 Championship Caliber
- 75-89 Strong Contender
- 55-74 Building Momentum
- 35-54 Foundation Phase
- 10-34 Not a genuine attempt

## RULES
1. Default to the middle when unsure
2. Generic = 65 ceiling
3. Each criterion scored independently
4. At least 12 points of spread between highest and lowest
5. Quality over quantity
6. Score the thinking, not the grammar`;

  const buildCriteriaDetails = (criteria) =>
    criteria.map((c) => {
      let d = `- **${c.name}** (${c.weight}% weight): ${c.description}\n`;
      if (c.poor) d += `  POOR: ${c.poor}\n`;
      if (c.champion) d += `  CHAMPION: ${c.champion}`;
      return d;
    }).join("\n\n");

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

## TEAM'S INITIAL STRATEGY (context)
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

Evaluate the team's WOBBLE RESPONSE ONLY. Focus on how well they adapted to the curveball.

Respond in EXACT JSON (no other text before or after):
{
  "scores": {
    ${activeCriteria.map((c) => `"${c.name}": [10-100]`).join(",\n    ")}
  },
  "overallAssessment": "[2-3 sentences on how well they adapted, referencing what they wrote]",
  "strengths": ["[Specific strength 1]", "[Specific strength 2]"],
  "improvements": ["[Specific improvement 1]", "[Another]"],
  "coachChallenge": "[Thought-provoking question about pressure moments]"
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

  console.log("[score:app] Calling Claude...");
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
    console.log("[score:app] Claude responded");
  } catch (err) {
    console.error("[score:app] Claude failed:", err.message, "status:", err.status);
    return Response.json(
      { error: "Claude scoring failed", detail: err.message, status: err.status },
      { status: 502 }
    );
  }

  const aiText = response?.content?.[0]?.text || "";
  let aiResult;
  try {
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    aiResult = JSON.parse(jsonMatch[0]);
  } catch (e) {
    return Response.json({ error: "Failed to parse AI response" }, { status: 500 });
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

  console.log("[score:app] Success — overall:", overallScore);

  return Response.json({
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
