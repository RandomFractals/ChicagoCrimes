// URL: https://beta.observablehq.com/@randomfractals/chicago-crimes-hexgrid
// Title: Chicago Crimes Hexgrid
// Author: Taras Novak (@randomfractals)
// Version: 274
// Runtime version: 1

const m0 = {
  id: "c332b856c58a6cbf@274",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md `# Chicago Crimes Hexgrid

2D remake of [3D deck-gl-heatmap](https://beta.observablehq.com/@randomfractals/deck-gl-heatmap)
with [d3-hexgrid](https://github.com/larsvers/d3-hexgrid)

#hexagons FTW! :)
`
)})
    },
    {
      name: "map",
      inputs: ["DOM","w","h","d3","grid","hexagons","colorScale"],
      value: (function(DOM,w,h,d3,grid,hexagons,colorScale)
{
  const svg = DOM.svg(w, h)
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
      inputs: ["md"],
      value: (function(md){return(
md `#### Hexgrid Toggles`
)})
    },
    {
      name: "viewof r",
      inputs: ["slider"],
      value: (function(slider){return(
slider({min: 1, max: 8, step: 1, value: 4})
)})
    },
    {
      name: "r",
      inputs: ["Generators","viewof r"],
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
      name: "w",
      inputs: ["width"],
      value: (function(width){return(
width
)})
    },
    {
      name: "h",
      inputs: ["w"],
      value: (function(w){return(
Math.round(w * .6)
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
      inputs: ["d3","w","h","geo"],
      value: (function(d3,w,h,geo){return(
d3.geoMercator().fitSize([w, h], geo)
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
      inputs: ["d3","w","h","geo","projection","path","r"],
      value: (function(d3,w,h,geo,projection,path,r){return(
d3.hexgrid()
  .extent([w, h])
  .geography(geo)
  .projection(projection)
  .pathGenerator(path)
  .hexRadius(r)
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
      name: "data",
      inputs: ["toJSON","dataTable"],
      value: (function(toJSON,dataTable){return(
toJSON(dataTable)
)})
    },
    {
      name: "toJSON",
      inputs: ["arrow"],
      value: (function(arrow){return(
function toJSON(dataTable) {
  let lat, lng, results = [];
  dataTable.scan((index) => {
      results.push({
        'Latitude': lat(index),
        'Longitude': lng(index),
      });
    }, (batch) => {
      lat = arrow.predicate.col('Latitude').bind(batch);
      lng = arrow.predicate.col('Longitude').bind(batch);    
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
  id: "c332b856c58a6cbf@274",
  modules: [m0,m1,m2]
};

export default notebook;
