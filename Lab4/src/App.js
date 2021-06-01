import React from 'react';
import CharactersList from './components/CharactersList';
import ComicsList from './components/ComicsList';
import Character from './components/Character';
import SeriesList from './components/SeriesList';
import Series from './components/Series';
import Comics from './components/Comics';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import NotFoundPage from './components/NotFoundPage';


const App = () => {

	return (
		<Router>
			<div className='App'>
				
				<div className='App-body'>
					<Switch>
				    <Route exact path='/' component={Home} />
					<Route exact path='/characters/:id' component={Character} />
					<Route exact path='/characters/page/:page' component={CharactersList}/>
					<Route exact path='/comics/page/:page' component={ComicsList}/>
					<Route exact path='/comics/:id' component={Comics} />
					<Route exact path='/series/page/:page' component={SeriesList}/>	
					<Route exact path='/series/:id' component={Series}/>	
					<Route component={NotFoundPage}/>
					</Switch>
				</div>
			</div>
		</Router>
	);
};

export default App;
