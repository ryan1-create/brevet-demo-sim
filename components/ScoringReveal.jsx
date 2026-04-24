"use client";

import { useEffect, useRef, useState } from "react";
import BrevetLoader from "./BrevetLoader";

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

const EVAL_PHASES_INITIAL = [
  "Reading your submission",
  "Applying the rubric",
  "Weighing the evidence",
  "Preparing coach feedback",
];

const EVAL_PHASES_WOBBLE = [
  "Reading your adaptation",
  "Testing against the curveball",
  "Scoring the re-read",
  "Preparing coach feedback",
];

function EvaluatingScreen({ phases }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % phases.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [phases]);

  return (
    <div className="evaluating">
      <BrevetLoader width={240} />
      <div className="eval-phase">
        {phases[idx]}
        <span className="dots">…</span>
      </div>
      <style jsx>{`
        .evaluating {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 48px;
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
        @keyframes dotsPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}

function ScoreBlock({ score, coaching, criteria, label, showChallenge = true, animate = true }) {
  const [rubricVisible, setRubricVisible] = useState(!animate);
  const [feedbackVisible, setFeedbackVisible] = useState(!animate);

  useEffect(() => {
    if (!animate) return;
    const t1 = setTimeout(() => setRubricVisible(true), 1800);
    const t2 = setTimeout(() => setFeedbackVisible(true), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [animate]);

  const criteriaEntries = Object.entries(score.criteria || {});
  const criteriaWeights = Object.fromEntries((criteria || []).map((c) => [c.name, c.weight]));

  return (
    <div className="score-block">
      {label && <div className="block-label">{label}</div>}
      <div className="interpretation-label">{coaching.scoreInterpretation}</div>
      <div className="overall-score">
        {animate ? <ScoreCountUp target={score.overall} /> : score.overall}
      </div>
      <div className="score-label">OUT OF 100</div>

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
                  <div className="crit-bar-fill" style={{ width: `${value}%` }} />
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
          {coaching.strengths?.length > 0 && (
            <div className="list-block">
              <div className="list-label">STRENGTHS</div>
              <ul>{coaching.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          )}
          {coaching.improvements?.length > 0 && (
            <div className="list-block">
              <div className="list-label">WHERE TO PUSH</div>
              <ul>{coaching.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          )}
          {showChallenge && coaching.coachChallenge && (
            <div className="challenge">
              <div className="list-label">COACH CHALLENGE</div>
              <p>{coaching.coachChallenge}</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .score-block {
          text-align: center;
          max-width: 820px;
          width: 100%;
          margin: 0 auto;
        }
        .block-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-bottom: 20px;
        }
        .interpretation-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
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
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
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
          grid-template-areas: "top score" "bar bar";
          gap: 8px 24px;
          align-items: center;
          opacity: 0;
          animation: fadeUp 400ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .crit-top { grid-area: top; display: flex; align-items: center; gap: 12px; }
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
        .list-block { margin-bottom: 24px; }
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
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

function WobblePrompt({ wobble, onSubmit, submitting }) {
  const type = wobble?.type || "text";

  // State per type
  const [textResponse, setTextResponse] = useState("");
  const [choiceId, setChoiceId] = useState(null);
  const [ranking, setRanking] = useState([]); // ordered list of option ids
  const [multiSelection, setMultiSelection] = useState([]);

  // Validation per type
  let canSubmit = false;
  let buildPayload = () => null;
  if (type === "text") {
    canSubmit = textResponse.trim().length >= 40 && !submitting;
    buildPayload = () => textResponse.trim();
  } else if (type === "choice") {
    canSubmit = !!choiceId && !submitting;
    buildPayload = () => choiceId;
  } else if (type === "ranking") {
    canSubmit = ranking.length === (wobble.options?.length || 0) && !submitting;
    buildPayload = () => ranking.join(",");
  } else if (type === "multi-select") {
    canSubmit = multiSelection.length === (wobble.maxSelections || 2) && !submitting;
    buildPayload = () => [...multiSelection].sort().join(",");
  }

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(buildPayload());
  };

  // Ranking handlers
  const unrankedOptions = (wobble.options || []).filter((o) => !ranking.includes(o.id));
  const addToRanking = (id) => setRanking((r) => [...r, id]);
  const removeFromRanking = (id) => setRanking((r) => r.filter((x) => x !== id));

  // Multi-select handlers
  const toggleMulti = (id) => {
    setMultiSelection((sel) => {
      if (sel.includes(id)) return sel.filter((x) => x !== id);
      if (sel.length >= (wobble.maxSelections || 2)) return sel;
      return [...sel, id];
    });
  };

  // Dynamic prompt + input label per type
  const promptText = wobble.prompt || wobble.question || "";

  return (
    <div className="wobble">
      <div className="wobble-banner">⚡ WOBBLE — A CURVEBALL HAS DROPPED</div>
      <h2 className="wobble-title">{wobble.title}</h2>
      <p className="wobble-desc">{wobble.description}</p>

      <div className="wobble-prompt-label">
        {type === "text" && "YOUR RESPONSE"}
        {type === "choice" && "CHOOSE ONE"}
        {type === "ranking" && "RANK IN ORDER"}
        {type === "multi-select" && `PICK ${wobble.maxSelections || 2}`}
      </div>
      <p className="wobble-prompt">{promptText}</p>

      {/* TEXT INPUT */}
      {type === "text" && (
        <>
          <textarea
            className="wobble-input"
            placeholder="Your adaptation goes here. Be specific."
            value={textResponse}
            onChange={(e) => setTextResponse(e.target.value)}
            disabled={submitting}
          />
          <div className="wobble-sub">
            <span className="wobble-meta">
              {textResponse.trim().split(/\s+/).filter(Boolean).length} WORDS
            </span>
          </div>
        </>
      )}

      {/* CHOICE INPUT */}
      {type === "choice" && (
        <div className="options">
          {wobble.options.map((opt) => {
            const selected = choiceId === opt.id;
            return (
              <button
                key={opt.id}
                className={`option-card ${selected ? "selected" : ""}`}
                onClick={() => setChoiceId(opt.id)}
                type="button"
                disabled={submitting}
              >
                <div className={`option-indicator ${selected ? "filled" : ""}`}>
                  {selected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.5 L5 9 L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="option-body">
                  <div className="option-letter">{opt.id}</div>
                  <div className="option-text">{opt.text}</div>
                  <div className="option-detail">{opt.detail}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* RANKING INPUT */}
      {type === "ranking" && (
        <div className="ranking-wrap">
          {unrankedOptions.length > 0 && (
            <div className="ranking-pool">
              <div className="ranking-section-label">CLICK TO ADD TO YOUR RANKING</div>
              {unrankedOptions.map((opt) => (
                <button
                  key={opt.id}
                  className="ranking-pool-item"
                  onClick={() => addToRanking(opt.id)}
                  type="button"
                  disabled={submitting}
                >
                  <div className="option-letter small">{opt.id}</div>
                  <div className="option-body-inline">
                    <div className="option-text">{opt.text}</div>
                    <div className="option-detail">{opt.detail}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {ranking.length > 0 && (
            <div className="ranking-list">
              <div className="ranking-section-label">YOUR RANKING</div>
              {ranking.map((id, idx) => {
                const opt = wobble.options.find((o) => o.id === id);
                return (
                  <div key={id} className="ranking-item">
                    <div className="ranking-rank">{idx + 1}</div>
                    <div className="option-body-inline">
                      <div className="option-text">{opt.text}</div>
                      <div className="option-detail">{opt.detail}</div>
                    </div>
                    <button
                      className="ranking-remove"
                      onClick={() => removeFromRanking(id)}
                      type="button"
                      aria-label="Remove"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MULTI-SELECT INPUT */}
      {type === "multi-select" && (
        <div className="options">
          {wobble.options.map((opt) => {
            const selected = multiSelection.includes(opt.id);
            const atCap =
              multiSelection.length >= (wobble.maxSelections || 2) && !selected;
            return (
              <button
                key={opt.id}
                className={`option-card ${selected ? "selected" : ""} ${atCap ? "disabled" : ""}`}
                onClick={() => !atCap && toggleMulti(opt.id)}
                type="button"
                disabled={submitting || atCap}
              >
                <div className={`option-indicator square ${selected ? "filled" : ""}`}>
                  {selected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.5 L5 9 L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="option-body">
                  <div className="option-letter">{opt.id}</div>
                  <div className="option-text">{opt.text}</div>
                  <div className="option-detail">{opt.detail}</div>
                </div>
              </button>
            );
          })}
          <div className="wobble-sub">
            <span className="wobble-meta">
              {multiSelection.length} OF {wobble.maxSelections || 2} SELECTED
            </span>
          </div>
        </div>
      )}

      <div className="wobble-actions">
        <button
          className={`submit-btn ${canSubmit ? "ready" : ""}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {submitting ? "EVALUATING…" : "SUBMIT WOBBLE RESPONSE →"}
        </button>
      </div>

      <style jsx>{`
        .wobble {
          max-width: 820px;
          width: 100%;
          margin: 0 auto;
          animation: fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .wobble-banner {
          display: inline-block;
          background: rgba(232, 93, 46, 0.15);
          border: 1px solid var(--accent);
          color: var(--accent);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 999px;
          margin-bottom: 24px;
        }
        .wobble-title {
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 44px;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin-bottom: 16px;
        }
        .wobble-desc {
          font-size: 17px;
          line-height: 1.55;
          color: var(--ink-2);
          margin-bottom: 40px;
          max-width: 720px;
        }
        .wobble-prompt-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-bottom: 8px;
        }
        .wobble-prompt {
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 22px;
          letter-spacing: -0.01em;
          color: var(--ink);
          margin-bottom: 24px;
        }

        /* Text input */
        .wobble-input {
          width: 100%;
          min-height: 180px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          font-family: "Inter", sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: var(--ink);
          resize: vertical;
          outline: none;
          transition: border-color 150ms;
        }
        .wobble-input:focus {
          border-color: var(--accent);
        }
        .wobble-input::placeholder {
          color: var(--ink-3);
        }
        .wobble-sub {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
        }
        .wobble-meta {
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: var(--ink-3);
        }

        /* Options (choice + multi-select) */
        .options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .option-card {
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 16px;
          align-items: flex-start;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 18px;
          cursor: pointer;
          text-align: left;
          font: inherit;
          color: var(--ink);
          transition: background 150ms, border-color 150ms, transform 120ms;
        }
        .option-card:not(.disabled):hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.22);
        }
        .option-card.selected {
          background: rgba(232, 93, 46, 0.1);
          border-color: var(--accent);
        }
        .option-card.disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .option-indicator {
          width: 24px;
          height: 24px;
          border-radius: 999px;
          border: 1.5px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
          transition: background 150ms, border-color 150ms;
        }
        .option-indicator.square {
          border-radius: 6px;
        }
        .option-indicator.filled {
          background: var(--accent);
          border-color: var(--accent);
        }
        .option-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .option-letter {
          font-family: "JetBrains Mono", monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: var(--ink-3);
        }
        .option-letter.small {
          font-size: 11px;
        }
        .option-text {
          font-family: "Inter Tight", sans-serif;
          font-weight: 600;
          font-size: 16px;
          letter-spacing: -0.01em;
          color: var(--ink);
        }
        .option-detail {
          font-size: 14px;
          color: var(--ink-2);
          line-height: 1.4;
          margin-top: 2px;
        }

        /* Ranking */
        .ranking-wrap {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .ranking-section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-bottom: 12px;
        }
        .ranking-pool {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ranking-pool-item {
          display: grid;
          grid-template-columns: 24px 1fr;
          gap: 14px;
          align-items: flex-start;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px 16px;
          cursor: pointer;
          text-align: left;
          font: inherit;
          color: var(--ink);
          transition: all 150ms;
        }
        .ranking-pool-item:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.22);
          transform: translateX(2px);
        }
        .ranking-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ranking-item {
          display: grid;
          grid-template-columns: 40px 1fr 32px;
          align-items: center;
          gap: 14px;
          background: rgba(232, 93, 46, 0.08);
          border: 1px solid rgba(232, 93, 46, 0.3);
          border-radius: 10px;
          padding: 14px 16px;
          animation: rankIn 250ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ranking-rank {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: var(--accent);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "JetBrains Mono", monospace;
          font-size: 14px;
          font-weight: 500;
        }
        .ranking-remove {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: transparent;
          border: none;
          color: var(--ink-3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 150ms, color 150ms;
        }
        .ranking-remove:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--ink);
        }
        .option-body-inline {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        @keyframes rankIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .wobble-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 28px;
        }
        .submit-btn {
          background: rgba(255, 255, 255, 0.08);
          color: var(--ink-3);
          border: none;
          border-radius: 12px;
          padding: 14px 28px;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: not-allowed;
          transition: all 200ms;
        }
        .submit-btn.ready {
          background: var(--accent);
          color: #fff;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(232, 93, 46, 0.3);
        }
        .submit-btn.ready:hover {
          background: var(--accent-deep);
          transform: translateY(-2px);
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default function ScoringReveal({
  scenario,
  submission,
  onContinue,
  onRestart,
  currentRound = 1,
  isLastRound = false,
}) {
  // Phase state machine:
  // "evaluating-initial" → "revealed-initial" → "wobble-prompt" → "evaluating-wobble" → "revealed-final" → continue
  const [phase, setPhase] = useState("evaluating-initial");
  const [initialResult, setInitialResult] = useState(null);
  const [wobbleResult, setWobbleResult] = useState(null);
  const [wobbleResponse, setWobbleResponse] = useState("");
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const motion = scenario?.motion;
  const hasWobble = !!motion?.wobble;

  // Initial scoring API call
  useEffect(() => {
    if (phase !== "evaluating-initial") return;
    let cancelled = false;
    async function score() {
      try {
        const res = await fetch("/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submission, scenario, phase: "initial" }),
        });
        if (!res.ok) throw new Error(`Scoring failed: ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setInitialResult(data);
        setPhase("revealed-initial");
      } catch (err) {
        if (cancelled) return;
        setError(err.message || "Something went wrong.");
        setPhase("error");
      }
    }
    score();
    return () => { cancelled = true; };
  }, [phase, scenario, submission]);

  // Wobble scoring API call
  useEffect(() => {
    if (phase !== "evaluating-wobble") return;
    let cancelled = false;
    async function score() {
      try {
        const res = await fetch("/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submission,
            scenario,
            phase: "wobble",
            wobbleResponse,
          }),
        });
        if (!res.ok) throw new Error(`Wobble scoring failed: ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setWobbleResult(data);
        setPhase("revealed-final");
      } catch (err) {
        if (cancelled) return;
        setError(err.message || "Something went wrong on the wobble.");
        setPhase("error");
      }
    }
    score();
    return () => { cancelled = true; };
  }, [phase, scenario, submission, wobbleResponse]);

  // Compute combined round score (70% initial, 30% wobble)
  const computeRoundScore = () => {
    const initial = initialResult?.score?.overall || 0;
    const wobble = wobbleResult?.score?.overall || 0;
    if (!wobbleResult) return initial;
    return Math.round(initial * 0.7 + wobble * 0.3);
  };

  const handleContinueToWobble = () => {
    setPhase("wobble-prompt");
    // Scroll to top for the new view
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleWobbleSubmit = (response) => {
    setWobbleResponse(response);
    setPhase("evaluating-wobble");
  };

  const handleFinalContinue = () => {
    onContinue(computeRoundScore());
  };

  return (
    <div className="page" ref={scrollRef}>
      {phase === "evaluating-initial" && <EvaluatingScreen phases={EVAL_PHASES_INITIAL} />}
      {phase === "evaluating-wobble" && <EvaluatingScreen phases={EVAL_PHASES_WOBBLE} />}

      {phase === "error" && (
        <div className="error">
          <div className="error-heading">Something went wrong.</div>
          <div className="error-body">{error}</div>
          <button
            className="retry-btn"
            onClick={() => {
              setError(null);
              setPhase(wobbleResult ? "revealed-final" : initialResult ? "wobble-prompt" : "evaluating-initial");
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {phase === "revealed-initial" && initialResult && (
        <div className="revealed">
          <ScoreBlock
            score={initialResult.score}
            coaching={initialResult.coaching}
            criteria={motion.scoringCriteria}
            label="INITIAL STRATEGY"
          />
          <div className="actions">
            <button className="ghost-btn" onClick={onRestart}>
              Start Over
            </button>
            {hasWobble ? (
              <button className="primary-btn" onClick={handleContinueToWobble}>
                Continue to Wobble →
              </button>
            ) : (
              <button className="primary-btn" onClick={handleFinalContinue}>
                {isLastRound ? "View Final Score →" : `Continue to Round ${currentRound + 1} →`}
              </button>
            )}
          </div>
        </div>
      )}

      {phase === "wobble-prompt" && motion?.wobble && (
        <WobblePrompt wobble={motion.wobble} onSubmit={handleWobbleSubmit} submitting={false} />
      )}

      {phase === "revealed-final" && initialResult && wobbleResult && (
        <div className="revealed">
          <ScoreBlock
            score={wobbleResult.score}
            coaching={wobbleResult.coaching}
            criteria={
              motion.wobble?.scoringCriteria ||
              Object.keys(wobbleResult.score?.criteria || {}).map((name) => ({
                name,
                weight: 100,
              }))
            }
            label="WOBBLE — YOUR ADAPTATION"
          />

          <div className="combined-score">
            <div className="combined-label">COMBINED ROUND SCORE</div>
            <div className="combined-breakdown">
              <div className="breakdown-item">
                <div className="bd-num">{initialResult.score.overall}</div>
                <div className="bd-label">INITIAL · 70%</div>
              </div>
              <div className="bd-op">+</div>
              <div className="breakdown-item">
                <div className="bd-num">{wobbleResult.score.overall}</div>
                <div className="bd-label">WOBBLE · 30%</div>
              </div>
              <div className="bd-op">=</div>
              <div className="breakdown-item primary">
                <div className="bd-num"><ScoreCountUp target={computeRoundScore()} duration={1200} /></div>
                <div className="bd-label">ROUND {String(currentRound).padStart(2, "0")}</div>
              </div>
            </div>
          </div>

          <div className="actions">
            <button className="ghost-btn" onClick={onRestart}>
              Start Over
            </button>
            <button className="primary-btn" onClick={handleFinalContinue}>
              {isLastRound ? "View Final Score →" : `Continue to Round ${currentRound + 1} →`}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .page {
          --canvas: #1A2C36;
          --canvas-deep: #13222B;
          --surface: rgba(255,255,255,0.05);
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

        .revealed {
          max-width: 820px;
          width: 100%;
          padding: 32px 0;
          animation: fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .combined-score {
          margin-top: 48px;
          padding: 32px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          border-radius: 16px;
          text-align: center;
          animation: fadeUp 500ms cubic-bezier(0.22, 1, 0.36, 1) 400ms both;
        }
        .combined-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-bottom: 24px;
        }
        .combined-breakdown {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .breakdown-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          min-width: 100px;
        }
        .breakdown-item.primary .bd-num {
          color: var(--accent);
          font-size: 64px;
        }
        .bd-num {
          font-family: "JetBrains Mono", monospace;
          font-weight: 500;
          font-size: 36px;
          line-height: 1;
          color: var(--ink);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }
        .bd-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .bd-op {
          font-family: "JetBrains Mono", monospace;
          font-weight: 500;
          font-size: 28px;
          color: var(--ink-3);
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

        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
