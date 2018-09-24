// URL: https://beta.observablehq.com/@randomfractals/chicago-homicides-by-beat
// Title: Chicago Homicides by Beat
// Author: Taras Novak (@randomfractals)
// Version: 122
// Runtime version: 1

const m0 = {
  id: "3b482e5d3f3ab765@122",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Homicides by Beat`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `**TODO: create homicides by police beat over time map**

see current police beats map boundaries provided by the city of Chicago here:

https://data.cityofchicago.org/Public-Safety/Boundaries-Police-Beats-current-/aerh-rz74
`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## Homicides Data

Data Source: [Chicago Data Portal/Public Safety/Crimes 2001 to present](https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-present/ijzp-q8t2)`
)})
    },
    {
      name: "dataUrl",
      value: (function(){return(
'https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/data/2018/chicago-homicides-2001-2018.csv'
)})
    },
    {
      name: "homicides",
      inputs: ["d3","dataUrl"],
      value: (function(d3,dataUrl){return(
d3.csv(dataUrl)
)})
    },
    {
      name: "dailyHomicides",
      inputs: ["groupByDay","homicides"],
      value: (function(groupByDay,homicides){return(
groupByDay(homicides)
)})
    },
    {
      name: "groupByDay",
      value: (function(){return(
function groupByDay(dataArray) {
  let daily = {};
  dataArray.map(data => {
    const date = new Date(data.Date);
    const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
    const day = new Date(date.getTime() - timezoneOffset).toISOString().substring(0, 10); // ISO date string;
    if (!daily[day]) {
      daily[day] = [];
    }
    daily[day].push(data);
  });
  return daily;
}
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require('d3')
)})
    }
  ]
};

const notebook = {
  id: "3b482e5d3f3ab765@122",
  modules: [m0]
};

export default notebook;
