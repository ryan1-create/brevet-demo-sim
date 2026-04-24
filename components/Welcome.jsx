"use client";

import { useEffect, useRef, useState } from "react";
import { INDUSTRIES, MOTIONS } from "@/lib/scenarios";

// Ordered motions with shortened descriptions for the welcome preview
const MOTION_PREVIEW = [
  { ...MOTIONS.legacyDisplacement, short: "Create the buying decision before the customer knows they need to act." },
  { ...MOTIONS.replacement, short: "Win when the customer is evaluating alternatives." },
  { ...MOTIONS.defense, short: "Protect and renew an at-risk account." },
  { ...MOTIONS.expansion, short: "Grow the footprint inside a success story." },
];

const INDUSTRY_ICONS = {
  technology: (
    <g fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="8" r="2.5" />
      <circle cx="22" cy="8" r="2.5" />
      <circle cx="14" cy="21" r="2.5" />
      <path d="M8 9.5 L20 9.5" />
      <path d="M7.5 10.5 L12.5 19" />
      <path d="M20.5 10.5 L15.5 19" />
    </g>
  ),
  "financial-services": (
    <g fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 23 L3 6" />
      <path d="M3 23 L25 23" />
      <path d="M6 19 L11 14 L15 17 L20 9 L24 11" />
      <path d="M20 9 L22.5 9 L22.5 11.5" opacity="0.6" />
    </g>
  ),
  "professional-services": (
    <g fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4 L18 12 L10 20 L2 12 Z" />
      <path d="M18 8 L26 16 L18 24 L10 16 Z" />
    </g>
  ),
  healthcare: (
    <g fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 24 C14 24, 3 17, 3 10 C3 6, 6 3, 10 3 C12 3, 14 5, 14 5 C14 5, 16 3, 18 3 C22 3, 25 6, 25 10 C25 13, 22.5 16, 20 18" />
      <path d="M5 14 L9 14 L11 10 L14 18 L16 14 L20 14" />
    </g>
  ),
};

export default function Welcome({ onStart }) {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [teamName, setTeamName] = useState("");
  const canvasRef = useRef(null);

  const ready = selectedIndustry && teamName.trim().length > 0;

  // Shader animation
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
      ctx.strokeStyle = "rgba(180, 210, 225, 0.85)";
      ctx.lineWidth = 1;
      const lines = 16;
      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        const y0 = (H / lines) * i + Math.sin(t * 0.2 + i * 0.6) * 12;
        const amp = 50 + Math.sin(t * 0.15 + i) * 14;
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
      t += 0.006;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const handleStart = () => {
    if (!ready || !onStart) return;
    onStart({
      industryId: selectedIndustry,
      teamName: teamName.trim(),
    });
  };

  return (
    <div className="page dark">
      <canvas ref={canvasRef} className="shader" />

      <section className="hero">
        <img
          className="mark-lg"
          src="/brevet-chevron.svg"
          alt="Brevet"
          height="72"
        />
        <h1 className="hero-title">
          <span className="line1">The Brevet Group</span>
          <span className="line2">Sales Simulation</span>
        </h1>
      </section>

      <section className="motions">
        <div className="label motions-label">THE FOUR MOTIONS</div>
        <div className="motions-grid">
          {MOTION_PREVIEW.map((m) => (
            <div
              key={m.id}
              className="motion-card"
              style={{ borderLeftColor: m.roundColor }}
            >
              <div className="motion-number">ROUND {m.number}</div>
              <div className="motion-name">{m.name}</div>
              <div className="motion-desc">{m.short}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="setup">
        <div className="label section-label">CHOOSE YOUR INDUSTRY</div>
        <div className="tiles">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind.id}
              className={`tile ${selectedIndustry === ind.id ? "selected" : ""}`}
              onClick={() => setSelectedIndustry(ind.id)}
              type="button"
            >
              <svg className="icon" width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
                {INDUSTRY_ICONS[ind.id]}
              </svg>
              <div className="tile-name">{ind.name}</div>
              <div className="tile-desc">{ind.description}</div>
            </button>
          ))}
        </div>
        <div className="name-wrap">
          <div className="label section-label">NAME YOUR TEAM</div>
          <input
            type="text"
            className="name-input"
            placeholder="e.g. Table 14"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
          />
        </div>
      </section>

      <section className="cta-band">
        <button
          className={`btn ${ready ? "ready" : ""}`}
          onClick={handleStart}
          disabled={!ready}
        >
          BEGIN SIMULATION →
        </button>
      </section>

      <style jsx>{`
        .page {
          --canvas: #1A2C36;
          --canvas-deep: #13222B;
          --canvas-inverse: #FAFAF7;
          --surface: rgba(255,255,255,0.04);
          --surface-2: rgba(255,255,255,0.06);
          --surface-hover: rgba(255,255,255,0.08);
          --ink: #F4F1EC;
          --ink-2: rgba(244,241,236,0.68);
          --ink-3: rgba(244,241,236,0.45);
          --border: rgba(255,255,255,0.10);
          --border-strong: rgba(255,255,255,0.22);
          --accent: #E85D2E;
          --accent-deep: #FF7A4E;
          width: 100%;
          min-height: 100vh;
          background: var(--canvas);
          color: var(--ink);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .shader {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.14;
          mix-blend-mode: screen;
          pointer-events: none;
          z-index: 0;
        }

        .hero {
          position: relative;
          z-index: 2;
          flex: 1 1 420px;
          min-height: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 120px;
          animation: fadeUp 600ms var(--ease-entry, cubic-bezier(0.22, 1, 0.36, 1)) both;
        }
        .mark-lg {
          display: block;
          width: auto;
          height: 64px;
          object-fit: contain;
        }
        .hero-title {
          margin-top: 32px;
          text-align: center;
        }
        .hero-title .line1 {
          display: block;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: 15px;
          letter-spacing: 0.04em;
          color: var(--ink-2);
          margin-bottom: 14px;
        }
        .hero-title .line2 {
          display: block;
          font-family: 'Inter Tight', sans-serif;
          font-weight: 700;
          font-size: 72px;
          line-height: 1.0;
          letter-spacing: -0.02em;
          color: var(--ink);
        }

        .motions {
          position: relative;
          z-index: 2;
          padding: 0 80px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeUp 600ms var(--ease-entry, cubic-bezier(0.22, 1, 0.36, 1)) 80ms both;
        }
        .motions-label {
          margin-bottom: 24px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .motions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          width: 100%;
          max-width: 1100px;
        }
        .motion-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-left-width: 3px;
          border-left-style: solid;
          border-radius: 12px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: background 200ms var(--ease-state), border-color 200ms var(--ease-state);
        }
        .motion-card:hover {
          background: var(--surface-hover);
          border-color: var(--border-strong);
        }
        .motion-number {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: var(--ink-3);
        }
        .motion-name {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 700;
          font-size: 18px;
          letter-spacing: -0.01em;
          color: var(--ink);
          line-height: 1.15;
        }
        .motion-desc {
          font-size: 13px;
          color: var(--ink-2);
          line-height: 1.4;
          margin-top: 4px;
        }

        .setup {
          position: relative;
          z-index: 2;
          padding: 32px 80px 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeUp 600ms var(--ease-entry, cubic-bezier(0.22, 1, 0.36, 1)) 120ms both;
        }
        .section-label {
          margin-bottom: 24px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .tiles {
          display: grid;
          grid-template-columns: repeat(4, 260px);
          gap: 20px;
        }
        .tile {
          width: 260px;
          height: 140px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: transform 150ms var(--ease-state), border-color 150ms var(--ease-state),
                      background 200ms var(--ease-state), color 200ms var(--ease-state),
                      box-shadow 150ms var(--ease-state);
          position: relative;
          font-family: inherit;
          text-align: left;
        }
        .tile:hover {
          background: var(--surface-hover);
          border-color: var(--border-strong);
          transform: translateY(-2px);
        }
        .tile.selected {
          background: var(--canvas-inverse);
          border-color: var(--canvas-inverse);
        }
        .tile .icon {
          stroke: var(--ink);
          transition: stroke 200ms var(--ease-state);
        }
        .tile.selected .icon {
          stroke: #0F1B22;
        }
        .tile-name {
          margin-top: 16px;
          font-family: 'Inter Tight', sans-serif;
          font-weight: 600;
          font-size: 20px;
          letter-spacing: -0.01em;
          color: var(--ink);
          line-height: 1.1;
        }
        .tile.selected .tile-name {
          color: #0F1B22;
        }
        .tile-desc {
          margin-top: 4px;
          font-size: 13px;
          color: var(--ink-2);
          line-height: 1.3;
          transition: color 200ms var(--ease-state);
        }
        .tile.selected .tile-desc {
          color: rgba(15,27,34,0.6);
        }

        .name-wrap {
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .name-wrap .section-label {
          margin-bottom: 16px;
        }
        .name-input {
          width: 520px;
          height: 64px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0 20px;
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          font-weight: 500;
          color: var(--ink);
          text-align: center;
          outline: none;
          transition: border-color 150ms var(--ease-state), box-shadow 150ms var(--ease-state),
                      background 150ms var(--ease-state);
        }
        .name-input::placeholder {
          color: var(--ink-3);
          font-weight: 400;
        }
        .name-input:focus {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.4);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3);
        }

        .cta-band {
          position: relative;
          z-index: 2;
          padding: 32px 0 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeUp 600ms var(--ease-entry, cubic-bezier(0.22, 1, 0.36, 1)) 240ms both;
        }
        .btn {
          background: var(--surface-2);
          color: rgba(244,241,236,0.35);
          border: none;
          border-radius: 12px;
          padding: 14px 36px;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: not-allowed;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: background 200ms var(--ease-state), color 200ms var(--ease-state),
                      transform 150ms var(--ease-state), box-shadow 200ms var(--ease-state);
        }
        .btn.ready {
          background: var(--accent);
          color: #fff;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(232,93,46,0.35);
        }
        .btn.ready:hover {
          background: var(--accent-deep);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(232,93,46,0.45);
        }
        .cta-note {
          margin-top: 12px;
          font-size: 12px;
          color: var(--ink-3);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
