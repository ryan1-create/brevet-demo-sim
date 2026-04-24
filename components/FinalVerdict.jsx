"use client";

import { useEffect, useRef, useState } from "react";
import { MOTIONS } from "@/lib/scenarios";

function TotalScoreCountUp({ target, duration = 2400 }) {
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

function getInterpretation(totalScore) {
  const pct = totalScore / 400;
  if (pct >= 0.9) return { label: "Championship Caliber", line: "This is how the top 5% of sellers show up to a CEO conversation. The work is tight, specific, and executive-grade. Keep this bar." };
  if (pct >= 0.75) return { label: "Strong Contender", line: "Real strategic thinking and customer specificity throughout. A few moves away from championship caliber. Refine the executive framing and the proof points." };
  if (pct >= 0.55) return { label: "Building Momentum", line: "The instincts are there. The work is directionally correct but still generic in places. Push for customer specificity over buzzwords." };
  if (pct >= 0.35) return { label: "Foundation Phase", line: "More product than outcome. More feature than business case. Read the scenarios again — the answer is always in the customer's stated context." };
  return { label: "Needs Development", line: "Start with the customer. Everything else follows." };
}

export default function FinalVerdict({ teamName, totalScore, roundScores, onRestart }) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showClosing, setShowClosing] = useState(false);
  const canvasRef = useRef(null);

  const interpretation = getInterpretation(totalScore);

  // Reveal sequence: score appears, then breakdown, then closing
  useEffect(() => {
    const t1 = setTimeout(() => setShowBreakdown(true), 2800);
    const t2 = setTimeout(() => setShowClosing(true), 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Subtle shader backdrop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const updateSize = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    let t = 0;
    let raf;
    const draw = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(180, 210, 225, 0.8)";
      ctx.lineWidth = 1;
      const lines = 14;
      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        const y0 = (H / lines) * i + Math.sin(t * 0.2 + i * 0.6) * 10;
        const amp = 60 + Math.sin(t * 0.15 + i) * 18;
        const freq = 0.003 + (i % 3) * 0.0005;
        const phase = t * 0.25 + i * 0.9;
        ctx.moveTo(0, y0);
        for (let x = 0; x <= W; x += 12) {
          const y =
            y0 +
            Math.sin(x * freq + phase) * amp +
            Math.sin(x * freq * 0.4 + phase * 0.6) * (amp * 0.35);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      t += 0.005;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  // Match motion ID to motion object for labels + colors
  const motionById = (id) =>
    Object.values(MOTIONS).find((m) => m.id === id) || null;

  return (
    <div className="verdict">
      <canvas ref={canvasRef} className="shader" />

      <div className="content">
        <div className="label team-label">
          <span className="team-prefix">TEAM</span>
          <span className="team-name">{teamName || "Your Team"}</span>
        </div>

        <div className="score-wrap">
          <div className="score-num">
            <TotalScoreCountUp target={totalScore} />
          </div>
          <div className="score-denom">/ 400</div>
        </div>

        <div className="label interpretation-label">{interpretation.label}</div>
        <p className="interpretation-line">{interpretation.line}</p>

        {showBreakdown && (
          <div className="breakdown">
            {roundScores.map((round, i) => {
              const motion = motionById(round.motion);
              return (
                <div
                  key={round.round}
                  className="round-card"
                  style={{
                    animationDelay: `${i * 120}ms`,
                    borderLeftColor: motion?.roundColor || "#888",
                  }}
                >
                  <div className="round-card-top">
                    <span className="round-tag">
                      ROUND {String(round.round).padStart(2, "0")}
                    </span>
                    <span className="round-score">{round.score}</span>
                  </div>
                  <div className="round-motion">{motion?.name || "—"}</div>
                </div>
              );
            })}
          </div>
        )}

        {showClosing && (
          <div className="closing">
            <button className="primary-btn" onClick={onRestart}>
              Start a New Simulation →
            </button>
            <div className="closing-note">
              Presented by Brevet · Part of SBI
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .verdict {
          --canvas: #1A2C36;
          --canvas-deep: #13222B;
          --ink: #F4F1EC;
          --ink-2: rgba(244, 241, 236, 0.72);
          --ink-3: rgba(244, 241, 236, 0.45);
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
          position: relative;
          overflow: hidden;
        }

        .shader {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.08;
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        .label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .team-label {
          color: var(--ink-3);
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 16px;
          animation: fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .team-prefix {
          opacity: 0.6;
        }
        .team-name {
          color: var(--ink);
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.08em;
        }

        .score-wrap {
          display: flex;
          align-items: baseline;
          gap: 20px;
          margin-bottom: 16px;
          animation: fadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both;
        }
        .score-num {
          font-family: "JetBrains Mono", monospace;
          font-weight: 500;
          font-size: clamp(120px, 18vw, 220px);
          line-height: 1;
          color: var(--ink);
          letter-spacing: -0.04em;
          font-variant-numeric: tabular-nums;
        }
        .score-denom {
          font-family: "JetBrains Mono", monospace;
          font-weight: 500;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1;
          color: var(--ink-3);
          letter-spacing: -0.02em;
        }

        .interpretation-label {
          color: var(--accent);
          margin-top: 16px;
          margin-bottom: 12px;
          animation: fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) 1400ms both;
        }
        .interpretation-line {
          font-size: 18px;
          color: var(--ink-2);
          line-height: 1.5;
          max-width: 620px;
          margin: 0 auto 56px;
          font-family: "Inter Tight", sans-serif;
          font-weight: 400;
          animation: fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) 1800ms both;
        }

        .breakdown {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          width: 100%;
          max-width: 820px;
          margin-bottom: 56px;
        }
        .round-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          border-left-width: 3px;
          border-left-style: solid;
          border-radius: 12px;
          padding: 20px;
          text-align: left;
          opacity: 0;
          animation: cardIn 500ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .round-card-top {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .round-tag {
          font-family: "JetBrains Mono", monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: var(--ink-3);
        }
        .round-score {
          font-family: "JetBrains Mono", monospace;
          font-weight: 500;
          font-size: 32px;
          line-height: 1;
          color: var(--ink);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }
        .round-motion {
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: -0.01em;
          color: var(--ink);
          line-height: 1.2;
        }

        .closing {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          animation: fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .primary-btn {
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
        .primary-btn:hover {
          background: var(--accent-deep);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(232, 93, 46, 0.45);
        }
        .closing-note {
          font-size: 11px;
          color: var(--ink-3);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
