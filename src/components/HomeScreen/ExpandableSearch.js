import React, { useRef, useState } from 'react';
import { BsSearch } from 'react-icons/bs';

/**
 * Search that shows only an icon until clicked/focused, then expands to reveal the input.
 */
const ExpandableSearch = ({ value, onChange, placeholder = 'Search...' }) => {
	const [expanded, setExpanded] = useState(!!value);
	const inputRef = useRef(null);

	const handleIconClick = () => {
		setExpanded(true);
		setTimeout(() => inputRef.current?.focus(), 0);
	};

	const handleBlur = () => {
		if (!value) setExpanded(false);
	};

	return (
		<div className={`expandable-search ${expanded ? 'expandable-search--expanded' : ''}`}>
			<button
				type="button"
				className="expandable-search__icon-btn"
				onClick={handleIconClick}
				aria-label="Open search"
			>
				<BsSearch className="expandable-search__icon" />
			</button>
			<input
				ref={inputRef}
				type="search"
				className="expandable-search__input"
				placeholder={placeholder}
				value={value}
				onChange={e => onChange(e.target.value)}
				onBlur={handleBlur}
				aria-label="Search algorithms"
			/>
		</div>
	);
};

export default ExpandableSearch;
