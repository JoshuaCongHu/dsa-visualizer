import '../css/AlgoScreen.css';
import '../css/App.css';

import { Link, useLocation } from 'react-router-dom';
import AlgoSection from '../components/AlgoScreen/AlgoSection';
import AlgorithmNotFound404 from '../components/AlgorithmNotFound404';
import React from 'react';
import { algoMap, algoFilter } from '../AlgoList';

// Build a lookup: algoKey -> category name
const categoryLookup = {};
algoFilter.forEach(({ id, category }) => {
	categoryLookup[id] = category;
});

const AlgoScreen = () => {
	const location = useLocation();
	const algoName = location.pathname.slice(1);
	const algoDetails = algoMap[algoName];

	if (!algoDetails) {
		return <AlgorithmNotFound404 />;
	}

	// eslint-disable-next-line no-unused-vars
	const [menuDisplayName, _algoClass, _hasPseudocode, verboseDisplayName] = algoDetails;
	const isQuickselect = menuDisplayName === 'Quickselect / kᵗʰ Select';
	const header = verboseDisplayName || menuDisplayName;
	const category = categoryLookup[algoName] || 'Algorithms';

	return (
		<div className="VisualizationMainPage">
			<div id="container">
				{/* Navbar */}
				<div className="algo-navbar">
					<Link to="/explore" className="algo-navbar-logo">
						<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<circle cx="12" cy="5" r="3"/>
							<line x1="12" y1="8" x2="12" y2="13"/>
							<circle cx="6" cy="19" r="3"/>
							<circle cx="18" cy="19" r="3"/>
							<line x1="12" y1="13" x2="6" y2="16"/>
							<line x1="12" y1="13" x2="18" y2="16"/>
						</svg>
						UB StructStudio
					</Link>
				</div>

				{/* Breadcrumb */}
				<div className="algo-breadcrumb">
					<Link to="/explore">Home</Link>
					<span className="algo-breadcrumb-separator">&rsaquo;</span>
					<span className="algo-category-badge">{category}</span>
					<span className="algo-breadcrumb-separator">&rsaquo;</span>
					<span className="algo-breadcrumb-current">
						{isQuickselect ? (
							<>Quickselect / k<sup>th</sup> Select</>
						) : (
							header
						)}
					</span>
				</div>

				<AlgoSection />
			</div>
		</div>
	);
};

export default AlgoScreen;
