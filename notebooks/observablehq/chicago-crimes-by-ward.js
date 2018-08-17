// URL: https://beta.observablehq.com/@randomfractals/chicago-crimes-by-ward
// Title: Chicago Crimes by Ward Flubber
// Author: Taras Novak (@randomfractals)
// Version: 260
// Runtime version: 1

const m0 = {
  id: "a2d64365818685b3@260",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Crimes by Ward Flubber

[Flubber](https://github.com/veltman/flubber) is a JavaScript shape animation library.

using 2018 Chicago crimes data from: 

https://github.com/RandomFractals/ChicagoCrimes/tree/master/data/2018
`
)})
    },
    {
      name: "viewof chartType",
      inputs: ["html"],
      value: (function(html){return(
html`
<select id="chartType">
  <option value="cartogram">Cartogram</option>
  <option value="map">Map</option>
  <option value="bars">Bars</option>
</select>`
)})
    },
    {
      name: "chartType",
      inputs: ["Generators","viewof chartType"],
      value: (G, _) => G.input(_)
    },
    {
      name: "chart",
      inputs: ["d3","DOM","width","margin","height"],
      value: (function(d3,DOM,width,margin,height)
{
  const svg = d3.select(DOM.svg(
    width + margin.left + margin.right,
    height + margin.top + margin.bottom
  ));
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .attr('id', 'chart');
  return svg.node();
}
)
    },
    {
      name: "drawShapes",
      inputs: ["d3","wards","convertRectPath","squareSize","chartType","flubber","geoPath","width","height"],
      value: (function(d3,wards,convertRectPath,squareSize,chartType,flubber,geoPath,width,height)
{
  const svg = d3.select('#chart');
  const maxVal = d3.max(wards.map(f => f.val));
  
  if (svg.select('path').empty()) {
    // create chart svg elements
    const color = d3.scaleQuantize()
      .domain([0, maxVal])
      .range(d3.schemeOrRd[5]);
    const dataGroup = svg.append('g');
    dataGroup.selectAll('path')
      .data(wards)
      .enter().append('path')
        .attr('d', d => convertRectPath(d.x*squareSize, d.y*squareSize, squareSize, squareSize))
        .attr('fill', d => color(d.val))
        .style('stroke', '#000')
        .style('stroke-width', 0.3)
      .append('title')
        .text(d => `${d.val.toLocaleString()} crime reports`);
    const groupText = svg.append('g');
    groupText.selectAll('text')
      .data(wards)
      .enter().append('text')
      .attr('x', d => (d.x * squareSize) + squareSize / 2)
      .attr('y', d => (d.y * squareSize) + squareSize / 2)
      .style('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('font-family', 'Verdana')
      .text(d => d.properties.ward);
  } else {    
    // create flubber interpolator
    let interpolator, textX, textY;
    switch (chartType) {
      case 'cartogram':
        interpolator = function (d) {
          return flubber.toRect(
            d3.select(this).attr('d'),
            d.x * squareSize, d.y * squareSize,
            squareSize, squareSize
          );
        }
        textX = d => (d.x * squareSize) + squareSize / 2;
        textY = d => (d.y * squareSize) + squareSize / 2;
        break;
      case 'map':
        interpolator = function (d) {
          return flubber.interpolate(d3.select(this).attr('d'), geoPath.path(d));
        }
        textX = d => geoPath.path.centroid(d)[0];
        textY = d => geoPath.path.centroid(d)[1];
        break;
      case 'bars':
        const barY = d3.scaleLinear()
          .domain([0, maxVal])
          .range([0, width]);
        const barX = d3.scaleBand()
          .domain(wards.map(f => f.properties.ward))
          .range([0, height]);
        interpolator = function (d) {
          return flubber.toRect(
            d3.select(this).attr('d'),
            25,
            barX(d.properties.ward),
            barY(d.val),
            barX.bandwidth()
          );
        }
        textX = 10;
        textY = d => barX(d.properties.ward) + (barX.bandwidth() / 2) + 2.5;
      break;
    }
    
    if (interpolator !== undefined) {
      // animate chart type change transition
      svg.selectAll("path")
        .transition()
        .delay((d, i) => i * 20)
        .duration(1000)
        .attrTween('d', interpolator);
      svg.selectAll('text')
        .transition()
        .delay((d, i) => i * 20)
        .duration(1000)
        .attr('x', textX)
        .attr('y', textY);
    }
  }
}
)
    },
    {
      name: "convertRectPath",
      value: (function(){return(
function convertRectPath(x, y, w, h) {
  return 'M' + [[x,y], [x+w,y], [x+w, y+h], [x, y+h], [x,y]].join('L');
}
)})
    },
    {
      name: "geoPath",
      inputs: ["d3","wards","width","height"],
      value: (function(d3,wards,width,height)
{
  const projection = d3.geoMercator().scale(1).translate([0,0]);
  const path = d3.geoPath().projection(projection);
  const bounds = path.bounds({ type: 'FeatureCollection', features: wards });
  const s = 0.95 / Math.max((bounds[1][0] - bounds[0][0]) / width, (bounds[1][1] - bounds[0][1]) / height);
  const t = [(width - s * (bounds[1][0] + bounds[0][0])) / 2, (height - s * (bounds[1][1] + bounds[0][1])) / 2];
  projection.scale(s).translate(t);
  return {
    projection: projection,
	  path: path,
    bounds: bounds,
    s: s,
    t: t
  };
}
)
    },
    {
      name: "margin",
      value: (function(){return(
{top: 20, right: 10, bottom: 20, left: 10}
)})
    },
    {
      name: "width",
      inputs: ["margin"],
      value: (function(margin){return(
550 - margin.right - margin.left
)})
    },
    {
      name: "height",
      inputs: ["margin"],
      value: (function(margin){return(
650 - margin.top - margin.bottom
)})
    },
    {
      name: "squareSize",
      value: (function(){return(
50
)})
    },
    {
      name: "wards",
      inputs: ["d3","wardLayout","wardCrimeCounts"],
      value: (async function(d3,wardLayout,wardCrimeCounts)
{
  const json = await d3.json("https://gist.githubusercontent.com/pjsier/7cd67fde156f7a1f0c977e105e081a1d/raw/24b7b4bf85471da0be8af870e9886fa131a21801/chi-wards-building-violations.geojson");
  return json.features.map(f => {
    f.properties.ward = f.properties.ward.toString();
    const wardRow = wardLayout.filter(w => w[2] === f.properties.ward);
    if (wardRow) {
      f.x = wardRow[0][0];
      f.y = wardRow[0][1];
      f.val = wardCrimeCounts[Number(f.properties.ward) - 1]; //f.properties.violations;
    }
    return f;
  }).sort((a, b) => {
    const aWard = +a.properties.ward;
    const bWard = +b.properties.ward;
    if (aWard < bWard) { return -1; }
    else if (aWard > bWard) { return 1; }
    return 0;
  });
}
)
    },
    {
      name: "wardLayout",
      value: (function(){return(
[[0,0,"41"],[3,0,"50"],[4,0,"49"],[1,1,"45"],[2,1,"39"],[3,1,"40"],[4,1,"48"],[0,2,"38"],[1,2,"30"],[2,2,"35"],[3,2,"33"],[4,2,"47"],[5,2,"46"],[1,3,"29"],[2,3,"36"],[3,3,"31"],[4,3,"32"],[5,3,"44"],[2,4,"37"],[3,4,"26"],[4,4,"1"],[5,4,"2"],[6,4,"43"],[3,5,"24"],[4,5,"28"],[5,5,"27"],[6,5,"42"],[3,6,"22"],[4,6,"12"],[5,6,"25"],[6,6,"11"],[1,7,"23"],[2,7,"14"],[3,7,"16"],[4,7,"15"],[5,7,"20"],[6,7,"3"],[7,7,"4"],[2,8,"13"],[3,8,"18"],[4,8,"17"],[5,8,"21"],[6,8,"6"],[7,8,"5"],[4,9,"19"],[5,9,"34"],[6,9,"8"],[7,9,"7"],[6,10,"9"],[7,10,"10"]]
)})
    },
    {
      name: "flubber",
      inputs: ["require"],
      value: (function(require){return(
require('https://unpkg.com/flubber')
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
md `## Chicago Crimes Ward Data`
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
      name: "wardCrimeData",
      inputs: ["groupByField","dataTable"],
      value: (function(groupByField,dataTable){return(
groupByField(dataTable, 'Ward')
)})
    },
    {
      name: "wardCrimeCounts",
      inputs: ["wardCrimeData"],
      value: (function(wardCrimeData){return(
Object.keys(wardCrimeData)
  .map(key => wardCrimeData[key].length)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## Apache Arrow JS Lib and Helper Functions Imports`
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
      name: "loadData",
      remote: "loadData"
    },
    {
      from: "@randomfractals/apache-arrow",
      name: "range",
      remote: "range"
    },
    {
      from: "@randomfractals/apache-arrow",
      name: "getMarkdown",
      remote: "getMarkdown"
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
      inputs: ["md"],
      value: (function(md){return(
md `## Intro to Cartograms

[Grid Cartograms](https://beta.observablehq.com/@severo/grid-cartograms)
`
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
      name: "range",
      value: (function(){return(
function range(data, start, end, step) {
  const slice = [];
  const rowCount = data.count();
  for (let i=start; i<end && i <rowCount; i+= step) {
    slice.push(data.get(i).toArray());
  }
  return slice;  
}
)})
    },
    {
      name: "getMarkdown",
      inputs: ["toDate"],
      value: (function(toDate){return(
function getMarkdown (dataFrame, fields, dateFields = []) {
  let markdown = `${fields.join(' | ')}\n --- | --- | ---`; // header row
  let i=0;
  for (let row of dataFrame) {
    markdown += '\n ';
    let td = '';
    let k = 0;
    for (let cell of row) {
      if ( Array.isArray(cell) ) {
        td = '[' + cell.map((value) => value == null ? 'null' : value).join(', ') + ']';
      } else if (fields[k] === 'Date' || dateFields.indexOf(fields[k]) >= 0)  { 
        td = toDate(cell).toLocaleString(); // convert Apache arrow Timestamp to Date and format
      } else {
        td = cell.toString();
      }
      markdown += ` ${td} |`;
      k++;
    }
  }
  return markdown;
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
  id: "a2d64365818685b3@260",
  modules: [m0,m1,m2]
};

export default notebook;
