"use client";

import { useEffect, useState } from "react";

// Count-up for the overall score
function ScoreCountUp({ target, duration = 1500 }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return <>{value}</>;
}

const EVALUATION_PHASES = [
  "Reading your submission",
  "Scoring value gaps",
  "Scoring art of the possible",
  "Scoring impact",
  "Scoring customer story",
  "Preparing coach feedback",
];

export default function ScoringReveal({
  scenario,
  submission,
  onContinue,
  onRestart,
  currentRound = 1,
  isLastRound = false,
}) {
  const [phase, setPhase] = useState("evaluating"); // "evaluating" | "revealed" | "error"
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [evalPhaseIndex, setEvalPhaseIndex] = useState(0);

  // Cycle evaluation phase labels
  useEffect(() => {
    if (phase !== "evaluating") return;
    const interval = setInterval(() => {
      setEvalPhaseIndex((i) => (i + 1) % EVALUATION_PHASES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [phase]);

  // Call the scoring API
  useEffect(() => {
    if (phase !== "evaluating") return;
    let cancelled = false;

    async function score() {
      try {
        const res = await fetch("/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submission, scenario }),
        });
        if (!res.ok) throw new Error(`Scoring failed: ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setResult(data);
        setPhase("revealed");
      } catch (err) {
        if (cancelled) return;
        setError(err.message || "Something went wrong.");
        setPhase("error");
      }
    }
    score();
    return () => {
      cancelled = true;
    };
  }, [phase, scenario, submission]);

  return (
    <div className="page dark">
      {phase === "evaluating" && (
        <div className="evaluating">
          <div className="loader-wrap">
            <div className="loader" />
          </div>
          <div className="eval-phase">
            {EVALUATION_PHASES[evalPhaseIndex]}
            <span className="dots">…</span>
          </div>
        </div>
      )}

      {phase === "error" && (
        <div className="error">
          <div className="error-heading">Something went wrong.</div>
          <div className="error-body">{error}</div>
          <button className="retry-btn" onClick={() => setPhase("evaluating")}>
            Try Again
          </button>
        </div>
      )}

      {phase === "revealed" && result && (
        <Revealed
          result={result}
          scenario={scenario}
          onContinue={() => onContinue(result.score?.overall || 0)}
          onRestart={onRestart}
          currentRound={currentRound}
          isLastRound={isLastRound}
        />
      )}

      <style jsx>{`
        .page {
          --canvas: #1A2C36;
          --canvas-deep: #13222B;
          --surface: rgba(255,255,255,0.05);
          --surface-2: rgba(255,255,255,0.08);
          --ink: #F4F1EC;
          --ink-2: rgba(244,241,236,0.72);
          --ink-3: rgba(244,241,236,0.48);
          --border: rgba(255,255,255,0.12);
          --accent: #E85D2E;
          --accent-deep: #FF7A4E;

          min-height: 100vh;
          width: 100%;
          background: var(--canvas);
          color: var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
        }

        /* ============ Evaluating ============ */
        .evaluating {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 48px;
        }
        .loader-wrap {
          width: 80px;
          height: 80px;
          position: relative;
        }
        .loader {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-top-color: var(--accent);
          border-right-color: var(--accent);
          animation: spin 1.2s linear infinite;
        }
        .eval-phase {
          font-family: "JetBrains Mono", monospace;
          font-size: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-2);
          min-height: 1.5em;
        }
        .dots {
          display: inline-block;
          margin-left: 4px;
          animation: dotsPulse 1.4s ease-in-out infinite;
        }

        /* ============ Error ============ */
        .error {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          max-width: 480px;
        }
        .error-heading {
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 28px;
          color: var(--ink);
        }
        .error-body {
          font-size: 15px;
          color: var(--ink-2);
          line-height: 1.5;
        }
        .retry-btn {
          margin-top: 16px;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 12px 28px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 200ms, transform 150ms;
        }
        .retry-btn:hover {
          background: var(--accent-deep);
          transform: translateY(-2px);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes dotsPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

function Revealed({ result, scenario, onContinue, onRestart, currentRound, isLastRound }) {
  const { score, coaching } = result;
  const [rubricVisible, setRubricVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setRubricVisible(true), 1800);
    const t2 = setTimeout(() => setFeedbackVisible(true), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const criteriaEntries = Object.entries(score.criteria || {});
  const criteriaWeights = Object.fromEntries(
    (scenario.motion.scoringCriteria || []).map((c) => [c.name, c.weight])
  );

  return (
    <div className="revealed">
      <div className="label interpretation">{coaching.scoreInterpretation}</div>
      <div className="overall-score">
        <ScoreCountUp target={score.overall} />
      </div>
      <div className="label score-label">OUT OF 100</div>

      {rubricVisible && (
        <div className="rubric">
          {criteriaEntries.map(([name, value], i) => {
            const weight = criteriaWeights[name] || 0;
            return (
              <div className="criterion" key={name} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="crit-top">
                  <div className="crit-name">{name}</div>
                  <div className="crit-weight">{weight}% WEIGHT</div>
                </div>
                <div className="crit-bar-track">
                  <div
                    className="crit-bar-fill"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <div className="crit-score">{value}</div>
              </div>
            );
          })}
        </div>
      )}

      {feedbackVisible && (
        <div className="feedback">
          <div className="feedback-block">
            <p className="main-feedback">{coaching.mainFeedback}</p>
          </div>
          {coaching.strengths && coaching.strengths.length > 0 && (
            <div className="list-block">
              <div className="list-label">STRENGTHS</div>
              <ul>
                {coaching.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {coaching.improvements && coaching.improvements.length > 0 && (
            <div className="list-block">
              <div className="list-label">WHERE TO PUSH</div>
              <ul>
                {coaching.improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {coaching.coachChallenge && (
            <div className="challenge">
              <div className="list-label">COACH CHALLENGE</div>
              <p>{coaching.coachChallenge}</p>
            </div>
          )}

          <div className="actions">
            <button className="ghost-btn" onClick={onRestart}>
              Start Over
            </button>
            <button className="primary-btn" onClick={onContinue}>
              {isLastRound ? "View Final Score →" : `Continue to Round ${currentRound + 1} →`}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .revealed {
          max-width: 820px;
          width: 100%;
          text-align: center;
          padding: 32px 0;
          animation: fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .interpretation {
          color: var(--accent);
          margin-bottom: 16px;
        }
        .overall-score {
          font-family: "JetBrains Mono", monospace;
          font-weight: 500;
          font-size: 180px;
          line-height: 1;
          color: var(--ink);
          letter-spacing: -0.04em;
          margin-bottom: 8px;
          font-variant-numeric: tabular-nums;
        }
        .score-label {
          color: var(--ink-3);
          margin-bottom: 48px;
        }

        .rubric {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 640px;
          margin: 0 auto 48px;
          text-align: left;
        }
        .criterion {
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-rows: auto auto;
          grid-template-areas:
            "top score"
            "bar bar";
          gap: 8px 24px;
          align-items: center;
          opacity: 0;
          animation: fadeUp 400ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .crit-top {
          grid-area: top;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .crit-name {
          font-family: "Inter Tight", sans-serif;
          font-weight: 600;
          font-size: 15px;
          color: var(--ink);
          letter-spacing: -0.01em;
        }
        .crit-weight {
          font-family: "JetBrains Mono", monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: var(--ink-3);
        }
        .crit-bar-track {
          grid-area: bar;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          overflow: hidden;
        }
        .crit-bar-fill {
          height: 100%;
          background: var(--accent);
          border-radius: 999px;
          transition: width 900ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .crit-score {
          grid-area: score;
          font-family: "JetBrains Mono", monospace;
          font-weight: 500;
          font-size: 20px;
          color: var(--ink);
          font-variant-numeric: tabular-nums;
        }

        .feedback {
          text-align: left;
          max-width: 680px;
          margin: 0 auto;
          animation: fadeUp 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .feedback-block {
          border-left: 2px solid var(--accent);
          padding: 16px 20px;
          margin-bottom: 32px;
          background: rgba(232, 93, 46, 0.05);
          border-radius: 0 8px 8px 0;
        }
        .main-feedback {
          font-size: 18px;
          line-height: 1.6;
          color: var(--ink);
          font-style: italic;
        }
        .list-block {
          margin-bottom: 24px;
        }
        .list-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-bottom: 12px;
        }
        .list-block ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .list-block li {
          font-size: 15px;
          line-height: 1.5;
          color: var(--ink-2);
          padding-left: 20px;
          position: relative;
        }
        .list-block li::before {
          content: "—";
          position: absolute;
          left: 0;
          color: var(--ink-3);
        }
        .challenge {
          margin: 32px 0;
          padding: 20px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
        }
        .challenge p {
          font-size: 16px;
          line-height: 1.5;
          color: var(--ink);
          margin-top: 8px;
        }

        .actions {
          margin-top: 40px;
          display: flex;
          gap: 16px;
          justify-content: center;
          padding-bottom: 32px;
        }
        .ghost-btn {
          background: transparent;
          color: var(--ink-2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 150ms;
        }
        .ghost-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: var(--ink);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .primary-btn {
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 12px 28px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 200ms;
          box-shadow: 0 4px 14px rgba(232, 93, 46, 0.3);
        }
        .primary-btn:hover {
          background: var(--accent-deep);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(232, 93, 46, 0.4);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
