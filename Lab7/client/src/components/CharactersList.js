import React, { useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchShows from './SearchShows';
import noImage from '../img/download.jpeg';
import { Card, CardContent,Grid,makeStyles } from '@material-ui/core';
import NotFoundPage from './NotFoundPage';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import actions from '../action';


const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '300px',
		width: '300px'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});
const CharactersList = (props) => {
	const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();
	const dispatch = useDispatch();

	const showsData = useSelector((state) => state.marvelList);
	const search = useSelector((state) => state.marvelSearch);
	const pageNum = useSelector((state) => state.pages);
	let card = null;
	let page;
	
	
	const increasePageNum = async() => {
		page=parseInt(pageNum)+1;
		dispatch(actions.getPageNum(page));	
	};
	
	const decreasePageNum = async() => {
		page=parseInt(pageNum)-1;
		dispatch(actions.getPageNum(page));
	}

	async function constructURL(pageNo){

		try{
			const  result  = await axios.get('http://localhost:4000/characters/page/'+pageNo);
			return result.data;			
		  }
		  catch(e){
			return [];
		}
	}

	async function setSearchURL(search){

		try{
			const result = await axios.get('http://localhost:4000/characters/search/'+search);
			return result.data;
			
		  }
		  catch(e){
			return [];
		}
	}

useEffect(() => {
		async function fetchData() {
			let pageNo;
			pageNo=parseInt(props.match.params.page);
			dispatch(actions.getPageNum(props.match.params.page));
			let lastPage=pageNo+1;
			let pageNoString=(pageNo*20).toString();
			if(isNaN(pageNo) || !/^\d+$/.test(pageNoString.toString())){
				dispatch(actions.getMarvelList([],false,[]));
			}
			else
			{
			let returnData=await constructURL(pageNo);
			let lastPageExist =await constructURL((lastPage));
			dispatch(actions.getMarvelList(returnData,false,lastPageExist));
			console.log("test 111 " + search.searchTerm);
			}
		}
		fetchData();
	}, [props.match.params.page]);

useEffect(() => {
			console.log('search useEffect fired');
			console.log(search.searchTerm);
			async function fetchData() {
				let returnData= await setSearchURL(search.searchTerm);
			
				dispatch(actions.getSearchData(search.searchTerm,returnData,false));
			}
			if (search.searchTerm) {
				fetchData();
			}
		},
		[search.searchTerm,search.loading]
	);

	const buildCard = (show) => {
		if (show && show.description) {
			show.description = show.description.replace(regex, '').substring(0, 139) + '...';
		} 
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
				<Card className={classes.card}>
					
						<Link to={`/characters/${show.id}`}>
							
								<img className={classes.media} src={show.thumbnail && show.thumbnail.path ? show.thumbnail.path+"."+show.thumbnail.extension  : noImage}
								title='show image'
								alt={show.name}
							/>

							<CardContent>
								<p className="title">{show.name}</p>	
								<p>{show.description ? show.description : 'No Description'}</p>		
							</CardContent>
						</Link>
					
				</Card>
			</Grid>
		);
	};
	

	if (search.searchTerm) {
		card =
			search.searchData &&
			search.searchData.map((show) => {
				return buildCard(show);
			});
		
	} else {
		card =
			showsData.shows &&
			showsData.shows.map((show) => {
				return buildCard(show);
			});
	}

	if (showsData.loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	}
	else if(search.searchTerm){
	if (search.loading)
		{
			return (
				<div>
					<h2>Loading....</h2>
				</div>
			);
		}
	else if (search.searchData.length)
	    {
		return (
			<div>
				<SearchShows/>
				<br />
				<br />	        
				<Grid container className={classes.grid} spacing={5}>
					{card}
				</Grid>
			</div>
		);
	}

	else if(!search.searchData.length){
		return (
			<div>
				<SearchShows/>
			</div>
		);
	}
   }
	else if(pageNum===0){
		return (
			<div>
				<SearchShows/>
				<br />
				<br />
				<Link className='pagelink' onClick={increasePageNum}  to={`/characters/page/${pageNum+1}`} >
						Next
					</Link>
				<br/>
				<br/>
				
		        
				<Grid container className={classes.grid} spacing={5}>
					{card}
				</Grid>
			</div>
		);
}
	else if(showsData.shows.length && showsData.lastPageData.length)
		{
		return (

			<div>   
				<SearchShows/>
				<br />
				<br />
				
				<Link className='pagelink' onClick={decreasePageNum} to={`/characters/page/${pageNum-1}`} >
						Previous
					</Link>
				 <Link className='pagelink' onClick={increasePageNum}  to={`/characters/page/${pageNum+1}`} >
						Next
					</Link>
				<br/>
				<br/>
		        
				<Grid container className={classes.grid} spacing={5}>
					{card}
				</Grid>
			</div>
		);
	}

	else if(!showsData.shows.length){
		return (
			<NotFoundPage/>
		);
	}
	else if(!showsData.lastPageData.length){
	
		return (

			<div>
				<SearchShows/>
				<br />
				<br />
				<Link className='pagelink' onClick={decreasePageNum} to={`/characters/page/${pageNum-1}`} >
						Previous
					</Link>
				<br/>
				<br/>
				
		        
				<Grid container className={classes.grid} spacing={5}>
					{card}
				</Grid>
			</div>
		);
	}
};

export default CharactersList;
