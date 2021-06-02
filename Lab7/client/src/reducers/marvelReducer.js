const initalState = {
    searchTerm:'',
    searchData:[],
    loading:true
  };
  
    const marvelReducer = (state = initalState, action) => {
      const { type, payload } = action;
    
      switch (type) {
        case 'GET_MARVEL':
          console.log('payload', payload);
          return {
            marvel: payload.marvel,
            loading:payload.loading
          };
    
        default:
          return state;
      }
    };
    
    export default marvelReducer;