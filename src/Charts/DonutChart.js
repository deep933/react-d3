import React, { useState, useEffect } from 'react'
import * as d3 from 'd3';
import tippy, { followCursor } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import './DonutChart.css'

const DonutChart = (props) => {
    const [dimension] = useState({
        width: 350,
        height: 350,
        margin: 50,
        radius: () => Math.min(dimension.width, dimension.height) / 2 - dimension.margin,
        colors:["#60A5FA","#34D399","#F472B6","#FBBF24","#FBBF24","#F6C56C","#75E1EB","#D8C31B"]
    })
    const[dataPercentage,setDataPercentage] = useState([]);

    const handleCreateUpdatePie = () => {
        let svg;
        if (!d3.select("#my_dataviz").select('svg').node()) {
            svg = d3.select("#my_dataviz")
                .append("svg")
                .attr("width", dimension.width)
                .attr("height", dimension.height)
                .append("g")
                .attr("transform", "translate(" + dimension.width / 2 + "," + dimension.height / 2 + ")")
        }
        else {
            svg = d3.select("#my_dataviz").select('svg').select("g")
        }

        let color = d3.scaleOrdinal(dimension.colors).domain(Object.values(props.data))
        let pie = d3.pie().value((d) => d)
        let data_ready = pie(Object.values(props.data))

        let updatepath = svg.selectAll('path').data(data_ready)
        let updatepolyline = svg.selectAll('polyline').data(data_ready)
        let updateLabel = svg.selectAll('text').data(data_ready)
// 
        const arcGenerator = d3.arc()
            .innerRadius(0.7)
            .outerRadius(dimension.radius() * 0.7)
            // .padAngle(.06)
            // .padRadius(100)
            // .cornerRadius(2);

        const outerArc = d3.arc()
            .innerRadius(dimension.radius() * 0.8)
            .outerRadius(dimension.radius() * 0.8)

        updatepath
            .enter()
            .append('path')
            .merge(updatepath)
            .attr('d', arcGenerator)
            .attr('fill', (d) => color(d.data))
            .attr("transform", (d) => "translate(0,0)")
            .attr("stroke", "rgba(0,0,0,0.7)")
            .style("stroke-width", "2px")
            .attr("key", (d,idx) => Object.keys(props.data)[idx])
            .attr("data", (d) => d.data)
            .style("opacity", 0.8)
            .on('mouseover', (e) => {
                e.target.style.opacity = 0.5
                tippy(e.target, {
                    content: `<div style="display:flex;flex-direction:row;align-item:center;justify-content:center;color:#ffffff;font-size:14px;font-weight:bold;">
              <div>${e.target.getAttribute("key")}: ${(+e.target.getAttribute("data") * 100 / Object.values(props.data).reduce((a, b) => (+a) + (+b), 0)).toFixed(1)}%</div>
              </div>`,
                    followCursor: true,
                    plugins: [followCursor],
                    allowHTML: true,
                    // moveTransition: 'transform 0.6s ease-out',
                });
            })
            .on("mouseout",(e)=>{
                e.target.style.opacity = 0.8 
            })

        // updatepolyline
        //     .enter()
        //     .append('polyline')
        //     .merge(updatepolyline)
        //     .attr("stroke", "black")
        //     .style("fill", "none")
        //     .attr("stroke-width", 0.5)
        //     .attr('points', function (d,idx) {
        //         console.log(dataPercentage)
        //         if(dataPercentage[idx]<=2){
        //             return null
        //         }
        //         var posA = arcGenerator.centroid(d) // line insertion in the slice
        //         var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
        //         var posC = outerArc.centroid(d); // Label position = almost the same as posB
        //         var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
        //         posC[0] = dimension.radius() * 0.8 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        //         return [posA, posB, posC]
        //     })

        // updateLabel
        //     .enter()
        //     .append('text')
        //     .merge(updateLabel)
        //     .text(function (d, idx) { 
        //         if(dataPercentage[idx]<=2){
        //             return null
        //         }
        //         return `${Object.keys(props.data)[idx]}\n\n${d.data}${props.suffix}` 
        //     })
        //     .attr('font-size', '12px')
        //     .attr('transform', function (d) {
        //         var pos = outerArc.centroid(d);
        //         var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        //         pos[0] = dimension.radius() * 0.8 * (midangle < Math.PI ? 1 : -1) + (midangle < Math.PI ? 2 : -2);
        //         pos[1] = pos[1] + 4
        //         return 'translate(' + pos + ')';
        //     })
        //     .style('text-anchor', function (d) {
        //         var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        //         return (midangle < Math.PI ? 'start' : 'end')
        //     })

        updatepath.exit().remove()
        updatepolyline.exit().remove()
        updateLabel.exit().remove()

    }

    const sort = (a, b) =>{  
        return 0.5 - Math.random();
    } 

    const countPercentage = (data) =>{
       const total =  Object.values(data).reduce((a,b)=>(+a)+(+b),0)
       setDataPercentage(Object.values(data).map((data)=>(data*100)/+total))
    }

    useEffect(() => {
        countPercentage(props.data)
    }, [props])

    useEffect(()=>{
        handleCreateUpdatePie()
    },[dataPercentage])

    return <div className="flex-center">
        <div id="my_dataviz" >
        </div>
        <div>
        {
            Object.entries(props.data).map((data,idx)=><li><span className="colorTag" style={{background:dimension.colors[idx]}}></span>{data[0]}:&nbsp;<b>{data[1]}{props.suffix}</b></li>)
        }
        </div>

    </div>
}

export default DonutChart;