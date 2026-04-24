"use client";

import { useEffect, useRef, useState, Fragment } from "react";
import NavBar from "./NavBar";

function parseStat(value) {
  const match = String(value).match(/^([^\d-]*)(-?\d+\.?\d*)([^\d]*)$/);
  if (!match) return { prefix: "", number: 0, suffix: "", decimals: 0 };
  const [, prefix, num, suffix] = match;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return { prefix, number: parseFloat(num), suffix, decimals };
}

function CountUp({ prefix = "", target = 0, suffix = "", decimals = 0, duration = 1500, delay = 0 }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    const timer = setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(target * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);
  return (
    <>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </>
  );
}

function PersonaCard({ role, name, tagline, fears, wants, levers }) {
  const ref = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = (e.clientX - rect.left - centerX) / centerX;
    const deltaY = (e.clientY - rect.top - centerY) / centerY;
    ref.current.style.transform = `rotateY(${deltaX * 6}deg) rotateX(${-deltaY * 4}deg)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = "rotateY(0deg) rotateX(0deg)";
    }
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      ref={ref}
      className="persona"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ "--mx": `${mousePos.x}%`, "--my": `${mousePos.y}%` }}
    >
      <div className="persona-portrait">{initials}</div>
      <div className="persona-inner">
        <div className="role">{role}</div>
        <div className="name">{name}</div>
        <div className="tagline">&ldquo;{tagline}&rdquo;</div>
        <div className="divider" />
        <div className="rows">
          <div className="row">
            <div className="row-label">FEARS</div>
            <div className="line">{fears}</div>
          </div>
          <div className="row">
            <div className="row-label">WANTS</div>
            <div className="line">{wants}</div>
          </div>
          <div className="row">
            <div className="row-label">LEVERS</div>
            <div className="line">{levers}</div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .persona {
          position: relative;
          width: 400px;
          height: 380px;
          border-radius: 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 32px;
          overflow: hidden;
          transform-style: preserve-3d;
          transition: transform 250ms var(--ease-state), border-color 250ms var(--ease-state);
          will-change: transform;
          cursor: default;
        }
        .persona::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: radial-gradient(
            520px circle at var(--mx, 50%) var(--my, 30%),
            rgba(255, 190, 210, 0.22) 0%,
            rgba(170, 220, 240, 0.18) 25%,
            rgba(245, 220, 160, 0.16) 45%,
            rgba(255, 255, 255, 0) 70%
          );
          mix-blend-mode: screen;
          opacity: 0.55;
          transition: opacity 300ms var(--ease-state);
          pointer-events: none;
        }
        .persona:hover::before {
          opacity: 1;
        }
        .persona-inner {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          transform: translateZ(0.01px);
        }
        .persona-portrait {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          font-family: "Inter Tight", sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: var(--ink-2);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }
        .role {
          color: var(--ink-3);
          margin-bottom: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .name {
          font-family: "Inter Tight", sans-serif;
          font-weight: 700;
          font-size: 24px;
          letter-spacing: -0.02em;
          line-height: 1.15;
          color: var(--ink);
          margin-bottom: 12px;
        }
        .tagline {
          font-size: 16px;
          font-style: italic;
          color: var(--ink-2);
          line-height: 1.4;
          margin-bottom: 20px;
        }
        .divider {
          height: 1px;
          background: var(--border);
          margin-bottom: 16px;
        }
        .rows {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .row {
          display: grid;
          grid-template-columns: 68px 1fr;
          gap: 16px;
          align-items: baseline;
          padding: 4px 0;
        }
        .row-label {
          color: var(--ink-3);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .line {
          font-size: 14px;
          color: var(--ink-2);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}

export default function ScenarioBrief({ scenario, teamName, currentRound, score, onBegin }) {
  const shaderRef = useRef(null);

  useEffect(() => {
    const canvas = shaderRef.current;
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
      const lines = 10;
      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        const y0 = (H / lines) * i + Math.sin(t * 0.2 + i * 0.6) * 8;
        const amp = 30 + Math.sin(t * 0.15 + i) * 8;
        const freq = 0.004 + (i % 3) * 0.0006;
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
      t += 0.012;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  if (!scenario) {
    return <div style={{ padding: 48 }}>Loading scenario...</div>;
  }

  return (
    <div className="sb-outer">
      <NavBar currentRound={currentRound} teamName={teamName} score={score} />

      <div className="sb-page">
        {/* Hero zone */}
        <section className="sb-hero">
          <canvas ref={shaderRef} className="sb-hero-shader" />
          <div className="sb-hero-grain" />
          <div className="sb-hero-left">
            <div className="sb-hero-badge">
              ROUND {scenario.motion.number} · {scenario.motion.name.toUpperCase()} · {scenario.client.industry.toUpperCase()}
            </div>
            <h1 className="sb-hero-title">{scenario.client.name}</h1>
            <div className="sb-hero-sub">{scenario.subtitle}</div>
          </div>
          <div className="sb-hero-right">
            {scenario.stakes.map((stat, i) => {
              const parsed = parseStat(stat.value);
              return (
                <Fragment key={stat.label}>
                  {i > 0 && <div className="sb-stat-divider" />}
                  <div className={`sb-stat ${stat.urgent ? "sb-urgent" : ""}`}>
                    <div className="sb-stat-num">
                      <CountUp
                        prefix={parsed.prefix}
                        target={parsed.number}
                        suffix={parsed.suffix}
                        decimals={parsed.decimals}
                        delay={600 + i * 200}
                      />
                    </div>
                    <div className="sb-stat-label">{stat.label}</div>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </section>

        {/* Personas zone */}
        <section className="sb-personas">
          <div className="sb-personas-header">
            <div className="sb-personas-label">THE DECISION MAKERS</div>
            <h2>Three people decide this.</h2>
            <p className="sb-sub">Fears. Wants. Levers. Understand them or lose them.</p>
          </div>
          <div className="sb-personas-row">
            {scenario.personas.map((p) => (
              <PersonaCard key={p.name} {...p} />
            ))}
          </div>
        </section>

        {/* Closing: mission + framework + CTA */}
        <section className="sb-closing">
          <div className="sb-closing-row">
            <div>
              <div className="sb-closing-label">YOUR MISSION</div>
              <p className="sb-mission-statement">{scenario.mission}</p>
            </div>
            <div>
              <div className="sb-closing-label">YOUR FRAMEWORK</div>
              <div className="sb-framework-grid">
                {scenario.motion.frameworkCards.map((card) => (
                  <div key={card.number} className="sb-chip">
                    <span
                      className="sb-chip-dot"
                      style={{ background: scenario.motion.roundColor }}
                    />
                    <span className="sb-chip-num">{card.number}</span>
                    <span>· {card.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="sb-cta-row">
            <button className="sb-btn-primary" onClick={onBegin}>
              BEGIN CHALLENGE →
            </button>
            <div className="sb-cta-note">The exercise begins when you click.</div>
          </div>
        </section>
      </div>
    </div>
  );
}
