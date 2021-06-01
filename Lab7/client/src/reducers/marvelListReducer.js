const initalState = {
  shows:[],
  loading:true,
  lastPageData:[]
};

  const marvelListReducer = (state = initalState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case 'GET_MARVELIST':
        console.log('payload', payload);
        return {
          shows:payload.shows,
          loading:payload.loading,
          lastPageData:payload.lastPageData
        };
  
      default:
        return state;
    }
  };
  
  export default marvelListReducer;