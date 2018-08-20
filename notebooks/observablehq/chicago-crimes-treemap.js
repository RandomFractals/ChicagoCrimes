// URL: https://beta.observablehq.com/@randomfractals/chicago-crimes-treemap
// Title: Chicago Crimes Treemap
// Author: Taras Novak (@randomfractals)
// Version: 111
// Runtime version: 1

const m0 = {
  id: "71e2d26a83665380@111",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Crimes Treemap

*mouseover for extended crime data cell toolip*`
)})
    },
    {
      name: "chart",
      inputs: ["treemap","data","d3","DOM","width","height","format","color"],
      value: (function(treemap,data,d3,DOM,width,height,format,color)
{
  const root = treemap(data);

  const svg = d3.select(DOM.svg(width, height))
      .style("width", "100%")
      .style("height", "auto")
      .style("font", "10px sans-serif");

  const leaf = svg.selectAll("g")
    .data(root.leaves())
    .enter().append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

  leaf.append("title")
      .text(d => `${format(d.value)} ${d.ancestors().reverse().map(d => d.data.name).join("/").replace('flare/', '')}`);

  leaf.append("rect")
      .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", 0.6)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);

  leaf.append("clipPath")
      .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
    .append("use")
      .attr("xlink:href", d => d.leafUid.href);

  leaf.append("text")
      .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
    .enter().append("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => (i === nodes.length - 1) * 3 + 16 + (i - 0.5) * 9)
      .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
      .text(d => d);

  return svg.node();
}
)
    },
    {
      name: "data",
      inputs: ["flares"],
      value: (function(flares){return(
flares
)})
    },
    {
      name: "treemap",
      inputs: ["d3","width","height"],
      value: (function(d3,width,height){return(
data => d3.treemap()
    .size([width, height])
    .padding(1)
    .round(true)
  (d3.hierarchy(data)
    .sum(d => d.size)
    .sort((a, b) => b.height - a.height || b.value - a.value))
)})
    },
    {
      name: "width",
      value: (function(){return(
932
)})
    },
    {
      name: "height",
      value: (function(){return(
1060
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
      name: "color",
      inputs: ["d3"],
      value: (function(d3){return(
d3.scaleOrdinal().range(d3.schemeCategory10)
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
md `# Crime Data`
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
      name: "flares",
      inputs: ["crimeData","groupChildren"],
      value: (function(crimeData,groupChildren)
{
  return {
    name: 'flare', 
    children: Object.keys(crimeData)
      .map(crimeType => {
        return {name: crimeType.toLowerCase(), children: groupChildren(crimeData[crimeType], 'info')};
      })
  };
}
)
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
  id: "71e2d26a83665380@111",
  modules: [m0,m1,m2]
};

export default notebook;
