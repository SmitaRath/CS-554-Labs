const initalState = {
    searchTerm:'',
    searchData:[],
    loading:true
  };
  
    const marvelSearchReducer = (state = initalState, action) => {
      const { type, payload } = action;
    
      switch (type) {
        case 'GET_MARVELSEARCH':
          console.log('payload', payload.searchTerm);
          return {
            searchTerm:payload.searchTerm,
            searchData:payload.searchData,
            loading:payload.loading
          };
    
        default:
          return state;
      }
    };
    
    export default marvelSearchReducer;