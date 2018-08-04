// URL: https://beta.observablehq.com/@randomfractals/chicago-crimes-sankey
// Title: Chicago Crimes Sankey
// Author: Taras Novak (@randomfractals)
// Version: 246
// Runtime version: 1

const m0 = {
  id: "cb6fc670dec4d7bf@246",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Crimes Sankey`
)})
    },
    {
      name: "chart",
      inputs: ["d3","DOM","width","height","sankey","data","color"],
      value: (function(d3,DOM,width,height,sankey,data,color)
{
  const svg = d3.select(DOM.svg(width, height))
      .style("width", "100%")
      .style("height", "auto");

  const {nodes, links} = sankey(data);

  svg.append("g")
      .attr("stroke", "#000")
    .selectAll("rect")
    .data(nodes)
    .enter().append("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", d => color(d.name))
    .append("title")
      .text(d => `${d.name}\n${d.value.toLocaleString()}`);

  const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(links)
    .enter().append("g")
      .style("mix-blend-mode", "multiply");

  const gradient = link.append("linearGradient")
      .attr("id", d => (d.uid = DOM.uid("link")).id)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", d => d.source.x1)
      .attr("x2", d => d.target.x0);

  gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", d => color(d.source.name));

  gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", d => color(d.target.name));

  link.append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", d => d.uid)
      .attr("stroke-width", d => Math.max(1, d.width));

  link.append("title")
      .text(d => `${d.source.name} → ${d.target.name}\n${d.value.toLocaleString()}`);

  svg.append("g")
      .style("font", "10px sans-serif")
    .selectAll("text")
    .data(nodes)
    .enter().append("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .text(d => d.name);

  return svg.node();
}
)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`<a href="https://en.wikipedia.org/wiki/Sankey_diagram">Sankey diagrams</a> visualize the magnitude of flow between nodes in a network. This intricate diagram shows Chicago crimes by type and location distribution. The thickness of each link encodes the amount of flow from source to target.

This notebook is built with <a href="https://github.com/d3/d3-sankey">d3-sankey</a>, which computes positions via <a href="https://en.wikipedia.org/wiki/Gauss–Seidel_method">iterative relaxation</a>. After fixing the horizontal position of each node, the algorithm starts from the sources on the left, positioning downstream nodes so as to minimize link distance. A reverse pass is then made from right-to-left, and then the entire process is repeated several times. Overlapping nodes are shifted to avoid collision.

The fully automatic layout is convenient for rapid visualization—positioning nodes manually is tedious! However, the algorithm is not perfect; it could be improved to minimize link crossings and to prevent links from intersecting unrelated nodes. It also does not support cyclical networks.
`
)})
    },
    {
      name: "sankey",
      inputs: ["d3","width","height"],
      value: (function(d3,width,height)
{
  const sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 5]]);
  return ({nodes, links}) => sankey({
    nodes: nodes.map(d => Object.assign({}, d)),
    links: links.map(d => Object.assign({}, d))
  });
}
)
    },
    {
      name: "color",
      inputs: ["d3"],
      value: (function(d3)
{
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  return name => color(name.replace(/ .*/, ""));
}
)
    },
    {
      name: "data",
      inputs: ["nodeNames","nodeLinks"],
      value: (function(nodeNames,nodeLinks)
{return {'nodes': nodeNames, 'links': nodeLinks}}
)
    },
    {
      name: "width",
      value: (function(){return(
964
)})
    },
    {
      name: "height",
      value: (function(){return(
900
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require("d3-selection@1", "d3-fetch@1", "d3-format@1", "d3-scale@2", "d3-scale-chromatic@1", "d3-sankey@0.7")
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
      name: "locationData",
      inputs: ["groupByField","dataTable"],
      value: (function(groupByField,dataTable){return(
groupByField(dataTable, 'LocationDescription')
)})
    },
    {
      name: "assaults",
      inputs: ["groupChildren","crimeData"],
      value: (function(groupChildren,crimeData){return(
groupChildren(crimeData['ASSAULT'], 'location')
)})
    },
    {
      name: "crimeByLocation",
      inputs: ["crimeData","groupChildren"],
      value: (function(crimeData,groupChildren){return(
Object.keys(crimeData)
  .map(crimeType => {
    return {
      'crimeType': crimeType.toLowerCase(), 
      'locations': groupChildren(crimeData[crimeType], 'location'),
      'count': crimeData[crimeType].length
    };
  })
  .sort((a, b) => b.count - a.count)
)})
    },
    {
      name: "nodeNames",
      inputs: ["crimeByLocation","locationData"],
      value: (function(crimeByLocation,locationData){return(
crimeByLocation
  .slice(0, 10) // top 10 crimes
  .map(crime => {
    return {'name': crime.crimeType.toLowerCase()};
  })
  .concat(Object.keys(locationData)
    .map(location => {
      return {'name': location.toLowerCase(), 'count': locationData[location].length};
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // top 10 locations
  )
)})
    },
    {
      name: "nodeLinks",
      inputs: ["nodeNames","crimeByLocation"],
      value: (function(nodeNames,crimeByLocation)
{
  const nodeNameMap = {};
  for (let i=0; i < nodeNames.length; i++) {
    nodeNameMap[nodeNames[i].name] = i;
  }
  const links = [];
  crimeByLocation.forEach(crime => {
    const src = nodeNameMap[crime.crimeType];
    if (src && src !== undefined) {
      crime.locations.forEach(location => {
        const target = nodeNameMap[location.name];
        if (target && target !== undefined) {
          links.push({'source': src, 'target': target, 'value': location.size});
        }
      });
    }
  });
  return links;
}
)
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
      from: "@randomfractals/chicago-crimes-sunburst",
      name: "groupChildren",
      remote: "groupChildren"
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

const m3 = {
  id: "@randomfractals/chicago-crimes-sunburst",
  variables: [
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
    }
  ]
};

const notebook = {
  id: "cb6fc670dec4d7bf@246",
  modules: [m0,m1,m2,m3]
};

export default notebook;
