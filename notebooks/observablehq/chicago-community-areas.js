// URL: https://beta.observablehq.com/@randomfractals/chicago-community-areas
// Title: Chicago Community Areas
// Author: Taras Novak (@randomfractals)
// Version: 54
// Runtime version: 1

const m0 = {
  id: "fe14c39662a972fa@54",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Community Areas

Chicago is divided into 77 community areas and 9 sides as defined by the Social Science Research Committee at the University of Chicago back in 2012:

https://en.wikipedia.org/wiki/Community_areas_in_Chicago

We'll map it next with [#Vega Lite Embed Geo Projection](https://beta.observablehq.com/search?query=vega%20lite%20embed%20geo%20projection)`
)})
    },
    {
      inputs: ["html"],
      value: (function(html){return(
html `<img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Map_of_the_Community_Areas_and_%27Sides%27_of_the_City_of_Chicago.svg"></img>`
)})
    },
    {
      name: "embed",
      inputs: ["require"],
      value: (function(require){return(
require("vega-embed@3")
)})
    },
    {
      name: "mapWidth",
      inputs: ["width"],
      value: (function(width){return(
width
)})
    },
    {
      name: "mapHeight",
      inputs: ["mapWidth"],
      value: (function(mapWidth){return(
mapWidth*.6
)})
    },
    {
      name: "outlineColor",
      value: (function(){return(
'#333'
)})
    },
    {
      name: "hoverStyle",
      inputs: ["html"],
      value: (function(html){return(
html`
<style>
  .vega-embed .mark-shape path:hover {
    fill-opacity: 0.5;
    fill: #000 !important;
  }
</style>
`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## Chicago Communities Geo Data`
)})
    },
    {
      name: "geoJsonUrl",
      value: (function(){return(
'https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/data/chicago-community-areas.geojson'
)})
    },
    {
      name: "geoData",
      inputs: ["d3","geoJsonUrl"],
      value: (function(d3,geoJsonUrl){return(
d3.json(geoJsonUrl)
)})
    },
    {
      name: "communities",
      inputs: ["geoData"],
      value: (function(geoData){return(
geoData.features.map(area => area.properties.community)
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
  id: "fe14c39662a972fa@54",
  modules: [m0]
};

export default notebook;
