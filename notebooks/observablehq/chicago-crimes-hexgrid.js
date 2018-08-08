// URL: https://beta.observablehq.com/@randomfractals/chicago-crimes-hexgrid
// Title: Chicago Crimes Hexgrid Map
// Author: Taras Novak (@randomfractals)
// Version: 323
// Runtime version: 1

const m0 = {
  id: "c332b856c58a6cbf@323",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md `# Chicago Crimes Hexgrid Map

2D remake of [3D deck-gl-heatmap](https://beta.observablehq.com/@randomfractals/deck-gl-heatmap)
with [d3-hexgrid](https://github.com/larsvers/d3-hexgrid)

#hexagon maps FTW! :)
`
)})
    },
    {
      name: "map",
      inputs: ["DOM","mapWidth","mapHeight","d3","grid","hexagons","colorScale"],
      value: (function(DOM,mapWidth,mapHeight,d3,grid,hexagons,colorScale)
{
  const svg = DOM.svg(mapWidth, mapHeight)
  d3.select(svg)
    .selectAll('.hex')
    .data(grid.layout)
    .enter()
    .append('path')
    .attr('class', 'hex')
    .attr('d', hexagons.hexagon())
    .attr('transform', d => `translate(${d.x}, ${d.y})`)
    .style('fill', d => !d.pointDensity ? '#fff' : colorScale(d.pointDensity))
    .style('stroke', '#ccc')
  return svg;
}
)
    },
    {
      inputs: ["md","dayToDate","startDay","endDay","data"],
      value: (function(md,dayToDate,startDay,endDay,data){return(
md `
**from:** ${dayToDate(startDay).toLocaleDateString()}
**to:** ${dayToDate(endDay).toLocaleDateString()}
**total:** ${data.length.toLocaleString()}
`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `#### Hexgrid Map Toggles`
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
hexgrid(data)
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
        index
        //'info': `${block(index)}<br />${type(index)}<br />${info(index)}<br />${toDate(date(index)).toLocaleString()}`
      });
    }, (batch) => {
      lat = arrow.predicate.col('Latitude').bind(batch);
      lng = arrow.predicate.col('Longitude').bind(batch);
      //block = arrow.predicate.col('Block').bind(batch);
      //type = arrow.predicate.col('PrimaryType').bind(batch);
      //info = arrow.predicate.col('Description').bind(batch);    
      //date = arrow.predicate.col('Date').bind(batch);    
    }
  );
  return results;
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
require('d3-fetch', 'd3-geo', 'd3-geo-projection', 'd3-hexgrid', 'd3-scale', 'd3-scale-chromatic', 'd3-selection')
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
  id: "c332b856c58a6cbf@323",
  modules: [m0,m1,m2]
};

export default notebook;
