import React, {useEffect, useState } from 'react'
import './App.css';
import DonutChart from './Charts/DonutChart'
import rawdata from './data.json'



function App() {

const [data,setData] = useState(rawdata.map((data,idx)=>{return {protein : data.nutrition.protein,fat:data.nutrition.fat,carbs:data.nutrition.carbohydrate}}))
const [index,setIndex] = useState(0)
useEffect(()=>{

console.log(data)
},[data])
  return <div>
    <DonutChart data={data[index]} suffix={"g"} title={rawdata[index].name}/>
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
