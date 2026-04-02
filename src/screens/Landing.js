import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// UB Brand Colors & Design Tokens
const COLORS = {
  ubBlue: "#005BBB",
  ubBlueDark: "#003D7A",
  ubBlueDeep: "#001F3F",
  ubGold: "#F0AB00",
  ubGoldLight: "#FFD54F",
  ubGoldDim: "#C68900",
  white: "#FFFFFF",
  offWhite: "#F4F7FA",
  gray100: "#E8EDF2",
  gray200: "#C5CDD6",
  gray400: "#7A8A9E",
  gray600: "#4A5568",
  gray800: "#1E293B",
  dark: "#0A1628",
};

const DSA_CATEGORIES = [
  {
    name: "Linear",
    icon: "→",
    items: ["ArrayList", "LinkedList", "Stack", "Queue", "Deque"],
    color: "#3B82F6",
    count: 12,
  },
  {
    name: "Trees",
    icon: "⌥",
    items: ["BST", "AVL", "B-Tree", "Heap", "SkipList"],
    color: "#10B981",
    count: 8,
  },
  {
    name: "Hash",
    icon: "#",
    items: ["HashMap", "Closed Hash", "Open Hash"],
    color: "#F59E0B",
    count: 6,
  },
  {
    name: "Sorting",
    icon: "⇅",
    items: ["QuickSelect", "MergeSort", "HeapSort", "BubbleSort"],
    color: "#EF4444",
    count: 10,
  },
  {
    name: "Graphs",
    icon: "◇",
    items: ["BFS", "DFS", "Dijkstra", "Kruskal", "Floyd"],
    color: "#8B5CF6",
    count: 9,
  },
  {
    name: "Strings",
    icon: "≡",
    items: ["KMP", "Boyer-Moore", "Brute Force", "Pattern Match"],
    color: "#EC4899",
    count: 5,
  },
];

// Animated node component for hero
function FloatingNode({ value, x, y, delay, size = 52 }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${COLORS.ubGold} 0%, ${COLORS.ubGoldDim} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
        fontSize: size * 0.38,
        color: COLORS.ubBlueDeep,
        boxShadow: `0 4px 20px rgba(240, 171, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.3)`,
        animation: `floatNode ${3 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        border: `2.5px solid ${COLORS.ubBlueDeep}`,
        zIndex: 2,
      }}
    >
      {value}
    </div>
  );
}

function EdgeLine({ x1, y1, x2, y2 }) {
  return (
    <line
      x1={`${x1}%`}
      y1={`${y1}%`}
      x2={`${x2}%`}
      y2={`${y2}%`}
      stroke={COLORS.ubGold}
      strokeWidth="2"
      strokeOpacity="0.25"
    />
  );
}

export function Landing() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = (id) => visibleSections.has(id);

  return (
    <div style={{ background: COLORS.dark, minHeight: "100vh", color: COLORS.white, overflowX: "hidden" }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        @keyframes floatNode {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 91, 187, 0.3); }
          50% { box-shadow: 0 0 40px rgba(0, 91, 187, 0.6); }
        }

        @keyframes gridPulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }

        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes countUp {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }

        .nav-link {
          color: ${COLORS.gray200};
          text-decoration: none;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          font-size: 15px;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.25s ease;
          letter-spacing: 0.01em;
        }
        .nav-link:hover {
          color: ${COLORS.white};
          background: rgba(255,255,255,0.06);
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          background: linear-gradient(135deg, ${COLORS.ubBlue} 0%, ${COLORS.ubBlueDark} 100%);
          color: white;
          border: none;
          border-radius: 14px;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 17px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          letter-spacing: 0.01em;
          position: relative;
          overflow: hidden;
        }
        .cta-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 91, 187, 0.45);
        }
        .cta-primary:hover::before { opacity: 1; }

        .cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          background: transparent;
          color: ${COLORS.gray200};
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .cta-secondary:hover {
          border-color: ${COLORS.ubGold};
          color: ${COLORS.ubGold};
          background: rgba(240, 171, 0, 0.05);
        }

        .category-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 28px;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .category-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--accent-color);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .category-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-4px);
        }
        .category-card:hover::before { opacity: 1; }
        .category-card.active {
          background: rgba(255,255,255,0.06);
          border-color: var(--accent-color);
        }
        .category-card.active::before { opacity: 1; }

        .feature-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 40px 32px;
          transition: all 0.3s ease;
          position: relative;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        .stat-number {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: 44px;
          background: linear-gradient(135deg, ${COLORS.ubGold} 0%, ${COLORS.ubGoldLight} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(0, 91, 187, 0.12);
          border: 1px solid rgba(0, 91, 187, 0.2);
          border-radius: 100px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: ${COLORS.ubGold};
          letter-spacing: 0.03em;
        }

        .topic-pill {
          padding: 6px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: ${COLORS.gray200};
          transition: all 0.2s;
        }
        .topic-pill:hover {
          background: rgba(240, 171, 0, 0.08);
          border-color: rgba(240, 171, 0, 0.2);
          color: ${COLORS.ubGold};
        }

        .section-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .section-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.dark}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.gray600}; border-radius: 3px; }
      `}</style>

      {/* ═══ NAVBAR ═══ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 48px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrollY > 50 ? "rgba(10, 22, 40, 0.85)" : "transparent",
          backdropFilter: scrollY > 50 ? "blur(20px) saturate(180%)" : "none",
          borderBottom: scrollY > 50 ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          transition: "all 0.35s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: COLORS.ubGold }}>UB</span> StructStudio
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/explore" className="cta-primary" style={{ padding: "10px 24px", fontSize: 14, borderRadius: 10 }}>
            Launch Studio
            <span style={{ fontSize: 16 }}>→</span>
          </Link>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "120px 48px 80px",
          overflow: "hidden",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            animation: "gridPulse 6s ease-in-out infinite",
          }}
        />

        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "70%",
            height: "120%",
            background: `radial-gradient(ellipse at center, rgba(0, 91, 187, 0.12) 0%, transparent 60%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            left: "-10%",
            width: "50%",
            height: "80%",
            background: `radial-gradient(ellipse at center, rgba(240, 171, 0, 0.06) 0%, transparent 60%)`,
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          {/* Left: Copy */}
          <div>
            <div
              style={{
                animation: "fadeInUp 0.8s ease forwards",
                animationDelay: "0.1s",
                opacity: 0,
              }}
            >
              <div className="tag" style={{ marginBottom: 28 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.ubGold }} />
                CSE 250 · University at Buffalo
              </div>
            </div>

            <h1
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.035em",
                marginBottom: 24,
                animation: "fadeInUp 0.8s ease forwards",
                animationDelay: "0.25s",
                opacity: 0,
              }}
            >
              Visualize
              <br />
              Data Structures.
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg, ${COLORS.ubGold} 0%, ${COLORS.ubGoldLight} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Master Algorithms.
              </span>
            </h1>

            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 18,
                lineHeight: 1.7,
                color: COLORS.gray400,
                maxWidth: 440,
                marginBottom: 40,
                animation: "fadeInUp 0.8s ease forwards",
                animationDelay: "0.4s",
                opacity: 0,
              }}
            >
              The official CSE 250 visualization platform at UB. Step through
              every data structure and algorithm — interactively, intuitively,
              and at your own pace.
            </p>

            <div
              style={{
                display: "flex",
                gap: 16,
                animation: "fadeInUp 0.8s ease forwards",
                animationDelay: "0.55s",
                opacity: 0,
              }}
            >
              <Link to="/explore" className="cta-primary">
                Launch StructStudio
                <span style={{ fontSize: 18 }}>→</span>
              </Link>
              <Link to="/about" className="cta-secondary">
                About
              </Link>
            </div>

            {/* Quick Stats */}
            <div
              style={{
                display: "flex",
                gap: 40,
                marginTop: 56,
                paddingTop: 32,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                animation: "fadeInUp 0.8s ease forwards",
                animationDelay: "0.7s",
                opacity: 0,
              }}
            >
              {[
                { num: "50+", label: "Structures & Algorithms" },
                { num: "6", label: "Topic Categories" },
                { num: "∞", label: "Step-throughs" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="stat-number" style={{ fontSize: 32, marginBottom: 4 }}>
                    {stat.num}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 13,
                      color: COLORS.gray400,
                      fontWeight: 400,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive Tree Visualization */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 480,
              animation: "fadeInUp 1s ease forwards",
              animationDelay: "0.5s",
              opacity: 0,
            }}
          >
            {/* Container */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 24,
                overflow: "hidden",
              }}
            >
              {/* Terminal-style header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
                <span
                  style={{
                    marginLeft: 12,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: COLORS.gray400,
                    fontWeight: 500,
                  }}
                >
                  binary_search_tree.viz
                </span>
              </div>

              {/* Tree visualization */}
              <div style={{ position: "relative", width: "100%", height: "calc(100% - 42px)" }}>
                <svg
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <EdgeLine x1={50} y1={18} x2={30} y2={40} />
                  <EdgeLine x1={50} y1={18} x2={70} y2={40} />
                  <EdgeLine x1={30} y1={40} x2={20} y2={65} />
                  <EdgeLine x1={30} y1={40} x2={40} y2={65} />
                  <EdgeLine x1={70} y1={40} x2={60} y2={65} />
                  <EdgeLine x1={70} y1={40} x2={80} y2={65} />
                  <EdgeLine x1={80} y1={65} x2={75} y2={85} />
                </svg>

                <FloatingNode value={8} x={46} y={8} delay={0} size={52} />
                <FloatingNode value={3} x={26} y={30} delay={0.4} size={48} />
                <FloatingNode value={10} x={66} y={30} delay={0.8} size={48} />
                <FloatingNode value={1} x={16} y={55} delay={1.2} size={42} />
                <FloatingNode value={6} x={36} y={55} delay={0.6} size={42} />
                <FloatingNode value={9} x={56} y={55} delay={1} size={42} />
                <FloatingNode value={14} x={76} y={55} delay={0.3} size={42} />
                <FloatingNode value={13} x={71} y={76} delay={0.9} size={38} />

                {/* Operation badge */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    right: 16,
                    padding: "10px 16px",
                    background: "rgba(0, 91, 187, 0.15)",
                    border: "1px solid rgba(0, 91, 187, 0.25)",
                    borderRadius: 10,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: COLORS.ubGold,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ color: COLORS.gray400 }}>$</span>
                  bst.insert(13) <span style={{ color: "#28C840", marginLeft: "auto" }}>✓ balanced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section
        id="categories"
        data-animate
        className={`section-reveal ${isVisible("categories") ? "visible" : ""}`}
        style={{ padding: "80px 48px 100px", maxWidth: 1280, margin: "0 auto" }}
      >
        <div style={{ marginBottom: 56 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: COLORS.ubGold,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 12,
              fontWeight: 500,
            }}
          >
            // explore topics
          </div>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            50+ structures.
            <br />
            <span style={{ color: COLORS.gray400 }}>One platform to master them all.</span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {DSA_CATEGORIES.map((cat, i) => (
            <div
              key={cat.name}
              className={`category-card ${activeCategory === i ? "active" : ""}`}
              style={{ "--accent-color": cat.color, transitionDelay: `${i * 0.05}s` }}
              onClick={() => setActiveCategory(activeCategory === i ? null : i)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${cat.color}15`,
                    border: `1px solid ${cat.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    color: cat.color,
                  }}
                >
                  {cat.icon}
                </div>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: COLORS.gray400,
                    background: "rgba(255,255,255,0.04)",
                    padding: "4px 10px",
                    borderRadius: 6,
                  }}
                >
                  {cat.count} topics
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 20,
                  fontWeight: 600,
                  marginBottom: 12,
                  letterSpacing: "-0.01em",
                }}
              >
                {cat.name}
              </h3>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {cat.items.map((item) => (
                  <span key={item} className="topic-pill">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ═══ CREATORS ═══ */}
      <section
        id="creators"
        data-animate
        className={`section-reveal ${isVisible("creators") ? "visible" : ""}`}
        style={{ padding: "60px 48px 40px", maxWidth: 1280, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: COLORS.ubGold,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 12,
              fontWeight: 500,
            }}
          >
            // the team
          </div>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            Creators
          </h2>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 48 }}>
          {[
            { name: "Amaan Sheikh", role: "Cofounder", linkedin: "https://www.linkedin.com/in/amaansheikhme/", image: "/images/team/Amaan.JPG", imgScale: 2.2, imgPosition: "center 30%" },
            { name: "Joshua Hu",    role: "Cofounder", linkedin: "https://www.linkedin.com/in/joshua-cong-hu/", image: "/images/team/Josh.png" },
          ].map((person) => (
            <a
              key={person.name}
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="creator-card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "32px 48px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 18,
                textDecoration: "none",
                transition: "all 0.3s ease",
                cursor: "pointer",
                width: 220,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(0, 91, 187, 0.3)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `2px solid ${COLORS.ubBlue}50`,
                  marginBottom: 4,
                  backgroundImage: `url(${person.image})`,
                  backgroundSize: person.imgScale ? `${person.imgScale * 100}%` : "cover",
                  backgroundPosition: person.imgPosition || "center top",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 19,
                  fontWeight: 700,
                  color: COLORS.white,
                  whiteSpace: "nowrap",
                }}
              >
                {person.name}
              </span>
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 14,
                  color: COLORS.gray400,
                  fontWeight: 400,
                }}
              >
                {person.role}
              </span>
              {/* LinkedIn icon */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                style={{ marginTop: 4 }}
              >
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  fill="#0A66C2"
                />
              </svg>
            </a>
          ))}
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer
        style={{
          padding: "32px 48px 40px",
          maxWidth: 1280,
          margin: "0 auto",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: COLORS.ubGold }}>UB</span> StructStudio
        </span>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 14,
            color: COLORS.gray400,
            lineHeight: 1.6,
            maxWidth: 600,
          }}
        >
          The Official CSE 250 Data Structures & Algorithms Visualization Tool for University at Buffalo.
        </p>
      </footer>
    </div>
  );
}
