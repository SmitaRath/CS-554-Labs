import React from 'react';
import Home from './Home';
import { useDispatch } from 'react-redux';
import actions from '../action';

const SearchShows = (props) => {
	const dispatch = useDispatch();


	return (
		<div>
		<Home image="noImage"/>
		<form
			method='POST'
			onSubmit={(e) => {
				
				e.preventDefault();
				if(e.target.elements.searchTerm.value=="")
				{
					alert("Please provide search value");
				}
				else{
				dispatch(actions.getSearchData(e.target.elements.searchTerm.value,[],true));
				}
			}}
			name='formName'
			className='center'
		>
			<label>
				<input autoComplete='off' type='text' name='searchTerm'/>
				<button className='pagelink'>Search</button>
			</label>
		</form>
		</div>
	);
};

export default SearchShows;
