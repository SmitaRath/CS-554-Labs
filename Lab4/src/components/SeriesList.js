import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchShows from './SearchShows';
import noImage from '../img/download.jpeg';
import { Card,  CardContent, Grid, makeStyles } from '@material-ui/core';
import '../App.css';
import NotFoundPage from './NotFoundPage';
const md5 = require('blueimp-md5');

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
const SeriesList = (props) => {
	const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();
	const [ loading, setLoading ] = useState(true);
	const [ searchData, setSearchData ] = useState([]);
	const [ showsData, setShowsData ] = useState([]);
	const [ searchTerm, setSearchTerm ] = useState('');
	let card = null;
	const [ pageNum, setPageNum ] = useState(parseInt(props.match.params.page));
	const [ lastPageData, setlastPageData ] = useState('');
	let page;
	
	
	const increasePageNum = async() => {
		page=pageNum+1;
		setSearchTerm('');
	    setPageNum(page);		
	};
	
	const decreasePageNum = async() => {
		page=pageNum-1;
		setSearchTerm('');
		setPageNum(page);
	}

	async function constructURL(skipNumber){
		
		const publickey = 'f948df04b7c96a2ca3b7ab905b17c1aa';
		const privatekey = '19bfee307804ebc7b582e2391ef15aa96bf2261b';
		const ts = new Date().getTime();
		const stringToHash = ts + privatekey + publickey;
		const hash = md5(stringToHash);
		const baseUrl = 'https://gateway.marvel.com:443/v1/public/series';
		const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash +"&offset="+skipNumber;
		try{
			const { data } = await axios.get(url);
			setLoading(false);
			return data;
			
		  }
		  catch(e){
			setLoading(false);
			return null;
		}
	}

	async function setSearchURL(search){
		const publickey = 'f948df04b7c96a2ca3b7ab905b17c1aa';
		const privatekey = '19bfee307804ebc7b582e2391ef15aa96bf2261b';
		const ts = new Date().getTime();
		const stringToHash = ts + privatekey + publickey;
		const hash = md5(stringToHash);
		const baseUrl = 'https://gateway.marvel.com:443/v1/public/series?titleStartsWith='+search;
		const url = baseUrl + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
		try{
			const { data } = await axios.get(url);
			setLoading(false);
			return data;
			
		  }
		  catch(e){
			setLoading(false);
			return null;
		}
	}

useEffect(() => {
		async function fetchData() {
			let pageNo;
			setLoading(true);
			setSearchTerm('');
			pageNo=parseInt(props.match.params.page);
			setPageNum(parseInt(props.match.params.page));
			let lastPage=pageNo+1;
			let pageNoString=(pageNo*20).toString();
			if(isNaN(pageNo) || !/^\d+$/.test(pageNoString.toString())){
				setShowsData([]);
				setlastPageData([]);
				setLoading(false);
			}
			else
			{
			let returnData=await constructURL(pageNo*20);
			setShowsData(returnData.data.results);
			let lastPageExist =await constructURL((lastPage*20));
			setlastPageData(lastPageExist.data.results);
			}
		}
		fetchData();
	}, [props.match.params.page]);

useEffect(() => {
			console.log('search useEffect fired');
			async function fetchData() {
				let returnData= await setSearchURL(searchTerm);
				setSearchData(returnData.data.results);
				console.log("after search call")
			}
			if (searchTerm) {
				fetchData();
			}
		},
		[ searchTerm ]
	);

	const searchValue = async (value) => {
		setSearchTerm(value);
	};
	const buildCard = (show) => {
		if (show && show.description) {
			show.description = show.description.replace(regex,'').substring(0, 139) + '...';
		} 
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
				<Card className={classes.card} variant='outlined'>
				
						<Link to={`/series/${show.id}`}>
							<img
								className={classes.media}
								src={show.thumbnail && show.thumbnail.path ? show.thumbnail.path+"."+show.thumbnail.extension  : noImage}
								title='show image'
                                alt={show.title}
							/>

							<CardContent>
							<p className="title">{show.title}</p>
							<p>{show.description ? show.description : 'No Description'}</p>
									
								
							</CardContent>
						</Link>
				
				</Card>
			</Grid>
		);
	};

	if (searchTerm) {
		card =
			searchData &&
			searchData.map((show) => {
				return buildCard(show);
			});
		
	} else {
		card =
			showsData &&
			showsData.map((show) => {
				return buildCard(show);
			});
	}

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	}
	else if(searchTerm && searchData.length){
		return (
			<div>
				<SearchShows searchValue={searchValue} />
				<br />
				<br />	        
				<Grid container className={classes.grid} spacing={5}>
					{card}
				</Grid>
			</div>
		);
	}
	else if(pageNum===0){
		console.log("hi");
		console.log(card);
		return (
			<div>
				<SearchShows searchValue={searchValue} />
				<br />
				<br />
				<Link className='pagelink' onClick={increasePageNum}  to={`/series/page/${pageNum+1}`} >
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
	else if(showsData.length && lastPageData.length)
		{
		
		return (

			<div>   
				<SearchShows searchValue={searchValue} />
				<br />
				<br />
				
				<Link className='pagelink' onClick={decreasePageNum} to={`/series/page/${pageNum-1}`} >
						Previous
					</Link>
				 <Link className='pagelink' onClick={increasePageNum}  to={`/series/page/${pageNum+1}`} >
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
	else if(!showsData.length){
		return (
			<NotFoundPage/>
		);
	}
	else if(!lastPageData.length){
	
		return (

			<div>
				<SearchShows searchValue={searchValue} />
				<br />
				<br />
				<Link className='pagelink' onClick={decreasePageNum} to={`/series/page/${pageNum-1}`} >
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

export default SeriesList;
