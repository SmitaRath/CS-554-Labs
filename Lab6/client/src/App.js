import './App.css';
import { NavLink, BrowserRouter as Router, Route } from 'react-router-dom';
import BinnedImages from './components/BinnedImages';
import Images from './components/Images';
import MyPosts from './components/MyPosts';
import NewImage from './components/NewImage';
import PopularImages from './components/PopularImages'
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});

function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
    <div className="App">
              <h1>Binterest</h1>
              <nav>
              <NavLink className="navlink" to="/">
                Images
              </NavLink>

              <NavLink className="navlink" to="/my-bin">
                My Bin
              </NavLink>

              <NavLink className="navlink" to="/my-posts">
                My Posts
              </NavLink>

              <NavLink className="navlink" to="/popularity">
                Popularity
              </NavLink>
            </nav>
            <br></br>
            <br></br>
          <Route exact path="/" component={Images} />
          <Route path="/my-posts" component={MyPosts} />
          <Route path="/my-bin" component={BinnedImages} />
          <Route path="/new-post" component={NewImage} />
          <Route path="/popularity" component={PopularImages} />
         
      
    </div>
    </Router>
    </ApolloProvider>
  );
}

export default App;
