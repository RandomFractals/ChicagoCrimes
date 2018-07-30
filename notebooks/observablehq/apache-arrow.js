// URL: https://beta.observablehq.com/@randomfractals/apache-arrow
// Title: Using Apache Arrow JS with Large Datasets
// Author: Taras Novak (@randomfractals)
// Version: 840
// Runtime version: 1

const m0 = {
  id: "87e5b5c3c81a08ce@840",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Using Apache Arrow JS with Large Datasets`
)})
    },
    {
      name: "intro",
      inputs: ["md"],
      value: (function(md){return(
md`## Apache Arrow Introduction

Apache Arrow Home: https://arrow.apache.org/

Apache Arrow JS on github: https://github.com/apache/arrow/tree/master/js
`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Apache Arrow JS Import

Import *apache-arrow.js* via require:
`
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
      inputs: ["md"],
      value: (function(md){return(
md`## Sample Arrow Data

We'll use arrow data file from this Python EDA sample project which contains over 160K records of reported Chicago crimes in 2017:

https://github.com/RandomFractals/ChicagoCrimes

Python notebook to create sample arrow data file:

https://github.com/RandomFractals/ChicagoCrimes/blob/master/notebooks/chicago-crimes-geo-data-export.ipynb`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Loading Arrow Data`
)})
    },
    {
      name: "dataUrl",
      value: (function(){return(
'https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/data/chicago-crimes-2017.arrow'
)})
    },
    {
      name: "crimes",
      inputs: ["loadData","dataUrl","arrow"],
      value: (function(loadData,dataUrl,arrow){return(
loadData(dataUrl).then(buffer => arrow.Table.from(new Uint8Array(buffer)))
)})
    },
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
      inputs: ["md"],
      value: (function(md){return(
md`## Getting Records Count`
)})
    },
    {
      name: "rowCount",
      inputs: ["crimes"],
      value: (function(crimes){return(
crimes.count()
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Getting Arrow Schema Metadata`
)})
    },
    {
      name: "fields",
      inputs: ["crimes"],
      value: (function(crimes){return(
crimes.schema.fields.map(f => f.name)
)})
    },
    {
      name: "fieldTypes",
      inputs: ["crimes"],
      value: (function(crimes){return(
crimes.schema.fields.map(f => f.type)
)})
    },
    {
      name: "fieldTypeNames",
      inputs: ["crimes"],
      value: (function(crimes){return(
crimes.schema.fields.map(f => f.type.toString())
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Accessing Arrow Table Row Data`
)})
    },
    {
      name: "firstRow",
      inputs: ["crimes"],
      value: (function(crimes){return(
crimes.get(0).toString()
)})
    },
    {
      name: "lastRow",
      inputs: ["crimes","rowCount"],
      value: (function(crimes,rowCount){return(
crimes.get(rowCount-1).toString()
)})
    },
    {
      name: "randomRow",
      inputs: ["crimes","rowCount"],
      value: (function(crimes,rowCount){return(
crimes.get(Math.random() * rowCount)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Arrow Record toJSON and toArray`
)})
    },
    {
      name: "toJSON",
      inputs: ["crimes"],
      value: (function(crimes){return(
crimes.get(0).toJSON()
)})
    },
    {
      name: "toArray",
      inputs: ["crimes","rowCount"],
      value: (function(crimes,rowCount){return(
crimes.get(rowCount-1).toArray()
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Slicing Arrow Data`
)})
    },
    {
      name: "every10KRow",
      inputs: ["range","crimes","rowCount"],
      value: (function(range,crimes,rowCount){return(
range(crimes, 0, rowCount, 10000)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`Our custom arrow data range stepper for sampling data:`
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
      inputs: ["md"],
      value: (function(md){return(
md`## Generating Arrow Data Markdown Table for Preview`
)})
    },
    {
      inputs: ["md","getMarkdown","every10KRow","fields"],
      value: (function(md,getMarkdown,every10KRow,fields){return(
md`${getMarkdown(every10KRow, fields)}`
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
      inputs: ["md"],
      value: (function(md){return(
md`## Custom toDate function to convert 64-bit Timestamp`
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
      inputs: ["md"],
      value: (function(md){return(
md`## Getting Column Data Stats`
)})
    },
    {
      name: "latitude",
      inputs: ["columnStats"],
      value: (function(columnStats){return(
columnStats('Latitude')
)})
    },
    {
      name: "longitude",
      inputs: ["columnStats"],
      value: (function(columnStats){return(
columnStats('Longitude')
)})
    },
    {
      name: "dates",
      inputs: ["dateStats"],
      value: (function(dateStats){return(
dateStats('Date')
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`Our custom numeric and date column stats functions:`
)})
    },
    {
      name: "columnStats",
      inputs: ["crimes"],
      value: (function(crimes){return(
function columnStats(columnName) {
  const column = crimes.getColumn(columnName);
  let max = column.get(0);
  let min = max;
  for (let value of column) {
    if (value > max) {
      max = value;
    }
    else if (value < min) {
      min = value;
    }
  }  
  return {min, max, range: max-min};
}
)})
    },
    {
      name: "dateStats",
      inputs: ["crimes","toDate"],
      value: (function(crimes,toDate){return(
function dateStats(columnName) {
  const column = crimes.getColumn(columnName);
  let max = toDate(column.get(0));
  let min = max;
  for (let value of column) {
    const date = toDate(value);
    if (date > max) {
      max = date;
    }
    else if (date < min) {
      min = date;
    }
  }  
  return {min, max, range: max-min};
}
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Column Data Vectors

Appache arrow stores columns in typed arrays and vectors:
`
)})
    },
    {
      name: "timestampVector",
      inputs: ["crimes"],
      value: (function(crimes){return(
crimes.getColumn('Date')
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`Typed vectors have convinience methods to convert Int32 arrays data to JS values you can work with.

For example, to get timestamps in milliseconds:`
)})
    },
    {
      name: "timestamps",
      inputs: ["timestampVector"],
      value: (function(timestampVector)
{
  const dates = []
  let i = 0;
  for (const timestamp of timestampVector.asEpochMilliseconds()) {
    dates.push(new Date(timestamp));
    if (++i >= 10) {
      break;
    }
  }
  return dates;
}
)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Filtering Timestamped Data`
)})
    },
    {
      name: "millisPerHour",
      value: (function(){return(
1*60*60*1000
)})
    },
    {
      name: "startDate",
      inputs: ["dates","millisPerHour"],
      value: (function(dates,millisPerHour){return(
new Date(dates.max - 2*millisPerHour)
)})
    },
    {
      name: "endDate",
      inputs: ["dates","millisPerHour"],
      value: (function(dates,millisPerHour){return(
new Date(dates.max - 1*millisPerHour)
)})
    },
    {
      name: "crimesIn1Hour",
      inputs: ["filterByDate","startDate","endDate"],
      value: (function(filterByDate,startDate,endDate){return(
filterByDate(startDate, endDate)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`Our custom filter by date method uses custom arrow table predicate filter and scan methods
to generate JS friendly data you can map or graph:

(see https://arrow.apache.org/docs/js/classes/table.html api docs)`
)})
    },
    {
      name: "filterByDate",
      inputs: ["arrow","toDate","crimes"],
      value: (function(arrow,toDate,crimes){return(
function filterByDate(startDate, endDate) {
  let lat, long, date, results = [];
  const dateFilter = arrow.predicate.custom(i => {
    const date = toDate(crimes.getColumn('Date').get(i));
    return date >= startDate && date <= endDate;
  }, b => 1);
  
  crimes.filter(dateFilter)   
    .scan((index) => {
      results.push({
        'lat': lat(index),
        'long': long(index),
        'date': toDate(date(index))
      });
    }, (batch) => {
      lat = arrow.predicate.col('Latitude').bind(batch);
      long = arrow.predicate.col('Longitude').bind(batch);
      date = arrow.predicate.col('Date').bind(batch);
    }
  );
  return results;
}
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Filtering by Days`
)})
    },
    {
      name: "millisPerDay",
      inputs: ["millisPerHour"],
      value: (function(millisPerHour){return(
24*millisPerHour
)})
    },
    {
      name: "days",
      inputs: ["dates","millisPerDay"],
      value: (function(dates,millisPerDay){return(
Math.floor(dates.range / millisPerDay)
)})
    },
    {
      from: "@jashkenas/inputs",
      name: "slider",
      remote: "slider"
    },
    {
      name: "viewof startDaySlider",
      inputs: ["slider","days"],
      value: (function(slider,days){return(
slider({min: 0, max: days, step: 1, value: 0})
)})
    },
    {
      name: "startDaySlider",
      inputs: ["Generators","viewof startDaySlider"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof endDaySlider",
      inputs: ["slider","days"],
      value: (function(slider,days){return(
slider({min: 0, max: days, step: 1, value: 1})
)})
    },
    {
      name: "endDaySlider",
      inputs: ["Generators","viewof endDaySlider"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["md","daySliderToDate","startDaySlider","endDaySlider","crimesInDays"],
      value: (function(md,daySliderToDate,startDaySlider,endDaySlider,crimesInDays){return(
md`**from:** ${daySliderToDate(startDaySlider).toLocaleDateString()}
**to:** ${daySliderToDate(endDaySlider).toLocaleDateString()}
**count:** ${crimesInDays.length.toLocaleString()}`
)})
    },
    {
      name: "crimesInDays",
      inputs: ["filterByDate","daySliderToDate","startDaySlider","endDaySlider"],
      value: (function(filterByDate,daySliderToDate,startDaySlider,endDaySlider){return(
filterByDate(
  daySliderToDate(startDaySlider), 
  daySliderToDate(endDaySlider)
)
)})
    },
    {
      name: "daySliderToDate",
      inputs: ["dates","millisPerDay"],
      value: (function(dates,millisPerDay){return(
function daySliderToDate(daySlider) {
  return new Date(dates.min.getTime() + daySlider*millisPerDay);
}
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Mapping Arrow Data`
)})
    },
    {
      name: "mapWidth",
      inputs: ["width"],
      value: (function(width){return(
width/2
)})
    },
    {
      name: "mapHeight",
      inputs: ["width"],
      value: (function(width){return(
width * .6
)})
    },
    {
      name: "scaleX",
      inputs: ["longitude","mapWidth"],
      value: (function(longitude,mapWidth){return(
function scaleX(long) {
  return (long - longitude.min) * (mapWidth/longitude.range);
}
)})
    },
    {
      name: "scaleY",
      inputs: ["mapHeight","latitude"],
      value: (function(mapHeight,latitude){return(
function scaleY(lat) {
  return mapHeight - (lat - latitude.min) * (mapHeight/latitude.range); 
}
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`# 2017 Chicago Crimes`
)})
    },
    {
      name: "viewof startMapDaySlider",
      inputs: ["slider","days"],
      value: (function(slider,days){return(
slider({min: 0, max: days, step: 1, value: 0})
)})
    },
    {
      name: "startMapDaySlider",
      inputs: ["Generators","viewof startMapDaySlider"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof endMapDaySlider",
      inputs: ["slider","days"],
      value: (function(slider,days){return(
slider({min: 0, max: days, step: 1, value: 30})
)})
    },
    {
      name: "endMapDaySlider",
      inputs: ["Generators","viewof endMapDaySlider"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["md","dates","startMapDaySlider","millisPerDay","endMapDaySlider","mappedCrimes"],
      value: (function(md,dates,startMapDaySlider,millisPerDay,endMapDaySlider,mappedCrimes){return(
md`**from:** ${new Date(dates.min.getTime() + startMapDaySlider*millisPerDay).toLocaleDateString()}
**to:** ${new Date(dates.min.getTime() + endMapDaySlider*millisPerDay).toLocaleDateString()}
**count:** ${mappedCrimes.count.toLocaleString()}
`
)})
    },
    {
      name: "crimesMap",
      inputs: ["mappedCrimes"],
      value: (function(mappedCrimes){return(
mappedCrimes.canvas
)})
    },
    {
      name: "mappedCrimes",
      inputs: ["DOM","mapWidth","mapHeight","daySliderToDate","startMapDaySlider","endMapDaySlider","arrow","toDate","crimes","scaleX","scaleY"],
      value: (function(DOM,mapWidth,mapHeight,daySliderToDate,startMapDaySlider,endMapDaySlider,arrow,toDate,crimes,scaleX,scaleY)
{
  const canvas = DOM.canvas(mapWidth, mapHeight);
  const context = canvas.getContext('2d');
  context.fillStyle = 'steelblue'; //'#333333';
  let lat, long, x, y, count = 0;
  const startDate = daySliderToDate(startMapDaySlider);
  const endDate = daySliderToDate(endMapDaySlider);
  const dateFilter = arrow.predicate.custom(i => {
    const date = toDate(crimes.getColumn('Date').get(i));
    return date >= startDate && date <= endDate;
  }, b => 1);
  crimes.filter(dateFilter)
    .scan((index) => {
      x = scaleX(long(index));
      y = scaleY(lat(index));
      context.fillRect(x, y, 1, 1); // rectWidth, rectHeight);
      count++;
    }, (batch) => {
      lat = arrow.predicate.col('Latitude').bind(batch);      
      long = arrow.predicate.col('Longitude').bind(batch);
    }
  );  
  return {canvas, count};
}
)
    },
    {
      name: "darktheme",
      value: (function(){return(
document.body.classList.contains("observablehq--dark")
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## 2017 Chicago Crimes Python Notebooks

If you are interested in this gory subject matter,
here is a short intro post with a bunch of links 
to Python graphs and maps notebooks
beyond this sample arrow dataset I put together last summer:

https://www.linkedin.com/pulse/chicago-crimes-2017-taras-novak

I will be revisting that EDA project in JS on observable this month
since Chicago crimes peak in July and 4th of July is like 
an unoficial purge day for Chicago :( 

Meanwile, see the official city of Chicago Crimes data portal:

https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-present-Dashboard/5cd6-ry5g

and check back here in a few weeks: 

https://beta.observablehq.com/@randomfractals/chicagocrimes
`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Other Apache Arrow JS Notebooks

[Introduction to Apache Arrow](https://beta.observablehq.com/@theneuralbit/introduction-to-apache-arrow)

[Manipulating Flat Arrays, Arrow Style](https://beta.observablehq.com/@lmeyerov/manipulating-flat-arrays-arrow-style)

[From Apache Arrow to JavaScript Objects](https://beta.observablehq.com/@jheer/from-apache-arrow-to-javascript-objects)
`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Flat Arrays Notebooks

[Manipulating Flat Arrays](https://beta.observablehq.com/@mbostock/manipulating-flat-arrays)

[Making WebGL Dance](https://beta.observablehq.com/@mbostock/making-webgl-dance)
`
)})
    }
  ]
};

const m1 = {
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
  id: "87e5b5c3c81a08ce@840",
  modules: [m0,m1]
};

export default notebook;
