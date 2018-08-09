// URL: https://beta.observablehq.com/@randomfractals/chicago-crimes-hexgrid
// Title: Chicago Crimes Hexgrid Map
// Author: Taras Novak (@randomfractals)
// Version: 587
// Runtime version: 1

const m0 = {
  id: "c332b856c58a6cbf@587",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md `# Chicago Crimes Hexgrid Map

2D remake of [3D deck-gl-heatmap](https://beta.observablehq.com/@randomfractals/deck-gl-heatmap)
with [d3-hexgrid](https://github.com/larsvers/d3-hexgrid)

*tip: toggle crimeType, startDay/endDay, and mouseover hexagons for block counts:*
`
)})
    },
    {
      name: "viewof crimeType",
      inputs: ["select"],
      value: (function(select){return(
select(['', 'HOMICIDE', 'KIDNAPPING', 'NARCOTICS', 'PROSTITUTION', 'ARSON', 
                          'THEFT', 'BATTERY', 'CRIMINAL DAMAGE', 'ASSAULT', 'SEX OFFENSE',
                          'OTHER OFFENSE', 'DECEPTIVE PRACTICE',
                          'BURGLARY', 'MOTOR VEHICLE THEFT', 'ROBBERY',
                          'CRIMINAL TRESPASS', 'WEAPONS VIOLATION',
                          'OFFENSE INVOLVING CHILDREN',
                          'PUBLIC PEACE VIOLATION',
                          'CRIM SEXUAL ASSAULT',
                          'INTERFERENCE WITH PUBLIC OFFICER',
                          'LIQUOR LAW VIOLATION', 'STALKING', 'GAMBLING'])
)})
    },
    {
      name: "crimeType",
      inputs: ["Generators","viewof crimeType"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof startDay",
      inputs: ["slider","days"],
      value: (function(slider,days){return(
slider({min: 0, max: days, step: 1, value: 0})
)})
    },
    {
      name: "startDay",
      inputs: ["Generators","viewof startDay"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof endDay",
      inputs: ["slider","days"],
      value: (function(slider,days){return(
slider({min: 0, max: days, step: 1, value: days})
)})
    },
    {
      name: "endDay",
      inputs: ["Generators","viewof endDay"],
      value: (G, _) => G.input(_)
    },
    {
      name: "map",
      inputs: ["html","width","mapWidth","mapHeight","crimeType","data","formatTime","dayToDate","startDay","endDay"],
      value: (function(html,width,mapWidth,mapHeight,crimeType,data,formatTime,dayToDate,startDay,endDay){return(
html `<div style="height:${width*.6}px">
  <svg width="${mapWidth}" height="${mapHeight}"></svg>
  <div class="data-panel">
    <b><i>${crimeType}</i></b>
    <i>total:</i> <b>${data.length.toLocaleString()}</b>
    <br />
    <b>${formatTime(dayToDate(startDay))}</b> <i>through</i> <b>${formatTime(dayToDate(endDay))}, 2018</b>
    <br />
    <div class="data-list"></div>
  </div>
  <div class="tooltip"></div>
</div>`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `#### Hexgrid Map Toggles`
)})
    },
    {
      name: "viewof blockRadius",
      inputs: ["slider"],
      value: (function(slider){return(
slider({min: 1, max: 8, step: 1, value: 4})
)})
    },
    {
      name: "blockRadius",
      inputs: ["Generators","viewof blockRadius"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof exponent",
      inputs: ["slider"],
      value: (function(slider){return(
slider({min: 1, max: 12, step: 1, value:6})
)})
    },
    {
      name: "exponent",
      inputs: ["Generators","viewof exponent"],
      value: (G, _) => G.input(_)
    },
    {
      name: "mapWidth",
      inputs: ["width"],
      value: (function(width){return(
width
)})
    },
    {
      name: "mapHeight",
      inputs: ["mapWidth"],
      value: (function(mapWidth){return(
Math.round(mapWidth * .6)
)})
    },
    {
      name: "colorScale",
      inputs: ["d3","exponent","grid"],
      value: (function(d3,exponent,grid){return(
d3.scaleSequential(t => {
  return d3.interpolateInferno(Math.pow(t, exponent))
}).domain([...grid.extentPointDensity].reverse())
)})
    },
    {
      name: "geo",
      inputs: ["d3"],
      value: (async function(d3){return(
await d3.json('https://raw.githubusercontent.com/smartchicago/chicago-atlas/master/db/import/chicago.geojson')
)})
    },
    {
      name: "projection",
      inputs: ["d3","mapWidth","mapHeight","geo"],
      value: (function(d3,mapWidth,mapHeight,geo){return(
d3.geoMercator().fitSize([mapWidth, mapHeight], geo)
)})
    },
    {
      name: "path",
      inputs: ["d3","projection"],
      value: (function(d3,projection){return(
d3.geoPath().projection(projection)
)})
    },
    {
      name: "hexgrid",
      inputs: ["d3","mapWidth","mapHeight","geo","projection","path","blockRadius"],
      value: (function(d3,mapWidth,mapHeight,geo,projection,path,blockRadius){return(
d3.hexgrid()
  .extent([mapWidth, mapHeight])
  .geography(geo)
  .projection(projection)
  .pathGenerator(path)
  .hexRadius(blockRadius)
)})
    },
    {
      name: "hexagons",
      inputs: ["hexgrid","data"],
      value: (function(hexgrid,data){return(
hexgrid(data, ['index'])
)})
    },
    {
      name: "grid",
      inputs: ["hexagons"],
      value: (function(hexagons){return(
hexagons.grid
)})
    },
    {
      name: "svg",
      inputs: ["drawHexgrid","data"],
      value: (function(drawHexgrid,data){return(
drawHexgrid(data)
)})
    },
    {
      name: "drawHexgrid",
      inputs: ["d3","grid","hexagons","colorScale","getDataPoints"],
      value: (function(d3,grid,hexagons,colorScale,getDataPoints){return(
function drawHexgrid(data) {
  // draw heaxgrid map  
  const margin = {top: 0, right: 0, bottom: 0, left: 0};  
  const svg = d3.select('svg')
    .attr('transform', `translate(${margin.left} ${margin.top})`);
  svg.append('g')
    .selectAll('.hex')
    .data(grid.layout)
    .enter()
    .append('path')
    .attr('class', 'hex')
    .attr('d', hexagons.hexagon())
    .attr('transform', d => `translate(${d.x}, ${d.y})`)
    .style('fill', d => !d.pointDensity ? '#fff' : colorScale(d.pointDensity))
    .style('stroke', '#ccc')
    .style('stroke-opacity', 0.5);

  const dataList = document.querySelector('.data-list');
  d3.selectAll('.hex').on('click', (mapPoints) => {
    const dataPoints = getDataPoints(mapPoints);
    dataList.innerHTML = dataPoints.reduce(
      (html, d) => html + 
        `<hr>${d.block}<br />(${d.location})<br />${d.type}: ${d.info}<br />${d.date.toLocaleString()}`, ''
    );
    //console.log('hexagon:click:data:', dataPoints);
  })

  // add tooltips
  const tip = d3.select('.tooltip');
  d3.selectAll('.hex').on('mouseover', (d) => {
    tip.style('opacity', 1)
      .style('top', `${d3.event.pageY - 280}px`)
      .style('left', `${d3.event.pageX + 10}px`);
    tip.html(`${d.datapoints} reported crimes`);
      /* full data point stats
      `cover: ${formatNum(d.cover)}<br>
      points: ${d.datapoints}<br>
      points wt: ${formatNum(d.datapointsWt)}<br>
      density: ${formatNum(d.pointDensity)}`);*/
  })
  .on('mouseout', tip.style('opacity', 0));
  
  // todo: fix this bar display
  //drawLegendBar(svg);
  
  return svg;
}
)})
    },
    {
      name: "drawLegendBar",
      inputs: ["hexagons","d3","grid","colorScale","mapHeight","exponent","hexgrid","formatNum"],
      value: (function(hexagons,d3,grid,colorScale,mapHeight,exponent,hexgrid,formatNum){return(
function drawLegendBar(svg) {
  // gen. legend data
  const legendScale = 8 / hexagons.radius;
  const equalRange = n => d3.range(n).map(d => d / (n - 1));
  const densityDist = grid.layout
    .map(d => d.pointDensity)
    .sort(d3.ascending)
    .filter(d => d);
  const splitRange = equalRange(11);
  const indeces = splitRange.map(d => Math.floor(d * (densityDist.length - 1)));
  const densityPick = indeces.map(d => densityDist[d]);
  const legendData = densityPick.map(d => ({
    density: d,
    colour: colorScale(d)
  }));
  
  // create legend bar
  const legendBar = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(0, ${mapHeight})`);
  
  legendBar.append('text')
    .text(`Point density (scale exponent: ${exponent})`)
    .attr('fill', '#555')
    .attr('font-family', 'sans-serif')
    .attr('font-size', '0.55rem')
    .attr('font-weight', 'bold')
    .attr('dy', 19)
    .attr('dx', -4);

  const legend = legendBar.selectAll('.legendKey')
    .data(legendData)
    .enter()
    .append('g')
    .attr('class', 'legendKey')
    .attr('transform', (d, i) => `translate(${i * Math.sqrt(3) * hexgrid.hexRadius() * legendScale}, 0)`);
  
  legend.append('g')
    .attr('transform', `scale(${legendScale})`)
    .append('path')
    .attr('d', hexagons.hexagon())
    .style('fill', d => d.colour)
    .style('stroke-width', 0.5)
    .style('stroke', '#fff');

  legend.append('text').text(
      (d, i, n) => (i == 0 || i == n.length - 1 ? formatNum(d.density) : '')
    )
    .attr('fill', '#555')
    .attr('font-family', 'sans-serif')
    .attr('font-size', '0.7rem')
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .attr('dy', -10);
}
)})
    },
    {
      name: "formatNum",
      inputs: ["d3"],
      value: (function(d3){return(
d3.format('.2')
)})
    },
    {
      name: "formatTime",
      inputs: ["d3"],
      value: (function(d3){return(
d3.timeFormat('%b %e')
)})
    },
    {
      name: "tooltipStyle",
      inputs: ["html"],
      value: (function(html){return(
html `
<style type="text/css">
.tooltip {
  position: absolute;
  opacity: 0;
  font-family: Nunito, sans-serif;
  font-size: 12px;
  pointer-events: none;
  background-color: #333;
  color: #ccc;
  padding: 3px;
  border-radius: 3px;
  box-shadow: 1px 2px 4px #888;
}
</style>
`
)})
    },
    {
      name: "dataPanelStyle",
      inputs: ["html","mapHeight"],
      value: (function(html,mapHeight){return(
html `
<style type="text/css">
.data-panel {
  position: absolute;
  top: 0;
  font-family: Nunito, sans-serif;
  font-size: 12px;
  pointer-events: none;
  background-color: #f6f6f6;
  padding: 10px;
  border-radius: 3px;
  box-shadow: 1px 2px 4px #888;
}
.data-list {
  max-height: ${mapHeight - 100}px;
  width: 180px;
  overflow: auto;
}
</style>
`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `#### Data`
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
      name: "startDate",
      value: (function(){return(
new Date('1/1/2018')
)})
    },
    {
      name: "endDate",
      value: (function(){return(
new Date('6/30/2018')
)})
    },
    {
      name: "days",
      inputs: ["endDate","startDate","millisPerDay"],
      value: (function(endDate,startDate,millisPerDay){return(
Math.ceil((endDate - startDate) / millisPerDay)
)})
    },
    {
      name: "millisPerDay",
      value: (function(){return(
24 * 60 * 60 * 1000
)})
    },
    {
      name: "dayToDate",
      inputs: ["startDate","millisPerDay"],
      value: (function(startDate,millisPerDay){return(
function dayToDate(day) {
 return new Date(startDate.getTime() + day*millisPerDay) 
}
)})
    },
    {
      name: "fields",
      inputs: ["dataTable"],
      value: (function(dataTable){return(
dataTable.schema.fields.map(f => f.name)
)})
    },
    {
      name: "data",
      inputs: ["filterData","dataTable","crimeType","startDate","startDay","millisPerDay","endDay"],
      value: (function(filterData,dataTable,crimeType,startDate,startDay,millisPerDay,endDay){return(
filterData(dataTable, crimeType, 
  new Date(startDate.getTime() + startDay*millisPerDay),
  new Date(startDate.getTime() + endDay*millisPerDay))
)})
    },
    {
      name: "filterData",
      inputs: ["arrow","toDate"],
      value: (function(arrow,toDate){return(
function filterData(dataTable, crimeType, startDate, endDate) {
  let lat, lng, block, type, info, date, results = [];
  const dataFilter = arrow.predicate.custom(i => {
    const date = toDate(dataTable.getColumn('Date').get(i));
    const primaryType = dataTable.getColumn('PrimaryType').get(i);
    return date >= startDate && date <= endDate && 
      (crimeType === '' || primaryType === crimeType);
  }, b => 1);
  dataTable.filter(dataFilter)   
    .scan((index) => {
      results.push({
        'lat': lat(index),
        'lng': lng(index),
        index,
        //'info': `${block(index)}<br />${type(index)}<br />${info(index)}<br />${toDate(date(index)).toLocaleString()}`
      });
    }, (batch) => {
      lat = arrow.predicate.col('Latitude').bind(batch);
      lng = arrow.predicate.col('Longitude').bind(batch);
      block = arrow.predicate.col('Block').bind(batch);
      type = arrow.predicate.col('PrimaryType').bind(batch);
      info = arrow.predicate.col('Description').bind(batch);    
      date = arrow.predicate.col('Date').bind(batch);    
    }
  );
  return results;
}
)})
    },
    {
      name: "getDataPoints",
      inputs: ["dataTable","toDate"],
      value: (function(dataTable,toDate){return(
function getDataPoints(mapPoints) {
  const dataPoints = [];
  mapPoints.map(point => {
    const dataRow = dataTable.get(point.index);
    const dataPoint = {
      // from fields
      block: dataRow.get(2),
      location: dataRow.get(3).toLowerCase(),
      type: dataRow.get(4).toLowerCase(),
      info: dataRow.get(5).toLowerCase(),
      arrested: dataRow.get(6),
      domestic: dataRow.get(7),
      date: toDate(dataRow.get(9))
    }
    dataPoints.push(dataPoint);
  });
  return dataPoints;
}
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `#### Libs`
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require('d3-fetch', 'd3-geo', 'd3-geo-projection', 'd3-hexgrid', 
  'd3-scale', 'd3-scale-chromatic', 'd3-format', 'd3-time-format', 'd3-array', 'd3-selection')
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
      name: "toDate",
      remote: "toDate"
    },
    {
      from: "@jashkenas/inputs",
      name: "slider",
      remote: "slider"
    },
    {
      from: "@jashkenas/inputs",
      name: "select",
      remote: "select"
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
  id: "@jashkenas/inputs",
  variables: [
    {
      name: "slider",
      inputs: ["input"],
      value: (function(input){return(
function slider(config = {}) {
  let {value, min = 0, max = 1, step = "any", precision = 2, title, description, format, submit} = config;
  if (typeof config == "number") value = config;
  if (value == null) value = (max + min) / 2;
  precision = Math.pow(10, precision);
  return input({
    type: "range", title, description, submit, format,
    attributes: {min, max, step, value},
    getValue: input => Math.round(input.valueAsNumber * precision) / precision
  });
}
)})
    },
    {
      name: "select",
      inputs: ["input","html"],
      value: (function(input,html){return(
function select(config = {}) {
  let {value: formValue, title, description, submit, multiple, size, options} = config;
  if (Array.isArray(config)) options = config;
  options = options.map(o => typeof o === "string" ? {value: o, label: o} : o);
  const form = input({
    type: "select", title, description, submit, 
    getValue: input => {
      const selected = Array.prototype.filter.call(input.options, i => i.selected).map(i => i.value);
      return multiple ? selected : selected[0];
    },
    form: html`
      <form>
        <select name="input" ${multiple ? `multiple size="${size || options.length}"` : ""}>
          ${options.map(({value, label}) => `
            <option value="${value}" ${value === formValue ? "selected" : ""}>${label}</option>
          `)}
        </select>
      </form>
    `
  });
  form.output.remove();
  return form;
}
)})
    },
    {
      name: "input",
      inputs: ["html","d3format"],
      value: (function(html,d3format){return(
function input(config) {
  let {form, type = "text", attributes = {}, action, getValue, title, description, format, submit, options} = config;
  if (!form) form = html`<form>
	<input name=input type=${type} />
  </form>`;
  const input = form.input;
  Object.keys(attributes).forEach(key => {
    const val = attributes[key];
    if (val != null) input.setAttribute(key, val);
  });
  if (submit) form.append(html`<input name=submit type=submit style="margin: 0 0.75em" value="${typeof submit == 'string' ? submit : 'Submit'}" />`);
  form.append(html`<output name=output style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"></output>`);
  if (title) form.prepend(html`<div style="font: 700 0.9rem sans-serif;">${title}</div>`);
  if (description) form.append(html`<div style="font-size: 0.85rem; font-style: italic;">${description}</div>`);
  if (format) format = d3format.format(format);
  if (action) {
    action(form);
  } else {
    const verb = submit ? "onsubmit" : type == "button" ? "onclick" : type == "checkbox" || type == "radio" ? "onchange" : "oninput";
    form[verb] = (e) => {
      e && e.preventDefault();
      const value = getValue ? getValue(input) : input.value;
      if (form.output) form.output.value = format ? format(value) : value;
      form.value = value;
      if (verb !== "oninput") form.dispatchEvent(new CustomEvent("input"));
    };
    if (verb !== "oninput") input.oninput = e => e && e.stopPropagation() && e.preventDefault();
    if (verb !== "onsubmit") form.onsubmit = (e) => e && e.preventDefault();
    form[verb]();
  }
  return form;
}
)})
    },
    {
      name: "d3format",
      inputs: ["require"],
      value: (function(require){return(
require("d3-format")
)})
    }
  ]
};

const notebook = {
  id: "c332b856c58a6cbf@587",
  modules: [m0,m1,m2]
};

export default notebook;
