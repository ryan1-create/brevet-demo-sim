"use client";

import { useState, useEffect, useMemo } from "react";
import NavBar from "./NavBar";

// =============================================================================
// OPPORTUNITY / CHALLENGE PANEL — shown at the top of every challenge
// =============================================================================
function OpportunityPanel({ mission, challenge, dotColor }) {
  return (
    <section className="opp-panel">
      <div className="opp-title">
        <span className="opp-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke={dotColor || "#2D4A5B"} strokeWidth="1.5" />
            <circle cx="8" cy="8" r="3.5" stroke={dotColor || "#2D4A5B"} strokeWidth="1.5" />
            <circle cx="8" cy="8" r="1" fill={dotColor || "#2D4A5B"} />
          </svg>
        </span>
        <span>Our Opportunity</span>
      </div>
      <p className="opp-body">{mission}</p>
      <div className="opp-divider" />
      <div className="opp-challenge-label">THE CHALLENGE</div>
      <p className="opp-challenge">{challenge}</p>
      <style jsx>{`
        .opp-panel {
          margin: 24px 32px 0;
          padding: 24px 32px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: var(--elevation-1);
        }
        .opp-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 20px;
          letter-spacing: -0.01em;
          color: var(--ink);
          margin-bottom: 12px;
        }
        .opp-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .opp-body {
          font-size: 15px;
          line-height: 1.6;
          color: var(--ink-2);
          margin-bottom: 16px;
        }
        .opp-divider {
          height: 1px;
          background: var(--border);
          margin-bottom: 16px;
        }
        .opp-challenge-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-bottom: 6px;
        }
        .opp-challenge {
          font-family: "Inter Tight", sans-serif;
          font-weight: 600;
          font-size: 16px;
          color: var(--ink);
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// LAYOUT 1 — THREE-COL + FULL-WIDTH (Round 1 default)
// =============================================================================
function ThreeColLayout({ cards, responses, setResponse, focused, setFocused, dotColor }) {
  const topCards = cards.slice(0, 3);
  const bottomCard = cards[3];

  const renderCard = (card, idx, fullWidth = false) => {
    const value = responses[`card_${idx}`] || "";
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
    const isFocused = focused === `card_${idx}`;
    return (
      <div
        key={card.number}
        className={`card ${isFocused ? "focused" : ""} ${fullWidth ? "full" : ""}`}
      >
        <div className="card-header">
          <div className="card-label">
            <span className="dot" style={{ background: dotColor }} />
            <span>{card.number} · {card.name}</span>
          </div>
          <div className="word-count">{wordCount} WORDS</div>
        </div>
        <h3 className="card-heading">{card.heading}</h3>
        <p className="card-prompt">{card.prompt}</p>
        <textarea
          className="card-textarea"
          placeholder="Start typing. Your team's response goes here."
          value={value}
          onChange={(e) => setResponse(`card_${idx}`, e.target.value)}
          onFocus={() => setFocused(`card_${idx}`)}
          onBlur={() => setFocused(null)}
        />
      </div>
    );
  };

  return (
    <div className="three-col">
      <div className="top-row">
        {topCards.map((card, i) => renderCard(card, i, false))}
      </div>
      {bottomCard && renderCard(bottomCard, 3, true)}
      <style jsx>{`
        .three-col {
          padding: 24px 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .top-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: var(--elevation-1);
          padding: 24px;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          transition: border-color 150ms, box-shadow 150ms, transform 200ms;
          overflow: hidden;
        }
        .card.full { height: 240px; }
        .card.focused {
          border-color: var(--ink);
          box-shadow: var(--elevation-2);
          transform: translateY(-1px);
        }
        .card.focused::before {
          content: "";
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: var(--accent);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .card-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .dot {
          width: 6px; height: 6px;
          border-radius: 999px;
        }
        .word-count {
          font-family: "JetBrains Mono", monospace;
          font-weight: 500;
          font-size: 11px;
          color: var(--ink-3);
          letter-spacing: 0.04em;
        }
        .card-heading {
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 22px;
          line-height: 1.15;
          letter-spacing: -0.015em;
          color: var(--ink);
          margin-bottom: 8px;
        }
        .card-prompt {
          font-size: 13px;
          font-style: italic;
          color: var(--ink-2);
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .card-textarea {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: "Inter", sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: var(--ink);
          resize: none;
          padding: 0;
        }
        .card-textarea::placeholder {
          color: var(--ink-3);
          opacity: 0.7;
        }
        .card-textarea::selection {
          background: var(--accent-soft);
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// LAYOUT 2 — BIAS TABLE (Round 2)
// =============================================================================
function BiasTableLayout({ biases, optionalBias, responses, setResponse, dotColor }) {
  return (
    <div className="bias-wrap">
      <div className="bias-table">
        <div className="bias-header">
          <div className="col col-h">Status Quo Bias</div>
          <div className="col col-h">Unconsidered Risks</div>
          <div className="col col-h">Evidence / Diagnostic Action</div>
        </div>
        {biases.map((bias, i) => (
          <div className={`bias-row ${i % 2 === 0 ? "even" : "odd"}`} key={bias.id}>
            <div className="col col-bias">&ldquo;{bias.statement}&rdquo;</div>
            <div className="col col-input">
              <textarea
                placeholder="Hidden risks of staying the course…"
                value={responses[`${bias.id}_risks`] || ""}
                onChange={(e) => setResponse(`${bias.id}_risks`, e.target.value)}
              />
            </div>
            <div className="col col-input">
              <textarea
                placeholder="Data, comparisons, or diagnostic actions…"
                value={responses[`${bias.id}_evidence`] || ""}
                onChange={(e) => setResponse(`${bias.id}_evidence`, e.target.value)}
              />
            </div>
          </div>
        ))}
        {optionalBias && (
          <div className="bias-row optional">
            <div className="col col-bias col-bias-optional">{optionalBias.label}</div>
            <div className="col col-input">
              <textarea
                placeholder="Additional bias & its unconsidered risks…"
                value={responses[`${optionalBias.id}_risks`] || ""}
                onChange={(e) => setResponse(`${optionalBias.id}_risks`, e.target.value)}
              />
            </div>
            <div className="col col-input">
              <textarea
                placeholder="Evidence or diagnostic action…"
                value={responses[`${optionalBias.id}_evidence`] || ""}
                onChange={(e) => setResponse(`${optionalBias.id}_evidence`, e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .bias-wrap {
          padding: 24px 32px;
        }
        .bias-table {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--elevation-1);
        }
        .bias-header,
        .bias-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0;
        }
        .bias-header {
          background: rgba(232, 93, 46, 0.08);
          border-bottom: 1px solid var(--border);
        }
        .col {
          padding: 20px 24px;
          border-right: 1px solid var(--border);
        }
        .col:last-child {
          border-right: none;
        }
        .col-h {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent-deep);
        }
        .bias-row {
          border-bottom: 1px solid var(--border);
          min-height: 140px;
        }
        .bias-row:last-child {
          border-bottom: none;
        }
        .bias-row.optional {
          background: rgba(0, 0, 0, 0.015);
        }
        .col-bias {
          font-family: "Inter Tight", sans-serif;
          font-weight: 500;
          font-style: italic;
          font-size: 15px;
          line-height: 1.45;
          color: var(--ink);
        }
        .col-bias-optional {
          font-style: normal;
          color: var(--ink-3);
          font-weight: 500;
        }
        .col-input {
          padding: 16px 20px;
        }
        .col-input textarea {
          width: 100%;
          min-height: 100px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 12px 14px;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: var(--ink);
          resize: vertical;
          outline: none;
          transition: border-color 150ms;
        }
        .col-input textarea:focus {
          border-color: var(--ink);
        }
        .col-input textarea::placeholder {
          color: var(--ink-3);
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// LAYOUT 3 — STACKED QUESTIONS (Round 3)
// =============================================================================
function StackedQuestionsLayout({ questions, responses, setResponse }) {
  return (
    <div className="stacked-wrap">
      {questions.map((q) => (
        <div className="question-block" key={q.id}>
          <label className="q-label">{q.label}</label>
          <textarea
            className="q-input"
            placeholder={q.placeholder}
            value={responses[q.id] || ""}
            onChange={(e) => setResponse(q.id, e.target.value)}
          />
        </div>
      ))}
      <style jsx>{`
        .stacked-wrap {
          padding: 24px 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .question-block {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: var(--elevation-1);
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .q-label {
          font-family: "Inter Tight", sans-serif;
          font-weight: 600;
          font-size: 18px;
          letter-spacing: -0.01em;
          color: var(--ink);
          line-height: 1.3;
        }
        .q-input {
          width: 100%;
          min-height: 120px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 14px;
          font-family: "Inter", sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: var(--ink);
          resize: vertical;
          outline: none;
          transition: border-color 150ms;
        }
        .q-input:focus {
          border-color: var(--ink);
        }
        .q-input::placeholder {
          color: var(--ink-3);
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// LAYOUT 4 — DEAL REVIEW CHECKLIST (Round 4)
// =============================================================================
function DealReviewLayout({ dealReview, responses, setResponse }) {
  return (
    <div className="dr-wrap">
      <div className="dr-intro">
        Review the assessment below. For items marked <span className="no-tag">"No"</span>, define the
        <span className="bold"> Next Actions</span> your team would take to address the gap.
      </div>
      <div className="dr-table">
        <div className="dr-header">
          <div className="col col-criteria">Criteria</div>
          <div className="col col-yn">Y/N</div>
          <div className="col col-evidence">Evidence</div>
          <div className="col col-actions">Next Actions</div>
        </div>
        {dealReview.sections.map((section) => (
          <div key={section.name}>
            <div className="section-header">
              <span>{section.name}</span>
            </div>
            {section.items.map((item) => {
              const isNo = item.status === "no";
              return (
                <div className={`dr-row ${isNo ? "row-no" : ""}`} key={item.id}>
                  <div className="col col-criteria">{item.criteria}</div>
                  <div className="col col-yn">
                    <span className={`yn-badge ${isNo ? "yn-no" : "yn-yes"}`}>
                      {isNo ? "N" : "Y"}
                    </span>
                  </div>
                  <div className="col col-evidence">{item.evidence}</div>
                  <div className="col col-actions">
                    {isNo ? (
                      <textarea
                        placeholder={dealReview.placeholderIfNo || "Define actions to address this gap…"}
                        value={responses[item.id] || ""}
                        onChange={(e) => setResponse(item.id, e.target.value)}
                      />
                    ) : (
                      <span className="dash">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx>{`
        .dr-wrap {
          padding: 24px 32px;
        }
        .dr-intro {
          font-size: 14px;
          color: var(--ink-2);
          margin-bottom: 16px;
        }
        .no-tag {
          color: var(--accent-deep);
          font-weight: 600;
        }
        .bold { font-weight: 600; color: var(--ink); }
        .dr-table {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--elevation-1);
        }
        .dr-header {
          display: grid;
          grid-template-columns: 5fr 0.8fr 3fr 3fr;
          background: var(--ink);
          color: rgba(255, 255, 255, 0.85);
        }
        .dr-header .col {
          padding: 14px 16px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }
        .dr-header .col-actions {
          color: var(--accent);
        }
        .dr-header .col:last-child {
          border-right: none;
        }
        .section-header {
          background: rgba(107, 70, 104, 0.12);
          padding: 10px 16px;
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: -0.01em;
          color: #6B4668;
        }
        .dr-row {
          display: grid;
          grid-template-columns: 5fr 0.8fr 3fr 3fr;
          border-bottom: 1px solid var(--border);
        }
        .dr-row:last-child {
          border-bottom: none;
        }
        .dr-row.row-no {
          background: rgba(254, 226, 226, 0.4);
        }
        .dr-row .col {
          padding: 16px;
          font-size: 13px;
          line-height: 1.5;
          color: var(--ink);
          border-right: 1px solid var(--border);
        }
        .dr-row .col:last-child {
          border-right: none;
        }
        .col-evidence {
          color: var(--ink-2);
        }
        .col-yn {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 16px !important;
        }
        .yn-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          font-family: "JetBrains Mono", monospace;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0;
        }
        .yn-yes {
          background: #D1FAE5;
          color: #065F46;
        }
        .yn-no {
          background: #FEE2E2;
          color: #B91C1C;
        }
        .col-actions textarea {
          width: 100%;
          min-height: 70px;
          background: #fff;
          border: 1px solid var(--accent);
          border-radius: 8px;
          padding: 10px 12px;
          font-family: "Inter", sans-serif;
          font-size: 13px;
          line-height: 1.5;
          color: var(--ink);
          resize: vertical;
          outline: none;
        }
        .col-actions textarea:focus {
          border-color: var(--accent-deep);
        }
        .col-actions textarea::placeholder {
          color: var(--ink-3);
        }
        .dash {
          color: var(--ink-3);
          font-size: 18px;
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// HELPERS — progress + submission builders per layout
// =============================================================================

function getLayoutProgress(layout, scenario, responses) {
  const motion = scenario.motion;
  if (layout === "bias-table") {
    const total = motion.biases?.length || 0;
    const filled = (motion.biases || []).filter(
      (b) =>
        (responses[`${b.id}_risks`] || "").trim().length > 0 &&
        (responses[`${b.id}_evidence`] || "").trim().length > 0
    ).length;
    return { filled, total };
  }
  if (layout === "stacked-questions") {
    const total = motion.questions?.length || 0;
    const filled = (motion.questions || []).filter(
      (q) => (responses[q.id] || "").trim().length > 0
    ).length;
    return { filled, total };
  }
  if (layout === "deal-review") {
    const allItems = (motion.dealReview?.sections || []).flatMap((s) => s.items);
    const noItems = allItems.filter((i) => i.status === "no");
    const filled = noItems.filter(
      (i) => (responses[i.id] || "").trim().length > 0
    ).length;
    return { filled, total: noItems.length };
  }
  // three-col-plus-one default
  const cards = motion.frameworkCards || [];
  const filled = cards.filter(
    (_, i) => (responses[`card_${i}`] || "").trim().length > 0
  ).length;
  return { filled, total: cards.length };
}

function buildSubmissionString(layout, scenario, responses) {
  const motion = scenario.motion;
  if (layout === "bias-table") {
    const parts = [];
    [...(motion.biases || []), motion.optionalBias].filter(Boolean).forEach((b) => {
      const risks = (responses[`${b.id}_risks`] || "").trim();
      const evidence = (responses[`${b.id}_evidence`] || "").trim();
      if (!risks && !evidence) return;
      const statement = b.statement || b.label || "Bias";
      parts.push(`Bias: ${statement}\nUnconsidered Risks: ${risks}\nEvidence / Diagnostic Action: ${evidence}`);
    });
    return parts.join("\n\n");
  }
  if (layout === "stacked-questions") {
    return (motion.questions || [])
      .map((q) => {
        const a = (responses[q.id] || "").trim();
        if (!a) return null;
        return `Q: ${q.label}\nA: ${a}`;
      })
      .filter(Boolean)
      .join("\n\n");
  }
  if (layout === "deal-review") {
    const parts = [];
    (motion.dealReview?.sections || []).forEach((section) => {
      const sectionPieces = section.items
        .filter((i) => i.status === "no")
        .map((i) => {
          const action = (responses[i.id] || "").trim();
          if (!action) return null;
          return `  - ${i.criteria}\n    Next Action: ${action}`;
        })
        .filter(Boolean);
      if (sectionPieces.length) {
        parts.push(`${section.name}\n${sectionPieces.join("\n")}`);
      }
    });
    return parts.join("\n\n");
  }
  // three-col default
  return (motion.frameworkCards || [])
    .map((card, i) => {
      const r = (responses[`card_${i}`] || "").trim();
      if (!r) return null;
      return `${card.heading}:\n${r}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function ChallengeCanvas({ scenario, teamName, currentRound, score, onSubmit, onRoundChange }) {
  const motion = scenario?.motion;
  const layout = motion?.inputLayout || "three-col-plus-one";

  const [responses, setResponses] = useState({});
  const [focused, setFocused] = useState(null);
  const [saveIndicator, setSaveIndicator] = useState("saved");
  const [secondsSinceSave, setSecondsSinceSave] = useState(4);
  const [briefOpen, setBriefOpen] = useState(false);

  // Reset responses when scenario (round) changes
  useEffect(() => {
    setResponses({});
    setFocused(null);
  }, [scenario?.client?.name, motion?.id]);

  const setResponse = (key, value) => {
    setResponses((r) => ({ ...r, [key]: value }));
  };

  // Save indicator
  useEffect(() => {
    const hasAny = Object.values(responses).some((v) => v && v.length > 0);
    if (hasAny) {
      setSaveIndicator("saving");
      const timeout = setTimeout(() => {
        setSaveIndicator("saved");
        setSecondsSinceSave(0);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [responses]);

  useEffect(() => {
    if (saveIndicator === "saved") {
      const interval = setInterval(() => setSecondsSinceSave((s) => s + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [saveIndicator]);

  const { filled, total } = useMemo(
    () => getLayoutProgress(layout, scenario, responses),
    [layout, scenario, responses]
  );
  const allFilled = total > 0 && filled === total;

  const handleSubmit = () => {
    if (!allFilled || !onSubmit) return;
    const submission = buildSubmissionString(layout, scenario, responses);
    onSubmit(submission, responses);
  };

  const handleReset = () => {
    if (confirm("Discard all responses and start over?")) {
      setResponses({});
    }
  };

  if (!scenario || !motion) {
    return <div style={{ padding: 48 }}>Loading challenge...</div>;
  }

  return (
    <div className="page">
      <NavBar
        currentRound={currentRound}
        teamName={teamName}
        score={score}
        onRoundChange={onRoundChange}
      />

      <OpportunityPanel
        mission={scenario.mission}
        challenge={motion.challenge || "Use the framework below to prepare your response."}
        dotColor={motion.roundColor}
      />

      {/* Challenge strip */}
      <div className="challenge-strip">
        <div className="strip-left">
          <span className="strip-label">CHALLENGE</span>
          <span className="client-name">{scenario.client.name}</span>
          <div className="strip-divider" />
          <span className="motion-label">{motion.name}</span>
        </div>
        <div className="strip-right">
          <div className="save-indicator">
            <div className={`save-dot ${saveIndicator}`} />
            <span>
              {saveIndicator === "saving"
                ? "Saving…"
                : secondsSinceSave === 0
                ? "Just saved"
                : `Saved ${secondsSinceSave}s ago`}
            </span>
          </div>
          <button className="brief-btn" onClick={() => setBriefOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2.5" y="1.5" width="9" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <path d="M4.5 4.5 L9.5 4.5 M4.5 7 L9.5 7 M4.5 9.5 L7.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            View Scenario Brief
          </button>
        </div>
      </div>

      {/* Activity area — layout switcher */}
      <div className="activity-area">
        {layout === "three-col-plus-one" && (
          <ThreeColLayout
            cards={motion.frameworkCards}
            responses={responses}
            setResponse={setResponse}
            focused={focused}
            setFocused={setFocused}
            dotColor={motion.roundColor}
          />
        )}
        {layout === "bias-table" && (
          <BiasTableLayout
            biases={motion.biases}
            optionalBias={motion.optionalBias}
            responses={responses}
            setResponse={setResponse}
            dotColor={motion.roundColor}
          />
        )}
        {layout === "stacked-questions" && (
          <StackedQuestionsLayout
            questions={motion.questions}
            responses={responses}
            setResponse={setResponse}
          />
        )}
        {layout === "deal-review" && (
          <DealReviewLayout
            dealReview={motion.dealReview}
            responses={responses}
            setResponse={setResponse}
          />
        )}
      </div>

      {/* Action bar */}
      <div className="action-bar">
        <div className="progress">
          <div className="progress-dots">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`progress-dot ${i < filled ? "filled" : ""}`}
              />
            ))}
          </div>
          <div className="progress-label">
            {filled} OF {total} COMPLETE
          </div>
        </div>
        <div className="actions">
          <button className="ghost-btn" onClick={handleReset}>
            Discard &amp; Restart
          </button>
          <button
            className={`submit-btn ${allFilled ? "ready" : ""}`}
            onClick={handleSubmit}
            disabled={!allFilled}
          >
            SUBMIT FOR COACHING →
          </button>
        </div>
      </div>

      {/* Scenario brief drawer */}
      {briefOpen && (
        <>
          <div className="brief-scrim" onClick={() => setBriefOpen(false)} />
          <aside className="brief-drawer">
            <div className="brief-head">
              <div className="brief-head-label">SCENARIO BRIEF</div>
              <button className="brief-close" onClick={() => setBriefOpen(false)} aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 3 L11 11 M11 3 L3 11" stroke="#4A5963" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="brief-body">
              <div className="brief-section">
                <div className="brief-badge">
                  ROUND {motion.number} · {motion.name.toUpperCase()}
                </div>
                <h3 className="brief-client">{scenario.client.name}</h3>
                <p className="brief-subtitle">{scenario.subtitle}</p>
              </div>
              <div className="brief-stats">
                {scenario.stakes.map((stat) => (
                  <div key={stat.label} className={`brief-stat ${stat.urgent ? "urgent" : ""}`}>
                    <div className="brief-stat-num">{stat.value}</div>
                    <div className="brief-stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="brief-section">
                <div className="brief-section-label">THE DECISION MAKERS</div>
                <div className="brief-personas">
                  {scenario.personas.map((p) => (
                    <div key={p.name} className="brief-persona">
                      <div className="brief-persona-role">{p.role}</div>
                      <div className="brief-persona-name">{p.name}</div>
                      <div className="brief-persona-tag">&ldquo;{p.tagline}&rdquo;</div>
                      <div className="brief-persona-rows">
                        <div><span className="brief-micro-label">FEARS</span> {p.fears}</div>
                        <div><span className="brief-micro-label">WANTS</span> {p.wants}</div>
                        <div><span className="brief-micro-label">LEVERS</span> {p.levers}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="brief-section">
                <div className="brief-section-label">YOUR MISSION</div>
                <p className="brief-mission">{scenario.mission}</p>
              </div>
              <div className="brief-section">
                <div className="brief-section-label">CONTEXT</div>
                <ul className="brief-context">
                  {scenario.context.map((c, i) => (<li key={i}>{c}</li>))}
                </ul>
              </div>
            </div>
          </aside>
        </>
      )}

      <style jsx>{`
        .page {
          width: 100%;
          min-height: 100vh;
          background: var(--canvas);
          display: flex;
          flex-direction: column;
        }
        .challenge-strip {
          height: 56px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          flex-shrink: 0;
          margin-top: 16px;
          background: var(--canvas);
          position: sticky;
          top: 72px;
          z-index: 50;
        }
        .strip-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .strip-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .client-name {
          font-family: "Inter Tight", sans-serif;
          font-weight: 600;
          font-size: 15px;
          color: var(--ink);
          letter-spacing: -0.01em;
        }
        .strip-divider {
          width: 1px;
          height: 16px;
          background: var(--border);
        }
        .motion-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--ink-2);
        }
        .strip-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .save-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--ink-3);
        }
        .save-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--success);
        }
        .save-dot.saving {
          background: var(--amber);
          animation: pulse 1s ease-in-out infinite;
        }
        .brief-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--ink-2);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: color 150ms, background 150ms;
        }
        .brief-btn:hover {
          color: var(--ink);
          background: var(--surface-2);
        }

        .activity-area {
          flex: 1;
        }

        .action-bar {
          border-top: 1px solid var(--border);
          padding: 20px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          background: var(--canvas);
        }
        .progress {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .progress-dots {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .progress-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: transparent;
          border: 1px solid var(--border-strong);
          transition: background 200ms, border-color 200ms;
        }
        .progress-dot.filled {
          background: var(--ink);
          border-color: var(--ink);
        }
        .progress-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .ghost-btn {
          font-size: 13px;
          font-weight: 500;
          color: var(--ink-3);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          transition: color 150ms;
        }
        .ghost-btn:hover {
          color: var(--ink-2);
        }
        .submit-btn {
          background: var(--surface-2);
          color: var(--ink-3);
          border: none;
          border-radius: 12px;
          padding: 14px 32px;
          font-family: "Inter", sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: not-allowed;
          transition: all 300ms;
        }
        .submit-btn.ready {
          background: var(--accent);
          color: #fff;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(232, 93, 46, 0.25);
        }
        .submit-btn.ready:hover {
          background: var(--accent-deep);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(232, 93, 46, 0.35);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* Drawer */
        .brief-scrim {
          position: fixed; inset: 0;
          background: rgba(15, 27, 34, 0.3);
          z-index: 250;
          animation: scrimIn 280ms;
        }
        @keyframes scrimIn { from { opacity: 0; } to { opacity: 1; } }
        .brief-drawer {
          position: fixed;
          top: 0; right: 0;
          width: 480px;
          max-width: 100vw;
          height: 100vh;
          background: var(--surface);
          border-left: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          z-index: 260;
          animation: drawerIn 280ms;
        }
        @keyframes drawerIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .brief-head {
          height: 56px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .brief-head-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-2);
        }
        .brief-close {
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 4px;
        }
        .brief-close:hover { background: var(--surface-2); }
        .brief-body {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }
        .brief-section { margin-bottom: 32px; }
        .brief-section:last-child { margin-bottom: 0; }
        .brief-section-label,
        .brief-badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-bottom: 12px;
        }
        .brief-client {
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 32px;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin-bottom: 8px;
        }
        .brief-subtitle {
          font-size: 15px;
          line-height: 1.5;
          color: var(--ink-2);
        }
        .brief-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 20px 0;
          margin-bottom: 32px;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .brief-stat {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .brief-stat-num {
          font-family: "JetBrains Mono", monospace;
          font-weight: 500;
          font-size: 24px;
          line-height: 1;
          color: var(--ink);
        }
        .brief-stat.urgent .brief-stat-num {
          color: var(--accent);
        }
        .brief-stat-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .brief-personas {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .brief-persona {
          padding: 20px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--surface-2);
        }
        .brief-persona-role {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-bottom: 4px;
        }
        .brief-persona-name {
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: var(--ink);
          margin-bottom: 6px;
        }
        .brief-persona-tag {
          font-size: 13px;
          font-style: italic;
          color: var(--ink-2);
          margin-bottom: 12px;
        }
        .brief-persona-rows {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 13px;
          color: var(--ink-2);
          line-height: 1.4;
        }
        .brief-micro-label {
          display: inline-block;
          min-width: 56px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--ink-3);
          margin-right: 8px;
        }
        .brief-mission {
          font-family: "Inter Tight", sans-serif;
          font-weight: 600;
          font-size: 18px;
          line-height: 1.4;
          color: var(--ink);
        }
        .brief-context {
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .brief-context li {
          font-size: 13px;
          color: var(--ink-2);
          line-height: 1.5;
          padding-left: 16px;
          position: relative;
        }
        .brief-context li::before {
          content: "·";
          position: absolute;
          left: 0;
          font-weight: 700;
          color: var(--ink-3);
        }
      `}</style>
    </div>
  );
}
