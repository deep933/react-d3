import React, { useEffect, useState, useRef } from 'react'
import './App.css';
import * as d3 from 'd3';
import tippy, { followCursor } from 'tippy.js';
import 'tippy.js/dist/tippy.css';


function App() {
  const [dimension, setDimension] = useState({
    width: 350,
    height: 350,
    margin: 50,
    radius: () => Math.min(dimension.width, dimension.height) / 2 - dimension.margin
  })
  const [data, setData] = useState({ protien: 23, carbs: 3, fats: 45 })




  const createPie = () => {
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

    let color = d3.scaleOrdinal(d3.schemeSet2).domain(Object.values(data))
    let pie = d3.pie().value((d) => d)
    let data_ready = pie(Object.values(data))
    let updatepath = svg.selectAll('path').data(data_ready)
    let updatepolyline = svg.selectAll('polyline').data(data_ready)
    let updateLabel = svg.selectAll('text').data(data_ready)

    const arcGenerator = d3.arc().innerRadius((dimension.radius() - 60) * 0.7).outerRadius(dimension.radius() * 0.7).padAngle(.06)
      .padRadius(100)
      .cornerRadius(2);

    const outerArc = d3.arc().innerRadius(dimension.radius() * 0.8).outerRadius(dimension.radius() * 0.8)

    updatepath
      .enter()
      .append('path')
      .merge(updatepath)
      .attr('d', arcGenerator)
      .attr('fill', (d) => color(d.data))
      .attr("transform", (d) => "translate(0,0)")
      .attr("stroke", "rgba(0,0,0,0.7)")
      .style("stroke-width", "1px")
      .attr("data", (d) => d.data)
      .style("opacity", 0.8)
      .on('mouseover', (e) => {

        console.log(e.target.style)
        tippy(e.target, {
          content: `<div style="display:flex;flex-direction:row;align-item:center;justify-content:center;color:#ffffff;font-size:14px;font-weight:bold;">
          <div>${(+e.target.getAttribute("data") * 100 / Object.values(data).reduce((a, b) => a + b, 0)).toFixed(1)}%</div>
          </div>`,
          followCursor: true,
          plugins: [followCursor],
          allowHTML: true,
          // moveTransition: 'transform 0.6s ease-out',
        });
      })

    updatepolyline
      .enter()
      .append('polyline')
      .merge(updatepolyline)
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr('points', function (d) {
        var posA = arcGenerator.centroid(d) // line insertion in the slice
        var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
        var posC = outerArc.centroid(d); // Label position = almost the same as posB
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = dimension.radius() * 0.8 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC]
      })

    updateLabel
      .enter()
      .append('text')
      .merge(updateLabel)
      .text(function (d, idx) { return `${Object.keys(data)[idx]}\n\n${d.data}g` })
      .attr('font-size', '12px')
      .attr('transform', function (d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = dimension.radius() * 0.8 * (midangle < Math.PI ? 1 : -1) + (midangle < Math.PI ? 2 : -2);
        pos[1] = pos[1] + 4
        return 'translate(' + pos + ')';
      })
      .style('text-anchor', function (d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
      })

    updatepath.exit().remove()
    updatepolyline.exit().remove()
    updateLabel.exit().remove()

  }

  useEffect(() => {
    createPie()
  }, [data])


  return <div>
    <div id="my_dataviz" ></div>

    <button onClick={() => {
      setData({ protien: 13, carbs: 34, fats: 15, jk: 5 })
    }}>
      Change
    </button>

  </div>
}

export default App;
