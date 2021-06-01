import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import { makeStyles, Card, CardContent, CardMedia, CardHeader } from '@material-ui/core';
import NotFoundPage from './NotFoundPage';
const useStyles = makeStyles({
	card: {
		maxWidth: 550,
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
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});

const Character = (props) => {
	const regex = /(&nbsp;|<([^>]+)>)/ig;
	const [ showData, setShowData ] = useState(undefined);
	const [ loading, setLoading ] = useState(true);
	const classes = useStyles();
	let id;
	let str;
	let str1;
	


	async function setURL(){
		const md5 = require('blueimp-md5');
		const publickey = 'f948df04b7c96a2ca3b7ab905b17c1aa';
		const privatekey = '19bfee307804ebc7b582e2391ef15aa96bf2261b';
		const ts = new Date().getTime();
		const stringToHash = ts + privatekey + publickey;
		const hash = md5(stringToHash);
		const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters?id='+props.match.params.id;
		const url = baseUrl + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

		try{
			const { data } = await axios.get(url);
			setShowData(data);
			setLoading(false);
		  }
		  catch(e){
			  console.log(e);
			setShowData(null);
			setLoading(false);
		}
	}
	useEffect(
		() => {
			console.log ("useEffect fired")
			async function fetchData() {
				setURL();
				
			}
			fetchData();
		},
		[ props.match.params.id ]
	);


	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	}
	else if (!showData){
		return (
			<NotFoundPage/>
		);
	} 
	
	else {
		let details=showData.data.results[0];

		if (details && details.description) {
			details.description = details.description.replace(regex, '');
		}
		return (
			
			<Card className={classes.card} variant='outlined'>
				<Link className='showlink' to='/characters/page/0'>Back to characters ...</Link>
				<CardHeader className={classes.titleHead} title={details.name} />
				<CardMedia
					className={classes.media}
					component='img'
					image={details.thumbnail && details.thumbnail.path ? details.thumbnail.path+"."+details.thumbnail.extension  : noImage}
					title='show image'
				/>

				<CardContent>
					

						
						<p className='title'>Description:</p>
								{details && details.description ? <p>{details.description}</p> : <p>N/A</p>}
						
						
						<p className='title'>Modified:</p>
								{details && details.modified ? <p>{details.modified}</p> : <p>N/A</p>}
						

						<p className='title'>Comics:</p>
								{details && details.comics.available ? <p>{details.comics.available}</p> : <p>N/A</p>}
							
								<p className='title'>All Comics:</p>
								
								{details && details.comics && details.comics.available >= 1 ? (
									<div>
										{details.comics.items.map((comic) => {
											str=comic.resourceURI;
											id=str.substring(str.length,str.lastIndexOf('/')+1);
											str1 = '/comics/'+id;
											return <p key={id}><a href={str1}>{comic.name}</a></p>;
										})}
									</div>
								 ) : (
									<p>N/A</p>
								)}

							
							    <p className='title'>Series:</p>
								{details && details.series.available ? <p>{details.series.available}</p> : <p>N/A</p>}
							
								<p className='title'>All series:</p>
								
								{details && details.series && details.series.available >= 1 ? (
									<div>
										{details.series.items.map((series) => {
											str=series.resourceURI;
											id=str.substring(str.length,str.lastIndexOf('/')+1);
											str1 = '/series/'+id;
											return <p key={id}><a href={str1}>{series.name}</a></p>;
										})}
									</div>
								 ) : (
									<p>N/A</p>
								)}


								<p className='title'>Stories:</p>
								{details && details.stories.available ? <p>{details.stories.available}</p> : <p>N/A</p>}
							
								<p className='title'>All stories:</p>
								{details && details.stories && details.stories.available >= 1 ? (
									<div>
										{details.stories.items.map((stories) => {
											str=stories.resourceURI;
											id=str.substring(str.length,str.lastIndexOf('/')+1);
											return <p key={id}>{stories.name}</p>;
										})}
									</div>
								 ) : (
									<p>N/A</p>
								)}
				
				</CardContent>
			</Card>
		);
	}
};

export default Character;
