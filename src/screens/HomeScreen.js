import '../css/App.css';
import { Link, Route, Routes, useSearchParams } from 'react-router-dom';
import { algoFilter, algoList, algoMap, relatedSearches } from '../AlgoList';
import AboutScreen from './AboutScreen';
import React, { useState, useEffect, useRef } from 'react';

// ── UB Brand Colors & Design Tokens ──
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

// ── Category accent colors ──
const CATEGORY_COLORS = {
	All: "#005BBB",
	Lists: "#3B82F6",
	"Linear Data Structures": "#06B6D4",
	"Trees and SkipList": "#10B981",
	HashMaps: "#F59E0B",
	"Sorting and Quickselect": "#EF4444",
	"Pattern Matching": "#EC4899",
	"Graph Algorithms": "#8B5CF6",
	"DP & Extras": "#F97316",
};

// ── Category icons ──
const CATEGORY_ICONS = {
	All: "✦",
	Lists: "→",
	"Linear Data Structures": "⟺",
	"Trees and SkipList": "⌥",
	HashMaps: "#",
	"Sorting and Quickselect": "⇅",
	"Pattern Matching": "≡",
	"Graph Algorithms": "◇",
	"DP & Extras": "◈",
};

// ── Build category map from algoFilter (static, outside component) ──
const idToCategoryMap = {};
algoFilter.forEach(item => { idToCategoryMap[item.id] = item.category; });

const allCategories = [...new Set(algoFilter.map(item => item.category))];

// ── Mini visualization components ──
function MiniArrayViz({ color }) {
	return (
		<div style={{ display: "flex", gap: 2, alignItems: "center" }}>
			{["A", "B", "C"].map((v, i) => (
				<div key={i} style={{
					width: 28, height: 28, borderRadius: 6,
					background: `${color}20`, border: `1.5px solid ${color}50`,
					display: "flex", alignItems: "center", justifyContent: "center",
					fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color,
				}}>
					{v}
				</div>
			))}
		</div>
	);
}

function MiniLinkedListViz({ color, doubly }) {
	return (
		<div style={{ display: "flex", gap: 4, alignItems: "center" }}>
			{["A", "B", "C"].map((v, i) => (
				<div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
					{doubly && i > 0 && (
						<span style={{ color: `${color}60`, fontSize: 10, fontFamily: "'JetBrains Mono'" }}>←</span>
					)}
					<div style={{
						width: 28, height: 28, borderRadius: "50%",
						background: `${color}20`, border: `1.5px solid ${color}50`,
						display: "flex", alignItems: "center", justifyContent: "center",
						fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color,
					}}>
						{v}
					</div>
					{i < 2 && (
						<span style={{ color: `${color}60`, fontSize: 10, fontFamily: "'JetBrains Mono'" }}>→</span>
					)}
				</div>
			))}
		</div>
	);
}

function MiniStackViz({ color }) {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
			{["C", "B", "A"].map((v, i) => (
				<div key={i} style={{
					width: 32, height: 18, borderRadius: 4,
					background: `${color}${i === 0 ? "30" : "15"}`,
					border: `1.5px solid ${color}${i === 0 ? "60" : "35"}`,
					display: "flex", alignItems: "center", justifyContent: "center",
					fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, color,
				}}>
					{v}
				</div>
			))}
		</div>
	);
}

function MiniTreeViz({ color }) {
	return (
		<svg width="64" height="48" viewBox="0 0 64 48">
			<line x1="32" y1="10" x2="16" y2="30" stroke={`${color}40`} strokeWidth="1.5" />
			<line x1="32" y1="10" x2="48" y2="30" stroke={`${color}40`} strokeWidth="1.5" />
			<circle cx="32" cy="10" r="8" fill={`${color}20`} stroke={`${color}60`} strokeWidth="1.5" />
			<circle cx="16" cy="32" r="7" fill={`${color}15`} stroke={`${color}40`} strokeWidth="1.5" />
			<circle cx="48" cy="32" r="7" fill={`${color}15`} stroke={`${color}40`} strokeWidth="1.5" />
			<text x="32" y="13" textAnchor="middle" fill={color} fontSize="8" fontFamily="JetBrains Mono" fontWeight="600">2</text>
			<text x="16" y="35" textAnchor="middle" fill={color} fontSize="7" fontFamily="JetBrains Mono" fontWeight="600">1</text>
			<text x="48" y="35" textAnchor="middle" fill={color} fontSize="7" fontFamily="JetBrains Mono" fontWeight="600">3</text>
		</svg>
	);
}

function MiniGraphViz({ color }) {
	return (
		<svg width="64" height="48" viewBox="0 0 64 48">
			<line x1="16" y1="12" x2="48" y2="12" stroke={`${color}35`} strokeWidth="1.5" />
			<line x1="16" y1="12" x2="16" y2="38" stroke={`${color}35`} strokeWidth="1.5" />
			<line x1="48" y1="12" x2="48" y2="38" stroke={`${color}35`} strokeWidth="1.5" />
			<line x1="16" y1="38" x2="48" y2="38" stroke={`${color}35`} strokeWidth="1.5" />
			<line x1="16" y1="12" x2="48" y2="38" stroke={`${color}25`} strokeWidth="1" strokeDasharray="3 2" />
			<circle cx="16" cy="12" r="7" fill={`${color}20`} stroke={`${color}60`} strokeWidth="1.5" />
			<circle cx="48" cy="12" r="7" fill={`${color}20`} stroke={`${color}60`} strokeWidth="1.5" />
			<circle cx="16" cy="38" r="7" fill={`${color}15`} stroke={`${color}40`} strokeWidth="1.5" />
			<circle cx="48" cy="38" r="7" fill={`${color}15`} stroke={`${color}40`} strokeWidth="1.5" />
			<text x="16" y="15" textAnchor="middle" fill={color} fontSize="7" fontFamily="JetBrains Mono" fontWeight="600">A</text>
			<text x="48" y="15" textAnchor="middle" fill={color} fontSize="7" fontFamily="JetBrains Mono" fontWeight="600">B</text>
			<text x="16" y="41" textAnchor="middle" fill={color} fontSize="7" fontFamily="JetBrains Mono" fontWeight="600">C</text>
			<text x="48" y="41" textAnchor="middle" fill={color} fontSize="7" fontFamily="JetBrains Mono" fontWeight="600">D</text>
		</svg>
	);
}

function MiniSortViz({ color }) {
	const heights = [14, 24, 18, 32, 10];
	return (
		<div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 36 }}>
			{heights.map((h, i) => (
				<div key={i} style={{
					width: 8, height: h, borderRadius: 2,
					background: `linear-gradient(to top, ${color}50, ${color}20)`,
					border: `1px solid ${color}35`,
				}} />
			))}
		</div>
	);
}

function getVizForDS(name, color) {
	if (name.includes("ArrayList")) return <MiniArrayViz color={color} />;
	if (name.includes("Singly")) return <MiniLinkedListViz color={color} />;
	if (name.includes("Doubly") || name.includes("Circularly")) return <MiniLinkedListViz color={color} doubly />;
	if (name.includes("Stack")) return <MiniStackViz color={color} />;
	if (name.includes("Queue") || name.includes("Deque")) return <MiniArrayViz color={color} />;
	if (name.includes("Tree") || name.includes("BST") || name.includes("AVL") || name.includes("Heap") || name.includes("Splay") || name.includes("TreeMap") || name.includes("LVA")) return <MiniTreeViz color={color} />;
	if (name.includes("SkipList")) return <MiniLinkedListViz color={color} />;
	if (name.includes("Graph") || name.includes("Disjoint") || name.includes("Floyd") || name.includes("BFS") || name.includes("DFS") || name.includes("Dijkstra") || name.includes("Prim") || name.includes("Kruskal")) return <MiniGraphViz color={color} />;
	if (name.includes("Sort") || name.includes("Quicksort") || name.includes("Quickselect") || name.includes("Merge") || name.includes("Radix") || name.includes("Insertion") || name.includes("Selection") || name.includes("Bubble") || name.includes("Cocktail") || name.includes("Bogo") || name.includes("Miracle") || name.includes("Sleep") || name.includes("Drop")) return <MiniSortViz color={color} />;
	if (name.includes("HashMap") || name.includes("Probing")) return <MiniArrayViz color={color} />;
	if (name.includes("Brute") || name.includes("Boyer") || name.includes("KMP") || name.includes("Rabin") || name.includes("Subsequence")) return <MiniLinkedListViz color={color} />;
	return <MiniTreeViz color={color} />;
}

// ── Reusable card rendering helper ──
function AlgoCard({ name, index, hoveredCard, setHoveredCard, hoverKey }) {
	const displayName = algoMap[name][0];
	const category = idToCategoryMap[name] || '';
	const catColor = CATEGORY_COLORS[category] || COLORS.ubBlue;
	const isHovered = hoveredCard === hoverKey;
	return (
		<Link
			key={name}
			to={`/${name}`}
			data-card-id={name}
			className="explore-card card-visible"
			style={{
				"--card-accent": catColor,
				"--card-accent-glow": `${catColor}08`,
				animationDelay: `${Math.min(index * 0.04, 0.6)}s`,
				opacity: 0,
				animationFillMode: "forwards",
				textDecoration: "none",
				color: "inherit",
			}}
			onMouseEnter={() => setHoveredCard(hoverKey)}
			onMouseLeave={() => setHoveredCard(null)}
		>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
				<span style={{
					fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
					color: catColor, background: `${catColor}12`,
					border: `1px solid ${catColor}25`,
					padding: "4px 10px", borderRadius: 6, fontWeight: 500,
				}}>
					{category}
				</span>
				<div style={{
					width: 28, height: 28, borderRadius: 8,
					background: isHovered ? `${catColor}20` : "rgba(255,255,255,0.04)",
					border: `1px solid ${isHovered ? `${catColor}40` : "rgba(255,255,255,0.08)"}`,
					display: "flex", alignItems: "center", justifyContent: "center",
					transition: "all 0.3s ease",
					transform: isHovered ? "translate(2px, -2px)" : "none",
				}}>
					<span style={{ fontSize: 13, color: isHovered ? catColor : COLORS.gray400, transition: "color 0.3s" }}>
						↗
					</span>
				</div>
			</div>
			<div style={{
				height: 52, display: "flex", alignItems: "center", justifyContent: "center",
				opacity: isHovered ? 1 : 0.7, transition: "opacity 0.3s",
			}}>
				{getVizForDS(displayName, catColor)}
			</div>
			<h3 style={{
				fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 600,
				letterSpacing: "-0.01em", color: COLORS.white, marginTop: "auto",
			}}>
				{displayName}
			</h3>
		</Link>
	);
}

const HomeScreen = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [scrollY, setScrollY] = useState(0);
	const [hoveredCard, setHoveredCard] = useState(null);
	const [visibleCards, setVisibleCards] = useState(new Set());
	const gridRef = useRef(null);

	/* Search Param Setter */
	const setQueryParam = (param, newFilter) => {
		if (newFilter && newFilter !== '') {
			searchParams.set(param, newFilter);
			setSearchParams(searchParams, { replace: true });
		} else {
			searchParams.delete(param);
			setSearchParams(searchParams, { replace: true });
		}
	};

	/* Search Param Getters */
	const algoFilterButton = searchParams.get('filter') ? searchParams.get('filter') : '';
	const dsaFilter = searchParams.get('q') ? searchParams.get('q') : '';

	const filterList =
		algoFilterButton === ''
			? algoList
			: algoFilter.filter(item => item.category === algoFilterButton).map(item => item.id);

	/* Creating the final list of algorithms */
	const filteredAlgoList = filterList.filter(name => {
		if (dsaFilter) {
			return (
				algoMap[name] &&
				(name.toLowerCase().includes(dsaFilter.toLowerCase()) ||
					algoMap[name][0].toLowerCase().includes(dsaFilter.toLowerCase()))
			);
		}
		return true;
	});

	function getRelatedAlgoList() {
		const relatedSet = new Set();
		if (dsaFilter) {
			for (const key in relatedSearches) {
				if (key.toLowerCase().includes(dsaFilter.toLowerCase())) {
					relatedSearches[key].forEach(value => {
						if (!filteredAlgoList.includes(value)) {
							relatedSet.add(value);
						}
					});
				}
			}
		}
		return Array.from(relatedSet);
	}

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
						setVisibleCards((prev) => new Set([...prev, entry.target.dataset.cardId]));
					}
				});
			},
			{ threshold: 0.1 }
		);
		if (gridRef.current) {
			gridRef.current.querySelectorAll("[data-card-id]").forEach((el) => observer.observe(el));
		}
		return () => observer.disconnect();
	}, [algoFilterButton, dsaFilter]);

	const accentColor = CATEGORY_COLORS[algoFilterButton] || CATEGORY_COLORS['All'];

	// Card grid list — skip category headers and entries missing from algoMap
	const cardList = filteredAlgoList.filter(name => name !== '---' && algoMap[name]);
	const relatedList = getRelatedAlgoList().filter(name => algoMap[name]);

	return (
		<div
			className="explore-dark-root"
			style={{
				background: COLORS.dark,
				minHeight: "100vh",
				color: COLORS.white,
				overflowX: "hidden",
			}}
		>
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes gridPulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .explore-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          padding: 28px 24px;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .explore-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--card-accent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .explore-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, var(--card-accent-glow) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
        }
        .explore-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.3);
        }
        .explore-card:hover::before { opacity: 1; }
        .explore-card:hover::after { opacity: 1; }

        .filter-tab {
          padding: 8px 18px;
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: ${COLORS.gray400};
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .filter-tab:hover {
          color: ${COLORS.white};
          background: rgba(255,255,255,0.05);
        }
        .filter-tab.active {
          color: ${COLORS.white};
          background: rgba(0, 91, 187, 0.15);
          border-color: rgba(0, 91, 187, 0.3);
        }

        .search-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 12px 16px 12px 44px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          color: ${COLORS.white};
          width: 100%;
          max-width: 360px;
          outline: none;
          transition: all 0.3s ease;
        }
        .search-input::placeholder {
          color: ${COLORS.gray400};
        }
        .search-input:focus {
          border-color: rgba(0, 91, 187, 0.4);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 3px rgba(0, 91, 187, 0.1);
        }

        .card-visible {
          animation: cardReveal 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .nav-link-explore {
          color: ${COLORS.gray200};
          text-decoration: none;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          font-size: 15px;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.25s ease;
        }
        .nav-link-explore:hover {
          color: ${COLORS.white};
          background: rgba(255,255,255,0.06);
        }

        .empty-state {
          animation: fadeInUp 0.5s ease forwards;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.dark}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.gray600}; border-radius: 3px; }
      `}</style>

			{/* ═══ GRID BACKGROUND ═══ */}
			<div style={{
				position: "fixed", inset: 0,
				backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
				backgroundSize: "60px 60px",
				animation: "gridPulse 6s ease-in-out infinite",
				pointerEvents: "none", zIndex: 0,
			}} />

			{/* Radial glows */}
			<div style={{
				position: "fixed", top: "-20%", right: "-15%",
				width: "55%", height: "80%",
				background: `radial-gradient(ellipse at center, ${accentColor}12 0%, transparent 65%)`,
				pointerEvents: "none", transition: "background 0.8s ease", zIndex: 0,
			}} />
			<div style={{
				position: "fixed", bottom: "-20%", left: "-10%",
				width: "45%", height: "60%",
				background: `radial-gradient(ellipse at center, rgba(240, 171, 0, 0.04) 0%, transparent 65%)`,
				pointerEvents: "none", zIndex: 0,
			}} />

			{/* ═══ NAVBAR ═══ */}
			<nav style={{
				position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
				padding: "0 48px", height: 72,
				display: "flex", alignItems: "center", justifyContent: "space-between",
				background: scrollY > 20 ? "rgba(10, 22, 40, 0.88)" : "transparent",
				backdropFilter: scrollY > 20 ? "blur(20px) saturate(180%)" : "none",
				borderBottom: scrollY > 20 ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
				transition: "all 0.35s ease",
			}}>
				<Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
					<span style={{
						fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18,
						letterSpacing: "-0.02em", color: COLORS.white,
					}}>
						<span style={{ color: COLORS.ubGold }}>UB</span> StructStudio
					</span>
				</Link>
				<div style={{ display: "flex", alignItems: "center", gap: 4 }}>
					<Link to="/" className="nav-link-explore">Home</Link>
					<Link to="/about" className="nav-link-explore">About</Link>
				</div>
			</nav>

			{/* ═══ ROUTES ═══ */}
			<Routes>
				<Route path="/about" element={<AboutScreen />} />
				<Route path="*" element={
					<main style={{
						position: "relative", zIndex: 1,
						maxWidth: 1320, margin: "0 auto",
						padding: "110px 48px 80px",
					}}>
						{/* ── Page header ── */}
						<div style={{ marginBottom: 48, animation: "fadeInUp 0.7s ease forwards" }}>
							<div style={{
								fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
								color: COLORS.ubGold, letterSpacing: "0.12em",
								textTransform: "uppercase", marginBottom: 12, fontWeight: 500,
							}}>
								// explore structures
							</div>
							<h1 style={{
								fontFamily: "'Outfit', sans-serif", fontSize: 48, fontWeight: 800,
								letterSpacing: "-0.035em", lineHeight: 1.1, marginBottom: 12,
							}}>
								Data Structures{" "}
								<span style={{ color: COLORS.gray400, fontWeight: 400 }}>&</span>{" "}
								<span style={{
									background: `linear-gradient(135deg, ${COLORS.ubGold} 0%, ${COLORS.ubGoldLight} 100%)`,
									WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
								}}>
									Algorithms
								</span>
							</h1>
							<p style={{
								fontFamily: "'Outfit', sans-serif", fontSize: 17,
								color: COLORS.gray400, maxWidth: 560, lineHeight: 1.6,
							}}>
								Interactive visualizations for every structure and algorithm. Pick one to start exploring.
							</p>
						</div>

						{/* ── Search + Filters ── */}
						<div style={{
							marginBottom: 40,
							animation: "fadeInUp 0.7s ease forwards",
							animationDelay: "0.1s",
							opacity: 0,
							animationFillMode: "forwards",
						}}>
							<div style={{ position: "relative", marginBottom: 20 }}>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{
									position: "absolute", left: 14, top: "50%",
									transform: "translateY(-50%)", pointerEvents: "none",
								}}>
									<circle cx="11" cy="11" r="7" stroke={COLORS.gray400} strokeWidth="2" />
									<path d="M16 16L21 21" stroke={COLORS.gray400} strokeWidth="2" strokeLinecap="round" />
								</svg>
								<input
									className="search-input"
									type="text"
									placeholder="Search data structures..."
									value={dsaFilter}
									onChange={(e) => setQueryParam('q', e.target.value)}
								/>
							</div>
							<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
								{["All", ...allCategories].map((cat) => {
									const isActive = cat === "All" ? algoFilterButton === '' : algoFilterButton === cat;
									return (
										<button
											key={cat}
											className={`filter-tab${isActive ? " active" : ""}`}
											style={isActive ? {
												background: `${CATEGORY_COLORS[cat]}18`,
												borderColor: `${CATEGORY_COLORS[cat]}40`,
												color: COLORS.white,
											} : {}}
											onClick={() => setQueryParam('filter', cat === "All" ? '' : cat)}
										>
											<span style={{ marginRight: 6, opacity: 0.7 }}>{CATEGORY_ICONS[cat]}</span>
											{cat}
										</button>
									);
								})}
							</div>
						</div>

						{/* ── Results count ── */}
						<div style={{
							fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
							color: COLORS.gray400, marginBottom: 20,
							display: "flex", alignItems: "center", gap: 8,
						}}>
							<span style={{
								width: 6, height: 6, borderRadius: "50%",
								background: accentColor, display: "inline-block",
							}} />
							{cardList.length} structure{cardList.length !== 1 ? "s" : ""} found
						</div>

						{/* ═══ CARD GRID ═══ */}
						<div ref={gridRef} style={{
							display: "grid",
							gridTemplateColumns: "repeat(3, 1fr)",
							gap: 18, marginBottom: 80,
						}}>
							{cardList.map((name, index) => (
								<AlgoCard
									key={name}
									name={name}
									index={index}
									hoveredCard={hoveredCard}
									setHoveredCard={setHoveredCard}
									hoverKey={name}
								/>
							))}
						</div>

						{/* Empty state */}
						{cardList.length === 0 && (
							<div className="empty-state" style={{ textAlign: "center", padding: "80px 0" }}>
								<div style={{
									width: 64, height: 64, borderRadius: 20,
									background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
									display: "flex", alignItems: "center", justifyContent: "center",
									margin: "0 auto 20px", fontSize: 28,
								}}>🔍</div>
								<h3 style={{
									fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 600, marginBottom: 8,
								}}>No structures found</h3>
								<p style={{
									fontFamily: "'Outfit', sans-serif", fontSize: 15, color: COLORS.gray400,
								}}>Try adjusting your search or filter to find what you're looking for.</p>
							</div>
						)}

						{/* Related Pages */}
						{relatedList.length > 0 && (
							<>
								<h1 style={{
									fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 600,
									color: COLORS.gray400, marginBottom: 20,
								}}>Related Pages</h1>
								<div style={{
									display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
									gap: 18, marginBottom: 80,
								}}>
									{relatedList.map((name, index) => (
										<AlgoCard
											key={name}
											name={name}
											index={index}
											hoveredCard={hoveredCard}
											setHoveredCard={setHoveredCard}
											hoverKey={`related-${name}`}
										/>
									))}
								</div>
							</>
						)}
					</main>
				} />
			</Routes>

			{/* ═══ CREATORS ═══ */}
			<section style={{
				position: "relative", zIndex: 1,
				padding: "40px 48px", maxWidth: 1320, margin: "0 auto",
			}}>
				<div style={{ textAlign: "center", marginBottom: 40 }}>
					<div style={{
						fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
						color: COLORS.ubGold, letterSpacing: "0.12em",
						textTransform: "uppercase", marginBottom: 12, fontWeight: 500,
					}}>
						// the team
					</div>
					<h2 style={{
						fontFamily: "'Outfit', sans-serif", fontSize: 32,
						fontWeight: 700, letterSpacing: "-0.03em",
					}}>Creators</h2>
				</div>
				<div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 48 }}>
					{[
						{ name: "Amaan Sheikh", role: "Cofounder", linkedin: "https://www.linkedin.com/in/amaansheikhme/", image: "/images/team/Amaan.JPG", imgScale: 2.2, imgPosition: "center 30%" },
						{ name: "Joshua Hu", role: "Cofounder", linkedin: "https://www.linkedin.com/in/joshua-cong-hu/", image: "/images/team/Josh.png" },
					].map((person) => (
						<a
							key={person.name}
							href={person.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							style={{
								display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
								padding: "28px 44px", background: "rgba(255,255,255,0.03)",
								border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18,
								textDecoration: "none", transition: "all 0.3s ease", cursor: "pointer",
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
							<div style={{
								width: 64, height: 64, borderRadius: "50%", overflow: "hidden",
								border: `2px solid ${COLORS.ubBlue}50`, marginBottom: 4,
								backgroundImage: `url(${person.image})`,
								backgroundSize: person.imgScale ? `${person.imgScale * 100}%` : "cover",
								backgroundPosition: person.imgPosition || "center top",
								backgroundRepeat: "no-repeat",
							}} />
							<span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700, color: COLORS.white, whiteSpace: "nowrap" }}>
								{person.name}
							</span>
							<span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: COLORS.gray400 }}>
								{person.role}
							</span>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginTop: 2 }}>
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
			<footer style={{
				position: "relative", zIndex: 1,
				padding: "28px 48px 36px", maxWidth: 1320, margin: "0 auto",
				borderTop: "1px solid rgba(255,255,255,0.06)",
				display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center",
			}}>
				<span style={{
					fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em",
				}}>
					<span style={{ color: COLORS.ubGold }}>UB</span> StructStudio
				</span>
				<p style={{
					fontFamily: "'Outfit', sans-serif", fontSize: 13,
					color: COLORS.gray400, lineHeight: 1.6, maxWidth: 600,
				}}>
					The Official CSE 250 Data Structures &amp; Algorithms Visualization Tool for University at Buffalo.
				</p>
				</footer>
		</div>
	);
};

export default HomeScreen;
