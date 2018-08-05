// URL: https://beta.observablehq.com/@randomfractals/chicago-crimes-by-day
// Title: Chicago Crimes by Day
// Author: Taras Novak (@randomfractals)
// Version: 407
// Runtime version: 1

const m0 = {
  id: "e901da8a28f3f554@407",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Crimes by Day

*mouseover to see the number of reported crimes per day*`
)})
    },
    {
      name: "viewof weekday",
      inputs: ["html"],
      value: (function(html){return(
html`<select>
  <option value=monday>Monday-based weeks
  <option value=sunday>Sunday-based weeks
  <option value=weekday>Weekdays only
</select>`
)})
    },
    {
      name: "weekday",
      inputs: ["Generators","viewof weekday"],
      value: (G, _) => G.input(_)
    },
    {
      name: "chart",
      inputs: ["d3","data","DOM","width","height","cellSize","weekday","countDay","formatDay","timeWeek","color","formatDate","pathMonth","formatMonth"],
      value: (function(d3,data,DOM,width,height,cellSize,weekday,countDay,formatDay,timeWeek,color,formatDate,pathMonth,formatMonth)
{
  const years = d3.nest()
      .key(d => d.date.getFullYear())
    .entries(data)
    .reverse();

  const svg = d3.select(DOM.svg(width, height * years.length))
      .style("font", "10px sans-serif")
      .style("width", "100%")
      .style("height", "auto");

  const year = svg.selectAll("g")
    .data(years)
    .enter().append("g")
      .attr("transform", (d, i) => `translate(40,${height * i + cellSize * 1.5})`);

  year.append("text")
      .attr("x", -5)
      .attr("y", -5)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text(d => d.key);

  year.append("g")
      .attr("text-anchor", "end")
    .selectAll("text")
    .data((weekday === "weekday" ? d3.range(2, 7) : d3.range(7)).map(i => new Date(1995, 0, i)))
    .enter().append("text")
      .attr("x", -5)
      .attr("y", d => (countDay(d) + 0.5) * cellSize)
      .attr("dy", "0.31em")
      .text(formatDay);

  year.append("g")
    .selectAll("rect")
    .data(d => d.values)
    .enter().append("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("x", d => timeWeek.count(d3.timeYear(d.date), d.date) * cellSize + 0.5)
      .attr("y", d => countDay(d.date) * cellSize + 0.5)
      .attr("fill", d => color(d.value))
    .append("title")
      .text(d => `${d.value.toLocaleString()} on ${formatDate(d.date)}`);

  const month = year.append("g")
    .selectAll("g")
    .data(d => d3.timeMonths(d3.timeMonth(d.values[0].date), d.values[d.values.length - 1].date))
    .enter().append("g");

  month.filter((d, i) => i).append("path")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .attr("d", pathMonth);

  month.append("text")
      .attr("x", d => timeWeek.count(d3.timeYear(d), timeWeek.ceil(d)) * cellSize + 2)
      .attr("y", -5)
      .text(formatMonth);

  return svg.node();
}
)
    },
    {
      name: "cellSize",
      value: (function(){return(
17
)})
    },
    {
      name: "width",
      value: (function(){return(
964
)})
    },
    {
      name: "height",
      inputs: ["cellSize","weekday"],
      value: (function(cellSize,weekday){return(
cellSize * (weekday === "weekday" ? 7 : 9)
)})
    },
    {
      name: "timeWeek",
      inputs: ["weekday","d3"],
      value: (function(weekday,d3){return(
weekday === "sunday" ? d3.timeSunday : d3.timeMonday
)})
    },
    {
      name: "countDay",
      inputs: ["weekday"],
      value: (function(weekday){return(
weekday === "sunday" ? d => d.getDay() : d => (d.getDay() + 6) % 7
)})
    },
    {
      name: "pathMonth",
      inputs: ["weekday","countDay","timeWeek","d3","cellSize"],
      value: (function(weekday,countDay,timeWeek,d3,cellSize){return(
function pathMonth(t) {
  const n = weekday === "weekday" ? 5 : 7;
  const d = Math.max(0, Math.min(n, countDay(t)));
  const w = timeWeek.count(d3.timeYear(t), t);
  return `${d === 0 ? `M${w * cellSize},0`
      : d === n ? `M${(w + 1) * cellSize},0`
      : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${n * cellSize}`;
}
)})
    },
    {
      name: "formatDate",
      inputs: ["d3"],
      value: (function(d3){return(
d3.timeFormat('%A, %B %e')
)})
    },
    {
      name: "formatDay",
      value: (function(){return(
d => "SMTWTFS"[d.getDay()]
)})
    },
    {
      name: "formatMonth",
      inputs: ["d3"],
      value: (function(d3){return(
d3.timeFormat("%b")
)})
    },
    {
      name: "color",
      inputs: ["d3","data"],
      value: (function(d3,data){return(
d3.scaleSequential(d3.interpolateYlOrRd).domain([d3.min(data, d => d.value), d3.max(data, d => d.value)])
)})
    },
    {
      name: "data",
      inputs: ["dailyCounts"],
      value: (function(dailyCounts){return(
dailyCounts
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
md `## Crime Data`
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
      name: "dailyData",
      inputs: ["groupByDay","dataTable"],
      value: (function(groupByDay,dataTable){return(
groupByDay(dataTable)
)})
    },
    {
      name: "dailyCounts",
      inputs: ["dailyData","timezoneOffset"],
      value: (function(dailyData,timezoneOffset){return(
Object.keys(dailyData)
  .map(day => {
    return {date: new Date(new Date(day).getTime() + timezoneOffset), value: dailyData[day].length};
  })
)})
    },
    {
      name: "timezoneOffset",
      value: (function(){return(
(new Date().getTimezoneOffset() + 60) * 60 * 1000
)})
    },
    {
      name: "groupByDay",
      inputs: ["arrow","toDate"],
      value: (function(arrow,toDate){return(
function groupByDay(data) {
  let groupData, date, location, arrested, info, results = {};
  const dateFilter = arrow.predicate.custom(i => {
    const date = toDate(data.getColumn('Date').get(i));
    return (date.getMonth() <= 6); // through June
  }, b => 1);
  data.filter(dateFilter)  
  .scan((index) => {
    const day = toDate(date(index)).toISOString().substring(0, 10); // ISO date string
    if (!results[day]) {
      results[day] = []; 
    }
    const dataRecord = {};
    dataRecord['date'] = toDate(date(index));
    dataRecord['location'] = location(index);    
    dataRecord['arrested'] = arrested(index);
    dataRecord['info'] = info(index);
    results[day].push(dataRecord);
  }, (batch) => {
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
    }
  ]
};

const notebook = {
  id: "e901da8a28f3f554@407",
  modules: [m0,m1]
};

export default notebook;
