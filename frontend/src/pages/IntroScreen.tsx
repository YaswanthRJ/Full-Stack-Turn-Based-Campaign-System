import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import logo from "../assets/logo.png";

// ── Star field canvas ─────────────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const COLORS = ["#ffffff", "#dde8ff", "#f0d8ff", "#c8d8ff"];
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.3 + Math.random() * 1.2,
      base: 0.2 + Math.random() * 0.65,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let t = 0;
    let raf: number;

    function resize() {
      canvas!.width = canvas!.clientWidth;
      canvas!.height = canvas!.clientHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx.clearRect(0, 0, w, h);
      t += 0.016;
      for (const s of stars) {
        const opacity = Math.max(0, Math.min(1, s.base + Math.sin(t * s.speed + s.phase) * 0.25));
        ctx.globalAlpha = opacity;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}

// ── Shooting stars ────────────────────────────────────────────────────────
function ShootingStars() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function shoot() {
      const svg = svgRef.current;
      if (!svg) return;

      if (Math.random() > 0.35) {
        timeout = setTimeout(shoot, 2000 + Math.random() * 4000);
        return;
      }

      const w = svg.clientWidth;
      const h = svg.clientHeight;
      const x1 = Math.random() * w * 0.7 + w * 0.05;
      const y1 = Math.random() * h * 0.35;
      const len = 80 + Math.random() * 130;
      const angle = 0.38 + Math.random() * 0.45;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("stroke", "rgba(220,200,255,0.85)");
      line.setAttribute("stroke-width", "1.5");
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("x1", String(x1));
      line.setAttribute("y1", String(y1));
      line.setAttribute("x2", String(x1));
      line.setAttribute("y2", String(y1));
      svg.appendChild(line);

      const dur = 380;
      const start = performance.now();

      function step(now: number) {
        const p = Math.min((now - start) / dur, 1);
        // head advances 0→1
        const headP = Math.min(p * 2, 1);
        // tail follows with delay
        const tailP = Math.max(0, (p - 0.4) * (1 / 0.6));
        line.setAttribute("x1", String(x1 + Math.cos(angle) * len * tailP));
        line.setAttribute("y1", String(y1 + Math.sin(angle) * len * tailP));
        line.setAttribute("x2", String(x1 + Math.cos(angle) * len * headP));
        line.setAttribute("y2", String(y1 + Math.sin(angle) * len * headP));
        // fade in then out
        const opacity = p < 0.5 ? p * 2 : (1 - p) * 2;
        line.setAttribute("stroke-opacity", String(opacity));
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          svgRef.current?.removeChild(line);
        }
      }
      requestAnimationFrame(step);
      timeout = setTimeout(shoot, 2000 + Math.random() * 5000);
    }

    timeout = setTimeout(shoot, 1200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}

// ── Constellation ─────────────────────────────────────────────────────────
// Natural-looking star pattern. A spark traces each edge on load,
// then all lines and dots settle into a slow purple pulse.
const CONSTELLATION_STARS: [number, number][] = [
  [0.08, 0.12],
  [0.16, 0.06],
  [0.26, 0.09],
  [0.33, 0.17],
  [0.28, 0.26],
  [0.18, 0.30],
  [0.10, 0.23],
  [0.22, 0.18],
];
// Edges as index pairs — forms a loose irregular polygon with an inner cross
const CONSTELLATION_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0],
  [1, 7], [3, 7], [5, 7],
];

function Constellation() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const W = svg.clientWidth;
    const H = svg.clientHeight;
    const ns = "http://www.w3.org/2000/svg";

    const px = (i: number) => CONSTELLATION_STARS[i][0] * W;
    const py = (i: number) => CONSTELLATION_STARS[i][1] * H;

    // Build lines (invisible initially)
    const lines = CONSTELLATION_EDGES.map(([a, b]) => {
      const el = document.createElementNS(ns, "line");
      el.setAttribute("x1", String(px(a)));
      el.setAttribute("y1", String(py(a)));
      el.setAttribute("x2", String(px(b)));
      el.setAttribute("y2", String(py(b)));
      el.setAttribute("stroke", "rgba(180,120,255,0)");
      el.setAttribute("stroke-width", "0.6");
      el.setAttribute("stroke-linecap", "round");
      svg.appendChild(el);
      return el;
    });

    // Build star dots (invisible initially)
    const dots = CONSTELLATION_STARS.map(([sx, sy]) => {
      const c = document.createElementNS(ns, "circle");
      c.setAttribute("cx", String(sx * W));
      c.setAttribute("cy", String(sy * H));
      c.setAttribute("r", "1.8");
      c.setAttribute("fill", "rgba(220,185,255,0)");
      svg.appendChild(c);
      return c;
    });

    // Spark dot
    const spark = document.createElementNS(ns, "circle");
    spark.setAttribute("r", "2");
    spark.setAttribute("fill", "rgba(240,220,255,0)");
    svg.appendChild(spark);

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let pulseRaf: number;
    let breathRaf: number;

    // Animate a single edge: spark travels A→B, line fades in behind it
    function animateEdge(edgeIdx: number, onDone: () => void) {
      const [a, b] = CONSTELLATION_EDGES[edgeIdx];
      const ax = px(a), ay = py(a), bx = px(b), by = py(b);
      const dur = 380 + Math.hypot(bx - ax, by - ay) * 1.4;
      const start = performance.now();
      function step(now: number) {
        const p = Math.min((now - start) / dur, 1);
        // Spark moves A→B
        spark.setAttribute("cx", String(ax + (bx - ax) * p));
        spark.setAttribute("cy", String(ay + (by - ay) * p));
        spark.setAttribute("fill", `rgba(240,220,255,${(Math.sin(p * Math.PI) * 0.85).toFixed(2)})`);
        // Line fades in behind spark
        lines[edgeIdx].setAttribute("stroke", `rgba(180,120,255,${(p * 0.18).toFixed(3)})`);
        if (p < 1) requestAnimationFrame(step);
        else {
          spark.setAttribute("fill", "rgba(240,220,255,0)");
          onDone();
        }
      }
      requestAnimationFrame(step);
    }

    // Chain all edges sequentially with a small gap
    function runEdges(i: number, onAllDone: () => void) {
      if (i >= CONSTELLATION_EDGES.length) { onAllDone(); return; }
      animateEdge(i, () => {
        const t = setTimeout(() => runEdges(i + 1, onAllDone), 60);
        timeouts.push(t);
      });
    }

    // Fade in dots one by one after edges
    function revealDots(i: number, onAllDone: () => void) {
      if (i >= dots.length) { onAllDone(); return; }
      const start = performance.now();
      function fade(now: number) {
        const p = Math.min((now - start) / 320, 1);
        dots[i].setAttribute("fill", `rgba(220,185,255,${(p * 0.8).toFixed(2)})`);
        if (p < 1) requestAnimationFrame(fade);
        else {
          const t = setTimeout(() => revealDots(i + 1, onAllDone), 70);
          timeouts.push(t);
        }
      }
      requestAnimationFrame(fade);
    }

    // Start the whole sequence after a short delay
    const t0 = setTimeout(() => {
      runEdges(0, () => {
        revealDots(0, () => {
          // Pulse lines
          const ps = performance.now();
          function pulseLine(now: number) {
            const elapsed = (now - ps) / 1000;
            const o = (0.12 + Math.sin(elapsed * 0.55) * 0.06).toFixed(3);
            lines.forEach((l) => l.setAttribute("stroke", `rgba(180,120,255,${o})`));
            pulseRaf = requestAnimationFrame(pulseLine);
          }
          requestAnimationFrame(pulseLine);

          // Breathe dots
          const bs = performance.now();
          function breathe(now: number) {
            const elapsed = (now - bs) / 1000;
            dots.forEach((d, i) => {
              const r = (1.8 + Math.sin(elapsed * 1.1 + i * 1.7) * 0.7).toFixed(2);
              const o = (0.55 + Math.sin(elapsed * 1.1 + i * 1.7) * 0.25).toFixed(2);
              d.setAttribute("r", r);
              d.setAttribute("fill", `rgba(220,185,255,${o})`);
            });
            breathRaf = requestAnimationFrame(breathe);
          }
          requestAnimationFrame(breathe);
        });
      });
    }, 1000);
    timeouts.push(t0);

    return () => {
      timeouts.forEach(clearTimeout);
      cancelAnimationFrame(pulseRaf);
      cancelAnimationFrame(breathRaf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}


// ── Tap ripple ────────────────────────────────────────────────────────────
interface Ripple {
  id: number;
  x: number;
  y: number;
}

function TapRipples({ ripples }: { ripples: Ripple[] }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {ripples.map((r) => (
        <div key={r.id} style={{ position: "absolute", left: r.x, top: r.y }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 60 + i * 55,
                height: 60 + i * 55,
                borderRadius: "50%",
                border: "1.5px solid rgba(200,160,255,0.7)",
                transform: "translate(-50%, -50%) scale(0)",
                animation: `ripple-out 0.7s ${i * 90}ms ease-out forwards`,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(220,180,255,0.3) 0%, transparent 70%)",
              transform: "translate(-50%, -50%) scale(0)",
              animation: "flash-out 0.5s ease-out forwards",
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes ripple-out {
          0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(1); opacity: 0; }
        }
        @keyframes flash-out {
          0%   { transform: translate(-50%,-50%) scale(0); opacity: 1; }
          60%  { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%,-50%) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── Intro Screen ──────────────────────────────────────────────────────────
export function IntroScreen({ onStart }: { onStart: () => void }) {
  const [exiting, setExiting] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (exiting) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = rippleId.current++;
      setRipples((prev) => [...prev, { id, x, y }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 800);

      setExiting(true);
      setTimeout(onStart, 750);
    },
    [exiting, onStart]
  );

  return (
    <motion.div
      className="relative h-dvh w-full flex items-center justify-center overflow-hidden cursor-pointer select-none"
      style={{ backgroundColor: "#03010a" }}
      onClick={handleClick}
      animate={
        exiting
          ? { opacity: 0, scale: 1.06, filter: "blur(8px) brightness(2)" }
          : { opacity: 1, scale: 1, filter: "blur(0px) brightness(1)" }
      }
      transition={{ duration: 0.65, delay: exiting ? 0.12 : 0, ease: "easeIn" }}
    >
      {/* Night sky */}
      <StarField />
      <ShootingStars />

      {/* Fantasy elements */}
      <Constellation />

      {/* Tap ripples */}
      <TapRipples ripples={ripples} />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(2,0,12,0.85) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-7">
        {/* Logo */}
        <motion.div
          className="relative w-28 h-28 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div
            className="absolute rounded-full will-change-transform"
            style={{
              inset: "-12px",
              background: "radial-gradient(circle, rgba(140,60,255,0.18) 0%, transparent 70%)",
              filter: "blur(16px)",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="relative w-28 h-28 flex items-center justify-center rounded-full"
            style={{
              background: "radial-gradient(circle, #1a0033 0%, #0d001f 100%)",
              border: "1px solid rgba(124,58,237,0.22)",
            }}
          >
            <img
              src={logo}
              alt="Game logo"
              width={80}
              height={80}
              className="w-20 h-20 object-contain"
              style={{ filter: "drop-shadow(0 0 10px #a855f755)" }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-black tracking-[0.18em] uppercase text-center m-0"
          style={{
            fontSize: "2.1rem",
            lineHeight: 1,
            background: "linear-gradient(135deg, #c084fc 0%, #e879f9 45%, #818cf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
        >
          FSTBCS
        </motion.h1>

        {/* Hint — pulses 3× then settles */}
        <motion.p
          className="text-xs tracking-[0.28em] uppercase text-purple-300/50 m-0"
          style={{ height: "1.2em" }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.8, 0, 0.8, 0, 0.8, 0, 0.38],
          }}
          transition={{
            duration: 3.6,
            delay: 1.6,
            times: [0, 0.1, 0.22, 0.32, 0.44, 0.54, 0.66, 1],
            ease: "easeInOut",
            repeat: 0,
          }}
        >
          ◈ &nbsp; tap anywhere to enter &nbsp; ◈
        </motion.p>
      </div>
    </motion.div>
  );
}