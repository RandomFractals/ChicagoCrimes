// URL: https://beta.observablehq.com/@randomfractals/chicago-homicides
// Title: Chicago Homicides
// Author: Taras Novak (@randomfractals)
// Version: 52
// Runtime version: 1

const m0 = {
  id: "2c207c68a127a60d@52",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Homicides`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `Fork this notebook and graph it here!

I'd like to see what other dataViz pros would do plotting Chicago homicides.

Get creative! Some inspirational notebooks I've done parsing this gruesome dataset:

[Chicago Crimes](https://beta.observablehq.com/search?query=Chicago%20Crimes)

I'll drop the latest extended homicides data from 2001 through 8-8-20218 shortly`
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
      name: "fields",
      inputs: ["dataTable"],
      value: (function(dataTable){return(
dataTable.schema.fields.map(f => f.name)
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
      name: "homicides",
      inputs: ["groupByDay","crimeData"],
      value: (function(groupByDay,crimeData){return(
groupByDay(crimeData['HOMICIDE'], 'HOMICIDE')
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
      from: "@randomfractals/chicago-crimes-by-type",
      name: "groupByField",
      remote: "groupByField"
    },
    {
      from: "@randomfractals/chicago-crimes-ridgeline",
      name: "groupByDay",
      remote: "groupByDay"
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
  id: "@randomfractals/chicago-crimes-ridgeline",
  variables: [
    {
      name: "groupByDay",
      value: (function(){return(
function groupByDay(dataArray, crimeType) {
  let daily = {};
  dataArray.map(data => {
    const day = data.date.toISOString().substring(0, 10); // ISO date string
    if (!daily[day]) {
      daily[day] = [];
    }
    daily[day].push(data);
  });
  return daily;
}
)})
    }
  ]
};

const notebook = {
  id: "2c207c68a127a60d@52",
  modules: [m0,m1,m2,m3]
};

export default notebook;
