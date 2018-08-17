// URL: https://beta.observablehq.com/@randomfractals/chicago-crimes-ridgeline
// Title: Chicago Crimes Ridgeline
// Author: Taras Novak (@randomfractals)
// Version: 276
// Runtime version: 1

const m0 = {
  id: "fd086a6ec5412cb1@276",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Crimes Ridgeline

Displays Top 20 reported Chicago crimes ridgeline plot for 2018.

Ridgeline plots are an alternative to [horizon charts](/@mbostock/d3-horizon-chart) and small-multiple area charts that allow greater precision for a given vertical space at the expense of occlusion (overlapping areas).
`
)})
    },
    {
      name: "chart",
      inputs: ["d3","DOM","width","height","xAxis","yAxis","series","y","area","line"],
      value: (function(d3,DOM,width,height,xAxis,yAxis,series,y,area,line)
{
  const svg = d3.select(DOM.svg(width, height));

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);
  
  const serie = svg.append("g")
    .selectAll("g")
    .data(series)
    .enter().append("g")
      .attr("transform", d => `translate(0,${y(d.key) + 1})`);
  
  serie.append("path")
      .attr("fill", "#ddd")
      .attr("d", d => area(d.values));
  
  serie.append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("d", d => line(d.values));
  
  return svg.node();
}
)
    },
    {
      name: "overlap",
      value: (function(){return(
8
)})
    },
    {
      name: "height",
      inputs: ["series"],
      value: (function(series){return(
series.length * 17
)})
    },
    {
      name: "margin",
      value: (function(){return(
{top: 40, right: 20, bottom: 30, left: 120}
)})
    },
    {
      name: "x",
      inputs: ["d3","data","margin","width"],
      value: (function(d3,data,margin,width){return(
d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])
)})
    },
    {
      name: "y",
      inputs: ["d3","series","margin","height"],
      value: (function(d3,series,margin,height){return(
d3.scalePoint()
    .domain(series.map(d => d.key))
    .range([margin.top, height - margin.bottom])
)})
    },
    {
      name: "z",
      inputs: ["d3","data","overlap","y"],
      value: (function(d3,data,overlap,y){return(
d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([0, -overlap * y.step()])
)})
    },
    {
      name: "xAxis",
      inputs: ["height","margin","d3","x","width"],
      value: (function(height,margin,d3,x,width){return(
g => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x)
      .ticks(width / 80)
      .tickSizeOuter(0))
)})
    },
    {
      name: "yAxis",
      inputs: ["margin","d3","y","data"],
      value: (function(margin,d3,y,data){return(
g => g
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y).tickSize(0).tickPadding(4))
  .call(g => g.select(".domain").remove())
  .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.y))
)})
    },
    {
      name: "area",
      inputs: ["d3","x","z"],
      value: (function(d3,x,z){return(
d3.area()
    .curve(d3.curveBasis)
    .defined(d => !isNaN(d.value))
    .x(d => x(d.date))
    .y0(0)
    .y1(d => z(d.value))
)})
    },
    {
      name: "line",
      inputs: ["area"],
      value: (function(area){return(
area.lineY1()
)})
    },
    {
      name: "series",
      inputs: ["d3","data"],
      value: (function(d3,data){return(
d3.nest()
    .key(d => d.name)
    .sortValues((a, b) => a.date - b.date)
  .entries(data)
)})
    },
    {
      name: "data",
      inputs: ["dailyData"],
      value: (function(dailyData){return(
dailyData
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require("https://d3js.org/d3.v5.min.js")
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## Data`
)})
    },
    {
      name: "dataUrl",
      value: (function(){return(
'https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/data/2018/chicago-crimes-2018.arrow'
)})
    },
    {
      name: "dataTable",
      inputs: ["loadData","dataUrl","arrow"],
      value: (function(loadData,dataUrl,arrow){return(
loadData(dataUrl).then(buffer => arrow.Table.from(new Uint8Array(buffer)))
)})
    },
    {
      name: "crimeData",
      inputs: ["groupByField","dataTable"],
      value: (function(groupByField,dataTable){return(
groupByField(dataTable, 'PrimaryType')
)})
    },
    {
      name: "dailyCrimes",
      inputs: ["crimeData","groupByDay"],
      value: (function(crimeData,groupByDay){return(
Object.keys(crimeData)
  .sort((a, b) => crimeData[b].length - crimeData[a].length) // order by crime type counts
  .slice(0, 20) // top 20
  .map(key => {
    return {name: key, daily: groupByDay(crimeData[key], key)};
  })
)})
    },
    {
      name: "dailyData",
      inputs: ["dailyCrimes","timezoneOffset"],
      value: (function(dailyCrimes,timezoneOffset)
{
  const dailyData = [];
  dailyCrimes.map(data => {
    Object.keys(data.daily)
      .map(day => {
        dailyData.push({
          name: data.name, 
          date: new Date(new Date(day).getTime() + timezoneOffset),
          value: data.daily[day].length
        });
    });
  });
  return dailyData;
}
)
    },
    {
      name: "timezoneOffset",
      value: (function(){return(
(new Date().getTimezoneOffset() + 60) * 60 * 1000
)})
    },
    {
      name: "thefts",
      inputs: ["groupByDay","crimeData"],
      value: (function(groupByDay,crimeData){return(
groupByDay(crimeData['THEFT'], 'THEFT')
)})
    },
    {
      name: "homicides",
      inputs: ["groupByDay","crimeData"],
      value: (function(groupByDay,crimeData){return(
groupByDay(crimeData['HOMICIDE'], 'HOMICIDE')
)})
    },
    {
      name: "groupByDay",
      value: (function(){return(
function groupByDay(dataArray, crimeType) {
  let daily = {};
  dataArray.map(data => {
    const day = data.date.toISOString().substring(0, 10); // ISO date string
    if (!daily[day]) {
      daily[day] = [];
    }
    daily[day].push(data);
  });
  return daily;
}
)})
    },
    {
      from: "@randomfractals/apache-arrow",
      name: "loadData",
      remote: "loadData"
    },
    {
      from: "@randomfractals/apache-arrow",
      name: "toDate",
      remote: "toDate"
    },
    {
      from: "@randomfractals/chicago-crimes-by-type",
      name: "groupByField",
      remote: "groupByField"
    },
    {
      name: "arrow",
      inputs: ["require"],
      value: (function(require){return(
require('apache-arrow')
)})
    }
  ]
};

const m1 = {
  id: "@randomfractals/apache-arrow",
  variables: [
    {
      name: "loadData",
      value: (function(){return(
async function loadData(dataUrl){
  const response = await fetch(dataUrl);
  return await response.arrayBuffer();
}
)})
    },
    {
      name: "toDate",
      value: (function(){return(
function toDate(timestamp) {
  // Appache Arrow Timestamp is a 64-bit int of milliseconds since the epoch,
  // represented as two 32-bit ints in JS to preserve precision.
  // The fist number is the "low" int and the second number is the "high" int.
  return new Date((timestamp[1] * Math.pow(2, 32) + timestamp[0])/1000);
}
)})
    },
    {
      name: "toDate",
      value: (function(){return(
function toDate(timestamp) {
  // Appache Arrow Timestamp is a 64-bit int of milliseconds since the epoch,
  // represented as two 32-bit ints in JS to preserve precision.
  // The fist number is the "low" int and the second number is the "high" int.
  return new Date((timestamp[1] * Math.pow(2, 32) + timestamp[0])/1000);
}
)})
    }
  ]
};

const m2 = {
  id: "@randomfractals/chicago-crimes-by-type",
  variables: [
    {
      name: "groupByField",
      inputs: ["arrow","toDate"],
      value: (function(arrow,toDate){return(
function groupByField(data, groupField) {
  let groupData, date, location, arrested, info, results = {};
  const dateFilter = arrow.predicate.custom(i => {
    const date = toDate(data.getColumn('Date').get(i));
    return (date.getMonth() <= 6); // through June
  }, b => 1);
  data.filter(dateFilter)  
  .scan((index) => {
    const groupFieldData = groupData(index);
    const groupArray = results[groupFieldData];
    if (!groupArray) {
      results[groupFieldData] = []; 
    }
    const dataRecord = {};
    dataRecord[groupField] = groupFieldData;
    dataRecord['date'] = toDate(date(index));
    dataRecord['location'] = location(index);    
    dataRecord['arrested'] = arrested(index);
    dataRecord['info'] = info(index);
    results[groupFieldData].push(dataRecord);
  }, (batch) => {
    groupData = arrow.predicate.col(groupField).bind(batch);
    date = arrow.predicate.col('Date').bind(batch);
    location = arrow.predicate.col('LocationDescription').bind(batch);
    arrested = arrow.predicate.col('Arrest').bind(batch);
    info = arrow.predicate.col('Description').bind(batch);
  });
  return results;
}
)})
    },
    {
      name: "arrow",
      inputs: ["require"],
      value: (function(require){return(
require('apache-arrow')
)})
    },
    {
      from: "@randomfractals/apache-arrow",
      name: "toDate",
      remote: "toDate"
    }
  ]
};

const notebook = {
  id: "fd086a6ec5412cb1@276",
  modules: [m0,m1,m2]
};

export default notebook;
