// URL: https://beta.observablehq.com/@randomfractals/chicago-crimes-in-perspective
// Title: Chicago Crimes in Perspective
// Author: Taras Novak (@randomfractals)
// Version: 84
// Runtime version: 1

const m0 = {
  id: "a216fb3c208b91cb@84",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Crimes in Perspective

see [Intro to Perspective.js](https://beta.observablehq.com/@randomfractals/perspective) for more info on that dataViz framework.`
)})
    },
    {
      name: "viewer",
      inputs: ["html","width"],
      value: (function(html,width){return(
html `
<div style="height:${width*.6}px">
  <perspective-viewer
    view="grid"
    sort='[["PrimaryType", "desc"]]'
    columns='["PrimaryType", "Block"]'>
  </perspective-viewer>
</div>
`
)})
    },
    {
      name: "dataUrl",
      value: (function(){return(
'https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/data/2018/chicago-crimes-2018.arrow'
)})
    },
    {
      name: "perspectiveView",
      inputs: ["require"],
      value: (function(require){return(
require('https://unpkg.com/@jpmorganchase/perspective-examples/build/perspective.view.js')
)})
    },
    {
      name: "viewerLoad",
      inputs: ["require","loadData","dataUrl"],
      value: (function(require,loadData,dataUrl){return(
window.addEventListener('WebComponentsReady', function() {
  const viewer = document.getElementsByTagName('perspective-viewer')[0];
  require('https://unpkg.com/@jpmorganchase/perspective-examples/build/hypergrid.plugin.js');
  require('https://unpkg.com/@jpmorganchase/perspective-examples/build/highcharts.plugin.js');  
  loadData(dataUrl).then(buffer => {
    console.log('Loading view data...');
    viewer.load(buffer);
    viewer._toggle_config();
  });
})
)})
    },
    {
      name: "viewerStyle",
      inputs: ["html"],
      value: (function(html){return(
html`
<style>
perspective-viewer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
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
  id: "a216fb3c208b91cb@84",
  modules: [m0,m1]
};

export default notebook;
