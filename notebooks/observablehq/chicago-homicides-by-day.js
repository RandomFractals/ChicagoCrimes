// URL: https://beta.observablehq.com/@randomfractals/chicago-homicides-by-day
// Title: Chicago Homicides by Day, 2001-2018
// Author: Taras Novak (@randomfractals)
// Version: 483
// Runtime version: 1

const m0 = {
  id: "f60ca0b9bbff0629@483",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md `# Chicago Homicides by Day, 2001-2018`
)})
    },
    {
      inputs: ["md","dailyCounts"],
      value: (function(md,dailyCounts){return(
md `##### Total Homicides since 2001: ${Object.keys(dailyCounts)
  .map(key => dailyCounts[key].value)
  .reduce((total, num) => total + num)
  .toLocaleString()}
`
)})
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
      inputs: ["md"],
      value: (function(md){return(
md `*mouseover to see the number of reported crimes per day*`
)})
    },
    {
      name: "viewof weekday",
      inputs: ["html"],
      value: (function(html){return(
html`<select>
  <option value=monday>Monday-based weeks
  <option value=sunday>Sunday-based weeks
</select>`
)})
    },
    {
      name: "weekday",
      inputs: ["Generators","viewof weekday"],
      value: (G, _) => G.input(_)
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
d3.timeFormat('%A, %B %e, %Y')
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
md `## Homicides Data`
)})
    },
    {
      name: "dataUrl",
      value: (function(){return(
'https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/data/2018/chicago-homicides-2001-2018.csv'
)})
    },
    {
      name: "homicides",
      inputs: ["d3","dataUrl"],
      value: (function(d3,dataUrl){return(
d3.csv(dataUrl)
)})
    },
    {
      name: "dailyData",
      inputs: ["groupByDay","homicides"],
      value: (function(groupByDay,homicides){return(
groupByDay(homicides)
)})
    },
    {
      name: "dailyCounts",
      inputs: ["dailyData"],
      value: (function(dailyData){return(
Object.keys(dailyData)
  .map(day => {
    const date = new Date(day);
    return {date: new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000), value: dailyData[day].length};
  }).sort((a, b) => a.date - b.date)
)})
    },
    {
      name: "groupByDay",
      value: (function(){return(
function groupByDay(dataArray) {
  let daily = {};
  dataArray.map(data => {
    const date = new Date(data.Date);
    const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
    const day = new Date(date.getTime() - timezoneOffset).toISOString().substring(0, 10); // ISO date string;
    if (!daily[day]) {
      daily[day] = [];
    }
    daily[day].push(data);
  });
  return daily;
}
)})
    }
  ]
};

const notebook = {
  id: "f60ca0b9bbff0629@483",
  modules: [m0]
};

export default notebook;
