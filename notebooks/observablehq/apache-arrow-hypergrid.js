// URL: https://beta.observablehq.com/@randomfractals/apache-arrow-hypergrid
// Title: Apache Arrow Hypergrid
// Author: Taras Novak (@randomfractals)
// Version: 60
// Runtime version: 1

const m0 = {
  id: "0d17e2847d58298f@60",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Apache Arrow Hypergrid

short example of displaying 124+K rows of 
[Apache Arrow](https://beta.observablehq.com/@randomfractals/apache-arrow)
data with [fin-hypergid](https://beta.observablehq.com/@randomfractals/fin-hypergrid)
canvas renderer`
)})
    },
    {
      inputs: ["html","width"],
      value: (function(html,width){return(
html `<div id="grid" style="position:relative; width:${width}px; height:400px"></div>`
)})
    },
    {
      name: "grid",
      inputs: ["showData","data"],
      value: (function(showData,data){return(
showData(data, document.querySelector('div#grid'))
)})
    },
    {
      name: "showData",
      value: (function(){return(
function showData (data, gridDiv) {
  return new window.fin.Hypergrid(gridDiv, {data: data});
}
)})
    },
    {
      name: "Hypergrid",
      inputs: ["require"],
      value: (function(require){return(
require('https://fin-hypergrid.github.io/core/demo/build/fin-hypergrid.js').catch(() => window.fin.Hypergrid)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## Data`
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
      inputs: ["toDate","arrow"],
      value: (function(toDate,arrow){return(
function toJSON(dataTable) {
  let date, block, location, arrested, type, info, lat, lng, results = [];
  dataTable.scan((index) => {
      results.push({
        'Date': toDate(date(index)).toISOString().substring(0, 10), // ISO date string        
        'Location': `${block(index)} (${location(index).toLowerCase()})`,
        'Arrested': arrested(index),
        'Description': `${type(index).toLowerCase()}: ${info(index).toLowerCase()}`,
        //'Latitude': lat(index),
        //'Longitude': lng(index),
      });
    }, (batch) => {
      date = arrow.predicate.col('Date').bind(batch);        
      block = arrow.predicate.col('Block').bind(batch);    
      location = arrow.predicate.col('LocationDescription').bind(batch);    
      arrested = arrow.predicate.col('Arrest').bind(batch);    
      type = arrow.predicate.col('PrimaryType').bind(batch);    
      info = arrow.predicate.col('Description').bind(batch);    
      lat = arrow.predicate.col('Latitude').bind(batch);
      lng = arrow.predicate.col('Longitude').bind(batch);    
    }
  );
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
  id: "0d17e2847d58298f@60",
  modules: [m0,m1]
};

export default notebook;
