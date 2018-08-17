// URL: https://beta.observablehq.com/@randomfractals/chicago-crime-types-by-day
// Title: Chicago Crime Types by Day
// Author: Taras Novak (@randomfractals)
// Version: 228
// Runtime version: 1

const m0 = {
  id: "ed71d88d048a7588@228",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Crime Types by Day

forking it to rework my [Chicago Crimes Ridgeline](https://beta.observablehq.com/@randomfractals/chicago-crimes-ridgeline) with crime types by day breakdown for new daily crimes insights.

chart moding in progress :) ...
`
)})
    },
    {
      name: "chart",
      inputs: ["d3","DOM","width","height","data","margin","x","y","color","format"],
      value: (function(d3,DOM,width,height,data,margin,x,y,color,format)
{
  const svg = d3.select(DOM.svg(width, height * data.names.length + margin.top + margin.bottom))
      .style("font", "10px sans-serif");

  svg.append("g")
      .attr("transform", `translate(0,${margin.top})`)
      .call(d3.axisTop(x).ticks(null, "d"))
      .call(g => g.select(".domain").remove());

  svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(0))
      .call(g => g.select(".domain").remove());

  const row = svg.append("g")
    .selectAll("g")
    .data(data.values)
    .enter().append("g")
      .attr("transform", (d, i) => `translate(0,${y(data.names[i])})`);

  row.selectAll("rect")
    .data(d => d)
    .enter().append("rect")
      .attr("x", (d, i) => x(data.years[i]))
      .attr("width", (d, i) => x(data.years[i] + 1) - x(data.years[i]) - 1)
      .attr("height", y.bandwidth() - 1)
      .attr("fill", d => isNaN(d) ? "#eee" : color(d))
    .append("title")
      .text((d, i) => `${format(d)} per 100,000 people in ${data.years[i]}`);

  return svg.node();
}
)
    },
    {
      name: "legend",
      inputs: ["d3","DOM","margin","color","ramp"],
      value: (function(d3,DOM,margin,color,ramp)
{
  const width = 320;
  const height = 45;

  const svg = d3.select(DOM.svg(width, height))
      .style("overflow", "visible");

  const legend = svg.append("g")
      .attr("transform", `translate(${margin.left},20)`)
      .call(d3.axisBottom(color.copy().rangeRound([0, width])).tickSize(13).ticks(5))
      .call(g => g.selectAll(".tick line").attr("stroke", "#fff"))
      .call(g => g.select(".domain").remove());

  legend.insert("image", "*")
      .attr("width", width)
      .attr("height", 13)
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", ramp(d3.scaleLinear().interpolate(color.interpolate()).domain([0, 1])).toDataURL());

  legend.append("text")
      .attr("class", "caption")
      .attr("y", -6)
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text("Cases per 100,000 people");

  return svg.node();
}
)
    },
    {
      name: "color",
      inputs: ["d3","data"],
      value: (function(d3,data){return(
d3.scaleSqrt()
    .interpolate(() => d3.interpolatePuRd)
    .domain([0, d3.max(data.values, d => d3.max(d))])
)})
    },
    {
      name: "margin",
      value: (function(){return(
{top: 20, right: 1, bottom: 1, left: 40}
)})
    },
    {
      name: "height",
      value: (function(){return(
16
)})
    },
    {
      name: "format",
      inputs: ["d3"],
      value: (function(d3)
{
  const f = d3.format(",d");
  return d => isNaN(d) ? "N/A cases"
      : d === 0 ? "0 cases"
      : d < 1 ? "<1 case"
      : d < 1.5 ? "1 case"
      : `${f(d)} cases`;
}
)
    },
    {
      name: "x",
      inputs: ["d3","data","margin","width"],
      value: (function(d3,data,margin,width){return(
d3.scaleLinear()
    .domain([d3.min(data.years), d3.max(data.years) + 1])
    .rangeRound([margin.left, width - margin.right])
)})
    },
    {
      name: "y",
      inputs: ["d3","data","margin","height"],
      value: (function(d3,data,margin,height){return(
d3.scaleBand()
    .domain(data.names)
    .rangeRound([margin.top, margin.top + data.names.length * height])
)})
    },
    {
      name: "data",
      inputs: ["d3"],
      value: (async function(d3)
{
  const names = ["Alaska", "Ala.", "Ark.", "Ariz.", "Calif.", "Colo.", "Conn.", "D.C.", "Del.", "Fla.", "Ga.", "Hawaii", "Iowa", "Idaho", "Ill.", "Ind.", "Kan.", "Ky.", "La.", "Mass.", "Md.", "Maine", "Mich.", "Minn.", "Mo.", "Miss.", "Mont.", "N.C.", "N.D.", "Neb.", "N.H.", "N.J.", "N.M", "Nev.", "N.Y.", "Ohio", "Okla.", "Ore.", "Pa.", "R.I.", "S.C.", "S.D.", "Tenn.", "Texas", "Utah", "Va.", "Vt.", "Wash.", "Wis.", "W.Va.", "Wyo."];
  const data = await d3.json("https://gist.githubusercontent.com/mbostock/6efcf69fbfdf96ab2205c029cec40c77/raw/b02112e5ef4ed2ec92486aabb4ab083ef08e2a99/vaccines.json");
  const values = [];
  const year0 = d3.min(data[0].data.values.data, d => d[0]);
  const year1 = d3.max(data[0].data.values.data, d => d[0]);
  const years = d3.range(year0, year1 + 1);
  for (const [year, i, value] of data[0].data.values.data) {
    if (value == null) continue;
    (values[i] || (values[i] = []))[year - year0] = value;
  }
  return {
    values,
    names,
    years
  };
}
)
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require("d3@5")
)})
    },
    {
      from: "@mbostock/color-ramp",
      name: "ramp",
      remote: "ramp"
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## Crime data`
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
      from: "@randomfractals/chicago-crimes-by-day",
      name: "groupByDay",
      remote: "groupByDay"
    },
    {
      from: "@randomfractals/chicago-crimes-by-day",
      name: "timezoneOffset",
      remote: "timezoneOffset"
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
  id: "@mbostock/color-ramp",
  variables: [
    {
      name: "ramp",
      inputs: ["DOM"],
      value: (function(DOM){return(
function ramp(color, n = 512) {
  const canvas = DOM.canvas(n, 1);
  const context = canvas.getContext("2d");
  canvas.style.margin = "0 -14px";
  canvas.style.width = "calc(100% + 28px)";
  canvas.style.height = "40px";
  canvas.style.imageRendering = "pixelated";
  for (let i = 0; i < n; ++i) {
    context.fillStyle = color(i / (n - 1));
    context.fillRect(i, 0, 1, 1);
  }
  return canvas;
}
)})
    }
  ]
};

const m2 = {
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

const m3 = {
  id: "@randomfractals/chicago-crimes-by-day",
  variables: [
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
      name: "timezoneOffset",
      value: (function(){return(
(new Date().getTimezoneOffset() + 60) * 60 * 1000
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
  id: "ed71d88d048a7588@228",
  modules: [m0,m1,m2,m3]
};

export default notebook;
