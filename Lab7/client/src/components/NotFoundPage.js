import React from 'react';
import { Link } from 'react-router-dom';
import NotFound from '../img/404.png';
class NotFoundPage extends React.Component{
    render(){
        return <div>
            <p style={{textAlign:"center"}}>
              <Link className='showlink' to="/">Back to Home... </Link>
            </p>
            <img src={NotFound} alt = "Not found"/>
          </div>;
    }
}
export default NotFoundPage;