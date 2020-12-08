import React, {useEffect, useState } from 'react'
import './App.css';
import DonutChart from './Charts/DonutChart'
import rawdata from './data.json'
import useApi from './Hooks/useApi'


function App() {
const [index,setIndex] = useState(0)
const [{data, isLoading, isError},setUrl] = useApi()


useEffect(()=>{
  setUrl('/api')
},[])

useEffect(()=>{
  if(data){
  console.log(getData(0))
  }
},[data])

const getData = (idx) =>{
  const {protein,carbs,fat_sat,fat_mono,fat_poly} = {...data[idx]}
  return {protein,carbs,fat:((+fat_sat)+(+fat_mono)+(+fat_poly)).toFixed(1)}
}

  return  <div>
    {data && <div className="flex-center-row"><p className="title">{data[index].Shrt_Desc}</p>
<b>{data[index].kcal} Calories</b>
    </div>}

    {data && <DonutChart data={getData(index)} suffix={"g"}/>}
    <div className="flex-center">
    <button id="changeBtn" onClick={()=>{
      if(index<data.length-1){
        setIndex(index=>index+1)
      }
      else{
        setIndex(0)
      }
    }}>
      Next
    </button>
    </div>
  </div>
 
}

export default App;
