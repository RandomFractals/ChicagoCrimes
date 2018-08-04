// URL: https://beta.observablehq.com/@randomfractals/chicago-crimes-by-type
// Title: Chicago Crimes by Type
// Author: Taras Novak (@randomfractals)
// Version: 354
// Runtime version: 1

const m0 = {
  id: "647833ad22d939d2@354",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Crimes by Type

Companion notebook for the 180 days in 
[2018 Chicago Crimes Heatmap](https://beta.observablehq.com/@randomfractals/deck-gl-heatmap)
and
[Intro to Using Apache Arrow JS with Large Datasets](https://beta.observablehq.com/@randomfractals/apache-arrow)
`
)})
    },
    {
      inputs: ["html","crimeData","textCloud"],
      value: (function(html,crimeData,textCloud){return(
html `
<div>${Object.keys(crimeData)
  .map(crimeType => textCloud(crimeData, crimeType))
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
      name: "monthlyCrimeData",
      inputs: ["crimeData","groupByMonth"],
      value: (function(crimeData,groupByMonth){return(
Object.keys(crimeData)
  .map(crimeType => {
    return {'crimeType': crimeType, 'monthly': groupByMonth(crimeData, crimeType)};
  })
)})
    },
    {
      name: "months",
      value: (function(){return(
['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
)})
    },
    {
      name: "groupByMonth",
      inputs: ["months"],
      value: (function(months){return(
function groupByMonth(data, groupField) {
  let monthly = {};
  data[groupField].map(data => {
    const month = data.date.getMonth();
    if (month <= months.length) {
      if (!monthly[months[month]]) {
        monthly[months[month]] = [];
      }
      monthly[months[month]].push(data);
    }
  });
  return monthly;
}
)})
    },
    {
      name: "theft",
      inputs: ["plotMonthlyData","crimeData"],
      value: (function(plotMonthlyData,crimeData){return(
plotMonthlyData(crimeData['THEFT'], 'theft')
)})
    },
    {
      name: "plotMonthlyData",
      inputs: ["vegalite"],
      value: (function(vegalite){return(
function plotMonthlyData(data, type, width=180, height=180) {
  return vegalite({
    data: {values: data},
    mark: 'bar',
    width: width,
    height: height,
    encoding: {
      x: {timeUnit: 'month', field: 'date', type: 'ordinal',
          axis: {title: `${type.toLowerCase()} (${data.length.toLocaleString()})`}
         },
      y: {aggregate: 'count', field: '*', type: 'quantitative',
          axis: {title: false}
        },
      color: {value: '#30a2da'}      
    },
  });
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
  id: "647833ad22d939d2@354",
  modules: [m0,m1]
};

export default notebook;
