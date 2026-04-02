import {
	BsFillHouseFill,
	BsFillSunFill,
	BsInfoCircleFill,
	BsMoonFill,
} from 'react-icons/bs';
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import React from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';

class Header extends React.Component {
	state = {
		menuVisible: null,
		theme: 'light',
	};

	render() {
		const theme = this.props.theme;
		const toggleTheme = this.props.toggleTheme;
		const menuClass = { null: '', true: 'show', false: 'hide' };

		return (
			<React.Fragment>
				<div className="header">
					<div id="menu">
						<IconContext.Provider value={{ className: 'menu-bar' }}>
							<RxHamburgerMenu onClick={this.toggleMenu} size={20} />
						</IconContext.Provider>
					</div>
					<div id="title">
						<div className="title-lockup">
							<div className="title-text">
								<h1>UB <span className="title-accent">StructStudio</span></h1>
							</div>
						</div>
					</div>
					<div className="gimmicks">
						<div id="theme">
							{theme === 'light' ? (
								<BsFillSunFill
									size={22}
									onClick={toggleTheme}
									color="#FFB81C"
									className="rotate-effect"
								/>
							) : (
								<BsMoonFill
									size={20}
									onClick={toggleTheme}
									color="#0073CF"
									className="rotate-effect"
								/>
							)}
						</div>
					</div>
				</div>
				<div className={`menu ${menuClass[this.state.menuVisible]}`}>
					<ul>
						<li>
							<Link to="/explore" onClick={this.toggleMenu}>
								<BsFillHouseFill size={20} />
								&nbsp;&nbsp;Home
							</Link>
						</li>
						<li>
							<Link to="/about" onClick={this.toggleMenu}>
								<BsInfoCircleFill size={20} />
								&nbsp;&nbsp;About
							</Link>
						</li>
					</ul>
				</div>
			</React.Fragment>
		);
	}

	toggleMenu = () => this.setState(state => ({ menuVisible: !state.menuVisible }));
}

export default Header;
