import React from 'react';
import '../App.css';
import { Link } from  'react-router-dom';
import logo from '../img/logo.jpg';
import logoHead from '../img/marvel.jpg';


const Home = (props) => {
if (props.image!=="noImage")
{
    return (
		<div>
			<h1>Welcome to the Marvel Entertainment</h1>
					<Link className='showlink' to='/characters/page/0'>
						Characters
					</Link>
					<Link className='showlink' to='/comics/page/0'>
						Comics
					</Link>
					<Link className='showlink' to='/series/page/0'>
						Series
					</Link>
                    <br/>
                    <br/>
                    <br/>
                        <img src={logo} alt="Marvel Entertainment"/>
		</div>
	);
}	
else
{
    return (
		<div>
			 <img src={logoHead} alt="marvel logo"/>
             <br/>
             <br/>
                    <Link className='showlink' to='/'>
						Home
					</Link>
                    
                    <br/>
                    <br/>
                    <br/>
                   
		</div>
	);
}
};

export default Home;