import './tailwind.css';
import './css/App.css';
import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AboutScreen from './screens/AboutScreen';
import AlgoScreen from './screens/AlgoScreen';
import HomeScreen from './screens/HomeScreen';
import { Landing } from './screens/Landing';
import BSTVisualization from './examples/bst-visualization';

const App = () => {
	useEffect(() => {
		document.body.setAttribute('data-theme', 'dark');
	}, []);

	return (
		<Router basename={process.env.PUBLIC_URL + '/'}>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/bst-mockup" element={<BSTVisualization />} />
				<Route path="/explore" element={<HomeScreen />} />
				<Route path="/about" element={<AboutScreen />} />
				<Route path="/:algo" element={<AlgoScreen />} />
				<Route path="*" element={<HomeScreen />} />
			</Routes>
		</Router>
	);
};

export default App;
