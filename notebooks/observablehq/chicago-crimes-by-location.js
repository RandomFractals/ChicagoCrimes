// URL: https://beta.observablehq.com/@randomfractals/chicago-crimes-by-location
// Title: Chicago Crimes by Location
// Author: Taras Novak (@randomfractals)
// Version: 386
// Runtime version: 1

const m0 = {
  id: "07612a7a7cfd872b@386",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Crimes by Location

Companion notebook for the 
[2018 Chicago Crimes Heatmap](https://beta.observablehq.com/@randomfractals/deck-gl-heatmap)
and
[Intro to Using Apache Arrow JS with Large Datasets](https://beta.observablehq.com/@randomfractals/apache-arrow)
`
)})
    },
    {
      name: "charts",
      inputs: ["plotMonthlyData","locationData"],
      value: (function(plotMonthlyData,locationData)
{
  const locations = ['STREET', 'RESIDENCE', 'APARTMENT', 'SIDEWALK', 'OTHER'];
  const charts = locations.map(location => plotMonthlyData(locationData[location], location)); 
  return Promise.all(charts);
}
)
    },
    {
      inputs: ["html","charts"],
      value: (function(html,charts){return(
html `
<div style="display: inline-block; vertical-align: top; padding: 10px;">
  ${charts.map(c => c)}
</div>
`
)})
    },
    {
      inputs: ["html","locationData","textCloud"],
      value: (function(html,locationData,textCloud){return(
html `
<h2>Top 30 Locations</h2>
<div>${Object.keys(locationData)
  .map(locationType => textCloud(locationData, locationType))
  .sort((a, b) => b.count - a.count)
  .slice(0, 30) // top 30
  .map(c => c.html)}
  ...
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
  id: "07612a7a7cfd872b@386",
  modules: [m0,m1,m2]
};

export default notebook;
