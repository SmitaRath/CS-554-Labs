import { combineReducers } from 'redux';
import marvelListReducer from './marvelListReducer';
import pageReducer from './pageReducer';
import marvelSearchReducer from './marvelSearchReducer';
import marvelReducer from './marvelReducer';
const rootReducer = combineReducers({
  marvelList: marvelListReducer,
  pages:pageReducer,
  marvelSearch:marvelSearchReducer,
  marvel:marvelReducer
});

export default rootReducer;