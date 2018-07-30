// URL: https://beta.observablehq.com/@randomfractals/chicago-crimes-by-type
// Title: Chicago Crimes by Type
// Author: Taras Novak (@randomfractals)
// Version: 205
// Runtime version: 1

const m0 = {
  id: "647833ad22d939d2@205",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Crimes by Type

Companion notebook for the 180 days in 
[2018 Chicago Crimes Heatmap](https://beta.observablehq.com/@randomfractals/deck-gl-heatmap)
and
[Intro to Using Apache Arrow JS with Large Datasets](https://beta.observablehq.com/@randomfractals/apache-arrow)

working on the simple data series line graphs! standby :)
`

)})
    },
    {
      inputs: ["html","crimeData","lineGraph"],
      value: (function(html,crimeData,lineGraph){return(
html `
<h2>by Crime Type</h2>
<div>${Object.keys(crimeData)
  .map(crimeType => lineGraph(crimeData, crimeType))
  .sort((a, b) => a.count - b.count)
  .map(c => c.html)}
</div>
<h3>Total Crimes: ${Object.keys(crimeData)
  .map(key => crimeData[key].length)
  .reduce((total, num) => total + num)
  .toLocaleString()}
</h3>
<hr />
`
)})
    },
    {
      inputs: ["html","locationData","lineGraph"],
      value: (function(html,locationData,lineGraph){return(
html `
<h2>by Location</h2>
<div>${Object.keys(locationData)
  .map(locationType => lineGraph(locationData, locationType))
  .sort((a, b) => b.count - a.count)
  .slice(0, 30)
  .map(c => c.html)}
</div>
<hr />
`
)})
    },
    {
      name: "lineGraph",
      inputs: ["html"],
      value: (function(html){return(
function lineGraph(data, crimeType) {
  console.log('graphing', crimeType, '...');
  // TODO: gen line graph here  
  const count = data[crimeType].length;
  const div = html`<div style="display: inline-block; vertical-align: top; height: 60px; padding: 20px;">
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
      name: "groupByField",
      inputs: ["toDate","arrow"],
      value: (function(toDate,arrow){return(
function groupByField(data, groupField) {
  let groupData, date, arrested, results = {};
  data.scan((index) => {
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
    }
  ]
};

const notebook = {
  id: "647833ad22d939d2@205",
  modules: [m0,m1]
};

export default notebook;
