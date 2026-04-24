// Brevet Sales Simulation — AI Scoring Endpoint (App Router)
// Route: POST /api/score

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 25_000, // 25s — fail fast instead of hanging
  maxRetries: 1,
});

export const runtime = "nodejs";
export const maxDuration = 60;

function addJitter(baseDelay, jitterPercent = 0.3) {
  const jitter = baseDelay * jitterPercent * (Math.random() - 0.5) * 2;
  return Math.max(100, baseDelay + jitter);
}

async function callWithRetry(fn, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isRateLimit = error.status === 429;
      const isOverloaded = error.status === 529;
      const isTimeout = error.code === "ETIMEDOUT";
      if ((isRateLimit || isOverloaded || isTimeout) && attempt < maxRetries) {
        const baseDelay = Math.min(Math.pow(2, attempt + 1) * 1000, 5000);
        await new Promise((resolve) => setTimeout(resolve, addJitter(baseDelay)));
      } else {
        throw error;
      }
    }
  }
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
  if (/^(lorem ipsum|placeholder|sample text)/i.test(teamContent)) return { quality: "garbage", score: 10, skipAI: true };
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
        "Think like a trusted advisor, not a vendor. The CEO wants a business case, not a pitch.",
        "Ground every recommendation in THIS customer's context, not in generic frameworks.",
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

export async function POST(req) {
  try {
    const { submission, scenario } = await req.json();

    if (!submission || !scenario) {
      return Response.json({ error: "Missing submission or scenario data" }, { status: 400 });
    }

    const qualityResult = assessSubmissionQuality(submission);
    if (qualityResult.skipAI) {
      return Response.json(generateGarbageScore(scenario.motion.scoringCriteria, qualityResult));
    }

    const systemPrompt = `You are an elite sales coach at Brevet, a consulting firm that teaches Business Value Selling. You have 25+ years of experience training sellers to engage business buyers — not procurement, not champions below the decision line, but the actual executives who make budget decisions.

You are evaluating a team's response to a live sales simulation. Your role is to read their work like a real coach — form a genuine impression, give honest differentiated feedback, and ground everything in Brevet's methodology.

## BREVET'S CORE METHODOLOGY

Legacy Displacement is not about responding to an RFP. It is about creating the buying decision by making the cost of the status quo unavoidable. Great responses will:
- Quantify or vividly articulate what the current approach is costing the business
- Connect the proposed change to the customer's stated strategic priorities
- Speak in the language of the boardroom — margin, risk, revenue, competitive position
- Provide credible parallels from comparable companies

Weak responses will:
- Lead with product features
- Treat the scenario as a procurement exercise
- Miss the customer's specific context and stakeholders
- Stay at the operational layer instead of the business layer

## YOUR COACHING VOICE
- Direct and honest — don't sugarcoat, but acknowledge good thinking when you see it
- Sound like a real senior consultant, not an algorithm
- Reference specific things the team wrote — never generic feedback
- When something is weak, say WHY it's weak and what good would look like
- When something is strong, call out exactly what made it strong

## SCORING CALIBRATION — USE THE FULL RANGE

### 90-100: CHAMPIONSHIP CALIBER (rare — top 5%)
Response would impress a CRO. Demonstrates ALL of:
- Specific references to the customer's situation (names, roles, stakes, stated priorities from the scenario)
- Business outcome framing throughout
- Strategic clarity — reads like advice from a trusted board advisor
- Clear actionable recommendations grounded in this customer's context

### 75-89: STRONG CONTENDER (top 25%)
Solid strategic thinking with customer specificity. Understands the dynamics.
- References this customer's actual situation
- Connects to stated strategic priorities and timing
- Provides grounded recommendations
- May use directional language instead of exact figures — that's fine

### 55-74: BUILDING MOMENTUM (where most responses land)
Directionally correct but generic. Hallmark: could be copy-pasted to a different customer.
- Right general ideas but no customer-specific detail
- Buzzwords without grounding
- Vague recommendations

### 35-54: FOUNDATION PHASE (below average)
Misses the point or stays surface-level.

### 10-34: NEEDS DEVELOPMENT
Not a genuine attempt.

## CRITICAL RULES

1. Default to the middle. When unsure, go lower. Teams must earn their way above 70.
2. Generic = 65 ceiling. If the response could apply to any customer, cap that criterion at 65.
3. Each criterion is independent.
4. Variance is required — at least 12 points of spread between highest and lowest criterion.
5. Quality over quantity.
6. Read between the lines. Score the thinking, not the grammar.
7. Directional language is OK — don't penalize lack of external data the team couldn't look up.`;

    const buildCriteriaDetails = (criteria) => {
      return criteria.map((c) => {
        let detail = `- **${c.name}** (${c.weight}% weight)\n  What this measures: ${c.description}\n`;
        if (c.poor) detail += `  POOR (35-50): ${c.poor}\n`;
        if (c.champion) detail += `  CHAMPION (85-100): ${c.champion}`;
        return detail;
      }).join("\n\n");
    };

    const buildPenaltiesSection = (penalties) => {
      if (!penalties || penalties.length === 0) return "";
      return `\n### SCORING PENALTIES (3-point reduction each, max 2 per round)\n${penalties.map((p) => `- ${p}`).join("\n")}\n`;
    };

    const scoringPrompt = `## SCENARIO: ${scenario.client.name}
**Industry:** ${scenario.client.industry} | **Motion:** ${scenario.motion.name}
**Size:** ${scenario.client.size} | **Revenue:** ${scenario.client.revenue}
**Current Solution:** ${scenario.client.currentSolution}

### Situation
${scenario.subtitle}

### Context
${scenario.context.map((c) => `- ${c}`).join("\n")}

### Stakeholders
${scenario.personas.map((p) =>
  `- ${p.role} — ${p.name}: ${p.tagline}\n  Fears: ${p.fears}\n  Wants: ${p.wants}\n  Levers: ${p.levers}`
).join("\n")}

### Mission
${scenario.mission}

### SCORING RUBRIC
${buildCriteriaDetails(scenario.motion.scoringCriteria)}
${buildPenaltiesSection(scenario.motion.penalties)}

---

## TEAM'S SUBMISSION

${submission}

---

## YOUR EVALUATION TASK

Read the submission carefully. Then:

1. First impression: Is this a genuine attempt?
2. For each criterion: Compare against Poor and Champion benchmarks.
3. Check for penalties — apply 3-point reduction each, max 2.
4. Differentiation required — at least 12 points of spread.
5. Write feedback like a real coach — reference specific things they said.

Respond in EXACT JSON (no other text):
{
  "scores": {
    ${scenario.motion.scoringCriteria.map((c) => `"${c.name}": [score 10-100]`).join(",\n    ")}
  },
  "penaltiesApplied": ["[List triggered, or empty array]"],
  "overallAssessment": "[2-3 sentences referencing specifics they wrote]",
  "strengths": ["[Specific strength 1]", "[Specific strength 2]"],
  "improvements": ["[Specific improvement 1]", "[Another]", "[Third]"],
  "coachChallenge": "[Thought-provoking question tied to their specific gaps]"
}`;

    console.log("Scoring request received for client:", scenario.client?.name);

    let response;
    try {
      response = await anthropic.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 2500,
        temperature: 0.3,
        messages: [{ role: "user", content: scoringPrompt }],
        system: systemPrompt,
      });
    } catch (apiError) {
      console.error("Anthropic API error:", apiError?.message || apiError);
      console.error("Error status:", apiError?.status);
      console.error("Error type:", apiError?.type);
      return Response.json(
        {
          error: "Claude scoring failed",
          detail: apiError?.message || "Unknown error",
          status: apiError?.status,
        },
        { status: 500 }
      );
    }

    console.log("Claude response received, length:", response?.content?.[0]?.text?.length);
    const aiText = response.content[0].text;
    let aiResult;
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      aiResult = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      return Response.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    aiResult.scores = validateAndAdjustScores(aiResult.scores);

    let totalScore = 0;
    let totalWeight = 0;
    scenario.motion.scoringCriteria.forEach((criterion) => {
      const score = aiResult.scores[criterion.name] || 40;
      totalScore += score * criterion.weight;
      totalWeight += criterion.weight;
    });
    let overallScore = Math.round(totalScore / totalWeight);

    const penaltiesApplied = (aiResult.penaltiesApplied || []).filter(
      (p) => p && p !== "None" && !p.startsWith("[")
    );
    const cappedPenalties = penaltiesApplied.slice(0, 2);
    if (cappedPenalties.length > 0) {
      overallScore = Math.max(10, overallScore - cappedPenalties.length * 3);
    }

    let scoreInterpretation;
    if (overallScore >= 90) scoreInterpretation = "Championship Caliber";
    else if (overallScore >= 75) scoreInterpretation = "Strong Contender";
    else if (overallScore >= 55) scoreInterpretation = "Building Momentum";
    else if (overallScore >= 35) scoreInterpretation = "Foundation Phase";
    else scoreInterpretation = "Needs Development";

    return Response.json({
      score: {
        overall: overallScore,
        criteria: aiResult.scores,
        timestamp: new Date().toISOString(),
      },
      coaching: {
        tone:
          overallScore >= 90 ? "excellent" :
          overallScore >= 75 ? "good" :
          overallScore >= 55 ? "developing" :
          "needs_work",
        mainFeedback: aiResult.overallAssessment,
        strengths: aiResult.strengths,
        improvements: aiResult.improvements,
        coachChallenge: aiResult.coachChallenge,
        scoreInterpretation,
        penaltiesApplied: cappedPenalties.length > 0 ? cappedPenalties : undefined,
      },
    });
  } catch (error) {
    console.error("Scoring error:", error);
    return Response.json(
      { error: "Failed to process submission. Please try again.", retryable: true },
      { status: 500 }
    );
  }
}
