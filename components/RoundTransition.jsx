"use client";

import { useEffect, useState } from "react";

function CountUp({ target, duration = 1000, delay = 0 }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
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
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);
  return <>{value}</>;
}

export default function RoundTransition({
  completedRound,
  completedMotion,
  completedRoundScore,
  totalScore,
  nextRound,
  nextMotion,
  onAdvance,
}) {
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowNext(true), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="transition">
      <div className="content">
        {/* Completed round */}
        <div
          className="completed-block"
          style={{ borderLeftColor: completedMotion?.roundColor || "#888" }}
        >
          <div className="tag">
            ROUND {String(completedRound).padStart(2, "0")} · {completedMotion?.name?.toUpperCase()}
          </div>
          <div className="complete-label">COMPLETE</div>
          <div className="scores-row">
            <div className="score-item">
              <div className="score-num">
                <CountUp target={completedRoundScore} duration={1200} />
              </div>
              <div className="score-label">ROUND SCORE</div>
            </div>
            <div className="divider" />
            <div className="score-item">
              <div className="score-num">
                <CountUp target={totalScore} duration={1400} delay={200} />
              </div>
              <div className="score-label">RUNNING TOTAL</div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="separator">
          <div className="sep-line" />
          <div className="sep-arrow">↓</div>
          <div className="sep-line" />
        </div>

        {/* Next round */}
        {showNext && (
          <div
            className="next-block"
            style={{ borderLeftColor: nextMotion?.roundColor || "#888" }}
          >
            <div className="tag">COMING UP</div>
            <div className="next-title">
              ROUND {String(nextRound).padStart(2, "0")} · {nextMotion?.name?.toUpperCase()}
            </div>
            <p className="next-desc">{nextMotion?.description}</p>
            <button className="advance-btn" onClick={onAdvance}>
              Continue →
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .transition {
          --canvas: #1A2C36;
          --ink: #F4F1EC;
          --ink-2: rgba(244, 241, 236, 0.72);
          --ink-3: rgba(244, 241, 236, 0.48);
          --border: rgba(255, 255, 255, 0.1);
          --accent: #E85D2E;
          --accent-deep: #FF7A4E;

          min-height: 100vh;
          width: 100%;
          background: var(--canvas);
          color: var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 64px 32px;
        }

        .content {
          max-width: 720px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }

        .completed-block,
        .next-block {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          border-left-width: 3px;
          border-left-style: solid;
          border-radius: 16px;
          padding: 32px 40px;
          animation: fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .tag {
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: var(--ink-3);
          margin-bottom: 8px;
        }

        .complete-label {
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 48px;
          line-height: 1;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin-bottom: 32px;
        }

        .scores-row {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .score-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .score-num {
          font-family: "JetBrains Mono", monospace;
          font-weight: 500;
          font-size: 64px;
          line-height: 1;
          color: var(--ink);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }

        .score-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }

        .divider {
          width: 1px;
          height: 56px;
          background: rgba(255, 255, 255, 0.15);
        }

        .separator {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px 0;
          animation: fadeUp 500ms cubic-bezier(0.22, 1, 0.36, 1) 800ms both;
        }
        .sep-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .sep-arrow {
          font-family: "JetBrains Mono", monospace;
          font-size: 18px;
          color: var(--ink-3);
        }

        .next-block {
          animation-delay: 0ms;
          animation: fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .next-title {
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 32px;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin-bottom: 12px;
        }

        .next-desc {
          font-size: 16px;
          line-height: 1.5;
          color: var(--ink-2);
          margin-bottom: 32px;
        }

        .advance-btn {
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px 32px;
          font-family: "Inter", sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 200ms, transform 150ms, box-shadow 200ms;
          box-shadow: 0 4px 14px rgba(232, 93, 46, 0.35);
        }
        .advance-btn:hover {
          background: var(--accent-deep);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(232, 93, 46, 0.45);
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
