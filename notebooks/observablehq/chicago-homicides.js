// URL: https://beta.observablehq.com/@randomfractals/chicago-homicides
// Title: Chicago Homicides
// Author: Taras Novak (@randomfractals)
// Version: 93
// Runtime version: 1

const m0 = {
  id: "2c207c68a127a60d@93",
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
md `**Fork this notebook and graph it here!**

I'd like to see what other dataViz pros would do plotting Chicago homicides.

Get creative! Some inspirational dataViz notebooks parsing this dataset:

[Chicago Crimes](https://beta.observablehq.com/search?query=Chicago%20Crimes)
`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## Homicides Data`
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
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require('d3')
)})
    }
  ]
};

const notebook = {
  id: "2c207c68a127a60d@93",
  modules: [m0]
};

export default notebook;
