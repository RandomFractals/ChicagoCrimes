// URL: https://beta.observablehq.com/@randomfractals/chicago-crimes-sunburst
// Title: Chicago Crimes Sunburst, 2018
// Author: Taras Novak (@randomfractals)
// Version: 432
// Runtime version: 1

const m0 = {
  id: "ab9d9d8584da9fb8@432",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Crimes Sunburst, 2018

*UX tip: click on the inner circle radial feather to zoom in and middle white cirlce to zoom out,
mouse over for the reported crime counts*
`
)})
    },
    {
      name: "chart",
      inputs: ["partition","data","d3","DOM","width","color","arc","format","radius"],
      value: (function(partition,data,d3,DOM,width,color,arc,format,radius)
{
  const root = partition(data);

  root.each(d => d.current = d);

  const svg = d3.select(DOM.svg(width, width))
      .style("width", "100%")
      .style("height", "auto")
      .style("font", "10px sans-serif");

  const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

  const path = g.append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .enter().append("path")
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
      .attr("d", d => arc(d.current));

  path.filter(d => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

  path.append("title")
      .text(d => `${format(d.value)} ${d.ancestors().map(d => d.data.name).reverse().join("/").replace('flare/', '')}`);

  const label = g.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .enter().append("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", d => +labelVisible(d.current))
      .attr("transform", d => labelTransform(d.current))
      .text(d => d.data.name);

  const parent = g.append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

  function clicked(p) {
    parent.datum(p.parent || root);

    root.each(d => d.target = {
      x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
      x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
      y0: Math.max(0, d.y0 - p.depth),
      y1: Math.max(0, d.y1 - p.depth)
    });

    const t = g.transition().duration(750);

    // Transition the data on all arcs, even the ones that aren’t visible,
    // so that if this transition is interrupted, entering arcs will start
    // the next transition from the desired position.
    path.transition(t)
        .tween("data", d => {
          const i = d3.interpolate(d.current, d.target);
          return t => d.current = i(t);
        })
      .filter(function(d) {
        return +this.getAttribute("fill-opacity") || arcVisible(d.target);
      })
        .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
        .attrTween("d", d => () => arc(d.current));

    label.filter(function(d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      }).transition(t)
        .attr("fill-opacity", d => +labelVisible(d.target))
        .attrTween("transform", d => () => labelTransform(d.current));
  }
  
  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

  return svg.node();
}
)
    },
    {
      name: "data",
      inputs: ["crimeData","groupChildren"],
      value: (function(crimeData,groupChildren){return(
Object({
  name: 'flare', 
  children: Object.keys(crimeData)
    .map(crimeType => {
      return {name: crimeType.toLowerCase(), children: groupChildren(crimeData[crimeType], 'info')};
    })
})
)})
    },
    {
      name: "partition",
      inputs: ["d3"],
      value: (function(d3){return(
data => {
  const root = d3.hierarchy(data)
      .sum(d => d.size)
      .sort((a, b) => b.value - a.value);
  return d3.partition()
      .size([2 * Math.PI, root.height + 1])
    (root);
}
)})
    },
    {
      name: "color",
      inputs: ["d3","data"],
      value: (function(d3,data){return(
d3.scaleOrdinal().range(d3.quantize(d3.interpolateRainbow, data.children.length + 1))
)})
    },
    {
      name: "format",
      inputs: ["d3"],
      value: (function(d3){return(
d3.format(",d")
)})
    },
    {
      name: "radius",
      inputs: ["width"],
      value: (function(width){return(
width / 6
)})
    },
    {
      name: "arc",
      inputs: ["d3","radius"],
      value: (function(d3,radius){return(
d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius(d => d.y0 * radius)
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))
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
      name: "crimeData",
      inputs: ["groupByField","dataTable"],
      value: (function(groupByField,dataTable){return(
groupByField(dataTable, 'PrimaryType')
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
      name: "groupChildren",
      value: (function(){return(
function groupChildren(arrayData, groupField) {
  const groups = {};
  arrayData.map(data => {
    const info = data[groupField].toLowerCase();
    if (!groups[info]) {
      groups[info] = [];
    }
    groups[info].push(data);
  });
  return Object.keys(groups)
    .map(key => {
      return {name: key, size: groups[key].length};
  });
}
)})
    },
    {
      from: "@randomfractals/apache-arrow",
      name: "loadData",
      remote: "loadData"
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
    }
  ]
};

const m2 = {
  id: "@randomfractals/chicago-crimes-by-type",
  variables: [
    {
      name: "groupByField",
      inputs: ["arrow","toDate","months"],
      value: (function(arrow,toDate,months){return(
function groupByField(data, groupField) {
  let groupData, date, location, arrested, info, results = {};
  const dateFilter = arrow.predicate.custom(i => {
    const date = toDate(data.getColumn('Date').get(i));
    return (date.getMonth() <= months.length);
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
    },
    {
      name: "months",
      value: (function(){return(
['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'August']
)})
    }
  ]
};

const notebook = {
  id: "ab9d9d8584da9fb8@432",
  modules: [m0,m1,m2]
};

export default notebook;
