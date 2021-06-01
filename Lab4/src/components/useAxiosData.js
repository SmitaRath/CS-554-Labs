import { useEffect, useState } from 'react';
import axios from 'axios';

const useAxiosData = (term) => {
  const [state, setState] = useState({ data: null, loading: true });



  useEffect(() => {
    async function fetchData(){
    try{
      const { data } = await axios.get(url);
      setState({ data: data, loading: false });
    }
    catch(e){
        setState({ data: null, loading: false });
    }
  }
  fetchData();
}, [url, setState]);

  return state;
};

export default useAxiosData;