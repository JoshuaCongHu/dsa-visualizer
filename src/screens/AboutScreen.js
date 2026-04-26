import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const COLORS = {
	ubBlue: "#005BBB",
	ubBlueDark: "#003D7A",
	ubBlueDeep: "#001F3F",
	ubGold: "#F0AB00",
	ubGoldLight: "#FFD54F",
	white: "#FFFFFF",
	gray200: "#C5CDD6",
	gray400: "#7A8A9E",
	dark: "#0A1628",
};

const AboutScreen = () => {
	const [scrollY, setScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => setScrollY(window.scrollY);
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div style={{ background: COLORS.dark, minHeight: "100vh", color: COLORS.white, overflowX: "hidden" }}>
			<style>{`
				* { margin: 0; padding: 0; box-sizing: border-box; }

				@keyframes fadeInUp {
					from { opacity: 0; transform: translateY(30px); }
					to { opacity: 1; transform: translateY(0); }
				}

				.about-nav-link {
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
				.about-nav-link:hover {
					color: ${COLORS.white};
					background: rgba(255,255,255,0.06);
				}

				.about-launch-btn {
					display: inline-flex;
					align-items: center;
					gap: 10px;
					padding: 10px 24px;
					background: linear-gradient(135deg, ${COLORS.ubBlue} 0%, ${COLORS.ubBlueDark} 100%);
					color: white;
					border: none;
					border-radius: 10px;
					font-family: 'Outfit', sans-serif;
					font-weight: 600;
					font-size: 14px;
					cursor: pointer;
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
					text-decoration: none;
					letter-spacing: 0.01em;
				}
				.about-launch-btn:hover {
					transform: translateY(-2px);
					box-shadow: 0 8px 32px rgba(0, 91, 187, 0.45);
				}

				.about-content-card {
					background: rgba(255,255,255,0.02);
					border: 1px solid rgba(255,255,255,0.06);
					border-radius: 20px;
					padding: 48px;
					transition: all 0.3s ease;
				}

				.about-link {
					color: ${COLORS.ubBlue};
					text-decoration: none;
					transition: color 0.2s;
				}
				.about-link:hover {
					color: ${COLORS.ubGold};
					text-decoration: underline;
				}

				::-webkit-scrollbar { width: 6px; }
				::-webkit-scrollbar-track { background: ${COLORS.dark}; }
				::-webkit-scrollbar-thumb { background: #4A5568; border-radius: 3px; }
			`}</style>

			{/* NAVBAR */}
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
				<Link
					to="/"
					style={{
						fontFamily: "'Outfit', sans-serif",
						fontWeight: 700,
						fontSize: 18,
						letterSpacing: "-0.02em",
						textDecoration: "none",
						color: COLORS.white,
					}}
				>
					<span style={{ color: COLORS.ubGold }}>UB</span> StructStudio
				</Link>

				<div style={{ display: "flex", alignItems: "center", gap: 4 }}>
					<Link to="/about" className="about-nav-link">About</Link>
					<Link to="/explore" className="about-launch-btn">
						Launch Studio
						<span style={{ fontSize: 16 }}>→</span>
					</Link>
				</div>
			</nav>

			{/* MAIN CONTENT */}
			<main
				style={{
					maxWidth: 860,
					margin: "0 auto",
					padding: "120px 48px 80px",
					animation: "fadeInUp 0.8s ease forwards",
				}}
			>
				{/* Header */}
				<div style={{ marginBottom: 48 }}>
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
						// about this tool
					</div>
					<h1
						style={{
							fontFamily: "'Outfit', sans-serif",
							fontSize: 48,
							fontWeight: 800,
							letterSpacing: "-0.035em",
							lineHeight: 1.1,
						}}
					>
						About{" "}
						<span
							style={{
								background: `linear-gradient(135deg, ${COLORS.ubGold} 0%, ${COLORS.ubGoldLight} 100%)`,
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
							}}
						>
							UB StructStudio
						</span>
					</h1>
				</div>

				{/* Content card */}
				<div className="about-content-card">
					{/* Origin story label */}
					<div
						style={{
							fontFamily: "'JetBrains Mono', monospace",
							fontSize: 11,
							color: COLORS.ubGold,
							letterSpacing: "0.12em",
							textTransform: "uppercase",
							marginBottom: 20,
							fontWeight: 500,
						}}
					>
						// the origin story
					</div>

					<p
						style={{
							fontFamily: "'Outfit', sans-serif",
							fontSize: 17,
							lineHeight: 1.85,
							color: COLORS.gray200,
							marginBottom: 24,
						}}
					>
						Sophomore year, CSE 250. The class was fine, but nothing really clicked visually.
						To actually get it,{" "}
						<a href="https://www.amaans.dev" target="_blank" rel="noopener noreferrer" className="about-link">Amaan</a>
						{" "}and{" "}
						<a href="https://www.linkedin.com/in/joshua-cong-hu/" target="_blank" rel="noopener noreferrer" className="about-link">Joshua</a>
						{" "}had to dig up YouTube videos, random tools online, and grind the same concepts
						over and over until they finally stuck. A lot of extra work for something that
						could've just been shown directly.
					</p>

					<p
						style={{
							fontFamily: "'Outfit', sans-serif",
							fontSize: 17,
							lineHeight: 1.85,
							color: COLORS.gray200,
							marginBottom: 24,
						}}
					>
						A couple semesters later, after talking to some underclassmen fellows in{" "}
						<a href="https://www.ubforge.com" target="_blank" rel="noopener noreferrer" className="about-link">UB Forge</a>
						{" "}and{" "}
						<a href="https://buffalo.campuslabs.com/engage/organization/ub-dsml" target="_blank" rel="noopener noreferrer" className="about-link">UB DSML Club</a>
						, they looked around and the same gap was still there for every student coming up
						behind them. No clean tool built specifically for UB students. So they built one.
					</p>

					{/* Pull quote */}
					<div
						style={{
							margin: "32px 0",
							padding: "24px 32px",
							borderLeft: `4px solid ${COLORS.ubGold}`,
							background: "rgba(240, 171, 0, 0.05)",
							borderRadius: "0 12px 12px 0",
						}}
					>
						<p
							style={{
								fontFamily: "'Outfit', sans-serif",
								fontSize: 18,
								fontWeight: 600,
								fontStyle: "italic",
								color: COLORS.white,
								lineHeight: 1.7,
							}}
						>
							"At some point you just stop searching and start building."
						</p>
					</div>

					<p
						style={{
							fontFamily: "'Outfit', sans-serif",
							fontSize: 17,
							lineHeight: 1.85,
							color: COLORS.gray200,
							marginBottom: 24,
						}}
					>
						So they built it. Not for a grade. Not because a professor asked them to.
						Because they genuinely believed that if you could <em style={{ fontStyle: "normal", color: COLORS.white, fontWeight: 600 }}>see</em> a data structure move,
						you'd understand it in a way no textbook could replicate. Visualization isn't
						a shortcut, it's how the brain actually builds intuition. And intuition is what
						separates a student who passes from an engineer who ships.
					</p>

					<p
						style={{
							fontFamily: "'Outfit', sans-serif",
							fontSize: 17,
							lineHeight: 1.85,
							color: COLORS.gray200,
							marginBottom: 32,
						}}
					>
						UB StructStudio is the result of that conviction. It's a tool built by UB students,
						for UB students, tailored to the exact structures and algorithms covered in your
						courses. Whether you're prepping for an exam, trying to finally understand why
						heaps work the way they do, or just satisfying your curiosity at 2am before a
						deadline, this is your playground.
					</p>

					</div>

				{/* Creators */}
				<div style={{ marginTop: 64, textAlign: "center" }}>
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
							fontSize: 28,
							fontWeight: 700,
							letterSpacing: "-0.03em",
							marginBottom: 32,
						}}
					>
						Creators
					</h2>

					<div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
						{[
							{ name: "Amaan Sheikh", role: "Cofounder", linkedin: "https://www.linkedin.com/in/amaansheikhme/", image: `${process.env.PUBLIC_URL}/images/team/Amaan.JPG`, imgScale: 2.2, imgPosition: "center 30%" },
							{ name: "Joshua Hu", role: "Cofounder", linkedin: "https://www.linkedin.com/in/joshua-cong-hu/", image: `${process.env.PUBLIC_URL}/images/team/Josh.png` },
						].map((person) => (
							<a
								key={person.name}
								href={person.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: 8,
									padding: "32px 48px",
									width: 220,
									background: "rgba(255,255,255,0.03)",
									border: "1px solid rgba(255,255,255,0.08)",
									borderRadius: 18,
									textDecoration: "none",
									transition: "all 0.3s ease",
									cursor: "pointer",
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
									border: `2px solid ${COLORS.ubBlue}50`, marginBottom: 4, flexShrink: 0,
									backgroundImage: `url(${person.image})`,
									backgroundSize: person.imgScale ? `${person.imgScale * 100}%` : "cover",
									backgroundPosition: person.imgPosition || "center top",
									backgroundRepeat: "no-repeat",
								}} />
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
								<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginTop: 4 }}>
									<path
										d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
										fill="#0A66C2"
									/>
								</svg>
							</a>
						))}
					</div>
				</div>
			</main>

			{/* FOOTER */}
			<footer
				style={{
					padding: "32px 48px 40px",
					maxWidth: 860,
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
					UB Struct Studio, the official University at Buffalo data structures and algorithms visualization tool.
				</p>
			</footer>
		</div>
	);
};

export default AboutScreen;
