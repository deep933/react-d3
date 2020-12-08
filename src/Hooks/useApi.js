import {useEffect,useState} from 'react'

const useApi= () => {
    const [data, setData] = useState();
    const [url, setUrl] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
   
    useEffect(() => {
      const fetchData = async () => {
        setIsError(false);
        setIsLoading(true);
   
        try {
          const result = await fetch(url);
          result.json().then(data=>
            setData(data)
          )
        } catch (error) {
            console.log(error)
          setIsError(true);
        }
   
        setIsLoading(false);
      };
   
      fetchData();
    }, [url]);
   
    return [{data, isLoading, isError},setUrl];
  }

  export default useApi;