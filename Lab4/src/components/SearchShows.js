import React from 'react';
import Home from './Home';

const SearchShows = (props) => {
	const handleChange = (e) => {
		props.searchValue(e.target.value);
	};

	return (
		<div>
		<Home image="noImage"/>
		<form
			method='POST'
			onSubmit={(e) => {
				e.preventDefault();
			}}
			name='formName'
			className='center'
		>
			<label>
				<span>Search </span>
				<input autoComplete='off' type='text' name='searchTerm' onChange={handleChange} />
			</label>
		</form>
		</div>
	);
};

export default SearchShows;
