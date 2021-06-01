import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import { makeStyles, Card, CardContent, CardMedia,CardHeader } from '@material-ui/core';
import '../App.css';
import { Redirect} from 'react-router-dom';
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

const Series = (props) => {
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
		const baseUrl = 'https://gateway.marvel.com:443/v1/public/series?id='+props.match.params.id;
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
			<Redirect to="/404" component={NotFoundPage}/>
		);
	} 
	
	else {
		let details=showData.data.results[0];
		return (
			<Card className={classes.card} variant='outlined'>
            <Link className='showlink' to='/series/page/0'>Back to Series ...</Link>
				<CardHeader className={classes.titleHead} title={details.title} />
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
						

                        <p className='title'>Start Year:</p>
								{details && details.startYear ? <p>{details.startYear}</p> : <p>N/A</p>}
						

                        <p className='title'>End Year:</p>
								{details && details.endYear ? <p>{details.endYear}</p> : <p>N/A</p>}
						

                        <p className='title'>Rating:</p>
								{details && details.rating ? <p>{details.rating}</p> : <p>N/A</p>}
						

							<p className='title'>Creators:</p>
								{details && details.creators ? <p>{details.creators.available}</p> : <p>N/A</p>}
							
								<p className='title'>All Creators:</p>
								
								{details && details.creators && details.creators.available >= 1 ? (
									<div>
										{details.creators.items.map((obj) => {
											str=obj.resourceURI;
											id=str.substring(str.length,str.lastIndexOf('/')+1);
											return <p key={id}>
                                                <br></br>
                                                Name : {obj.name}  Role : {obj.role}
                                                </p>;
										})}
									</div>
								 ) : (
									<p>N/A</p>
								)}


								<p className='title'>Characters:</p>
								{details && details.characters ? <p>{details.characters.available}</p> : <p>N/A</p>}
							
								<p className='title'>All Characters:</p>
								
								{details && details.characters && details.characters.available >= 1 ? (
									<div>
										{details.characters.items.map((obj) => {
											str=obj.resourceURI;
											id=str.substring(str.length,str.lastIndexOf('/')+1);
											str1 = '/characters/'+id;
											return <p key={id}><a href={str1}>{obj.name}</a></p>;
										})}
									</div>
								 ) : (
									<p>N/A</p>
								)}


							<p className='title'>Stories:</p>
								{details && details.stories ? <p>{details.stories.available}</p> : <p>N/A</p>}
							
								<p className='title'>All Stories:</p>
								
								{details && details.stories && details.stories.available >= 1 ? (
									<div>
										{details.stories.items.map((obj) => {
											str=obj.resourceURI;
											id=str.substring(str.length,str.lastIndexOf('/')+1);
											return <p key={id}>
                                                
                                                Name : {obj.name}   Type : {obj.type} 
                                                </p>;
										})}
									</div>
								 ) : (
									<p>N/A</p>
								)}

                                <p className='title'>Comics:</p>
								{details && details.comics ? <p>{details.comics.available}</p> : <p>N/A</p>}
							
								<p className='title'>All Comics:</p>
								
								{details && details.comics && details.comics.available >= 1 ? (
									<div>
                                    {details.comics.items.map((obj) => {
                                        str=obj.resourceURI;
                                        id=str.substring(str.length,str.lastIndexOf('/')+1);
                                        str1 = '/comics/'+id;
                                        return <p key={id}><a href={str1}>{obj.name}</a></p>;
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

export default Series;
