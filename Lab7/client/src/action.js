const getMarvelList = (shows, loading, lastPageData) => ({
    type: 'GET_MARVELIST',
    payload: {
        shows: shows,
        loading: loading,
        lastPageData:lastPageData
    }
  });

  const getPageNum = (pageNum) => ({
    type: 'GET_PAGENUM',
    payload: {
        pageNum: pageNum
    }
  });

  const getSearchData = (searchTerm,searchData,loading) => ({
    type: 'GET_MARVELSEARCH',
    payload: {
        searchTerm: searchTerm,
        searchData:searchData,
        loading:loading
    }
  });



  const getMarvel = (marvel,loading) => ({
    type: 'GET_MARVEL',
    payload: {
        marvel: marvel,
        loading:loading
    }
  });


  module.exports = {
    getMarvelList,
    getPageNum,
    getSearchData,
    getMarvel
    
  };