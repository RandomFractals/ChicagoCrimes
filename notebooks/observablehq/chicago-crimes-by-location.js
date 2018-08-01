// URL: https://beta.observablehq.com/@randomfractals/chicago-crimes-by-location
// Title: Chicago Crimes by Location
// Author: Taras Novak (@randomfractals)
// Version: 351
// Runtime version: 1

const m0 = {
  id: "07612a7a7cfd872b@351",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Crimes by Location

Companion notebook for the 180 days in 
[2018 Chicago Crimes Heatmap](https://beta.observablehq.com/@randomfractals/deck-gl-heatmap)
and
[Intro to Using Apache Arrow JS with Large Datasets](https://beta.observablehq.com/@randomfractals/apache-arrow)
`
)})
    },
    {
      name: "onStreets",
      inputs: ["plotMonthlyData","locationData"],
      value: (function(plotMonthlyData,locationData){return(
plotMonthlyData(locationData['STREET'], 'street')
)})
    },
    {
      name: "inResidence",
      inputs: ["plotMonthlyData","locationData"],
      value: (function(plotMonthlyData,locationData){return(
plotMonthlyData(locationData['RESIDENCE'], 'residence')
)})
    },
    {
      name: "inApartment",
      inputs: ["plotMonthlyData","locationData"],
      value: (function(plotMonthlyData,locationData){return(
plotMonthlyData(locationData['APARTMENT'], 'apartment')
)})
    },
    {
      name: "onSidewalk",
      inputs: ["plotMonthlyData","locationData"],
      value: (function(plotMonthlyData,locationData){return(
plotMonthlyData(locationData['SIDEWALK'], 'sidewalk')
)})
    },
    {
      inputs: ["html","locationData","textCloud"],
      value: (function(html,locationData,textCloud){return(
html `
<h2>by Location</h2>
<div>${Object.keys(locationData)
  .map(locationType => textCloud(locationData, locationType))
  .sort((a, b) => b.count - a.count)
  .slice(0, 30)
  .map(c => c.html)}
</div>
<h3>Total Crimes: ${Object.keys(locationData)
  .map(key => locationData[key].length)
  .reduce((total, num) => total + num)
  .toLocaleString()}
</h3>
<hr />
`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## Crime Data`
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
      name: "locationData",
      inputs: ["groupByField","dataTable"],
      value: (function(groupByField,dataTable){return(
groupByField(dataTable, 'LocationDescription')
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
      name: "arrow",
      inputs: ["require"],
      value: (function(require){return(
require('apache-arrow')
)})
    },
    {
      name: "vegalite",
      inputs: ["require"],
      value: (function(require){return(
require("@observablehq/vega-lite@0.1")
)})
    },
    {
      from: "@randomfractals/chicago-crimes-by-type",
      name: "groupByField",
      remote: "groupByField"
    },
    {
      from: "@randomfractals/chicago-crimes-by-type",
      name: "textCloud",
      remote: "textCloud"
    },
    {
      from: "@randomfractals/chicago-crimes-by-type",
      name: "plotMonthlyData",
      remote: "plotMonthlyData"
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
  let groupData, date, arrested, results = {};
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
    dataRecord['arrested'] = arrested(index);
    results[groupFieldData].push(dataRecord);
  }, (batch) => {
    groupData = arrow.predicate.col(groupField).bind(batch);
    date = arrow.predicate.col('Date').bind(batch);
    arrested = arrow.predicate.col('Arrest').bind(batch);
  });
  return results;
}
)})
    },
    {
      name: "textCloud",
      inputs: ["html"],
      value: (function(html){return(
function textCloud(data, crimeType) {
  console.log('graphing', crimeType, '...');
  const count = data[crimeType].length;
  const div = html`<div style="display: inline-block; vertical-align: top; height: 30px; padding: 10px;">
    <h5>
      <b>${crimeType}</b>
      (${count.toLocaleString()})
    </h5>
    </div>`;  
  return {html: div, count};
}
)})
    },
    {
      name: "plotMonthlyData",
      inputs: ["vegalite"],
      value: (function(vegalite){return(
function plotMonthlyData(data, type) {
  return vegalite({
    data: {values: data},
    mark: 'line',
    encoding: {
      x: {timeUnit: 'month', field: 'date', type: 'temporal'},
      y: {aggregate: 'count', field: '*', type: 'quantitative'},
    },
    title: `${type.toLowerCase()} (${data.length.toLocaleString()})`,    
  });
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
      name: "vegalite",
      inputs: ["require"],
      value: (function(require){return(
require("@observablehq/vega-lite@0.1")
)})
    }
  ]
};

const notebook = {
  id: "07612a7a7cfd872b@351",
  modules: [m0,m1,m2]
};

export default notebook;
