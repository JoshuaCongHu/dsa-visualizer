import { BsLinkedin } from 'react-icons/bs';
import React from 'react';

const COLORS = {
	ubBlue: "#005BBB",
	ubGold: "#F0AB00",
	white: "#FFFFFF",
	gray400: "#7A8A9E",
};

const creators = [
	{
		name: 'Amaan Sheikh',
		role: 'Cofounder',
		linkedin: 'https://www.linkedin.com/in/amaansheikhme/',
		image: '/images/team/Amaan.JPG',
		imgScale: 2.2,
		imgPosition: 'center 30%',
	},
	{
		name: 'Joshua Hu',
		role: 'Cofounder',
		linkedin: 'https://www.linkedin.com/in/joshua-cong-hu/',
		image: '/images/team/Josh.png',
	},
];

const Footer = () => (
	<div className="footer">
		<div className="creators-section">
			<h3 style={{ marginBottom: 12 }}>Creators</h3>
			<div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 16 }}>
				{creators.map(person => (
					<a
						key={person.name}
						href={person.linkedin}
						target="_blank"
						rel="noreferrer"
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 8,
							padding: '32px 48px',
							background: 'rgba(255,255,255,0.03)',
							border: '1px solid rgba(255,255,255,0.08)',
							borderRadius: 18,
							textDecoration: 'none',
							transition: 'all 0.3s ease',
							cursor: 'pointer',
							width: 220,
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
							e.currentTarget.style.borderColor = 'rgba(0, 91, 187, 0.3)';
							e.currentTarget.style.transform = 'translateY(-4px)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
							e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
							e.currentTarget.style.transform = 'translateY(0)';
						}}
					>
						<div style={{
							width: 64,
							height: 64,
							borderRadius: '50%',
							overflow: 'hidden',
							border: `2px solid ${COLORS.ubBlue}50`,
							marginBottom: 4,
							backgroundImage: `url(${person.image})`,
							backgroundSize: person.imgScale ? `${person.imgScale * 100}%` : 'cover',
							backgroundPosition: person.imgPosition || 'center top',
							backgroundRepeat: 'no-repeat',
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
			<p style={{ marginTop: 16, fontSize: '0.85em', opacity: 0.8 }}>
				The Official CSE 250 Data Structures &amp; Algorithms Visualization Tool
				for University at Buffalo.
			</p>
		</div>
	</div>
);

export default Footer;
