// URL: https://beta.observablehq.com/@randomfractals/chicago-community-areas
// Title: Chicago Community Areas
// Author: Taras Novak (@randomfractals)
// Version: 113
// Runtime version: 1

const m0 = {
  id: "fe14c39662a972fa@113",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Community Areas

Chicago is divided into 77 community areas and 9 sides as defined by the Social Science Research Committee at the University of Chicago back in 2012:

https://en.wikipedia.org/wiki/Community_areas_in_Chicago
`
)})
    },
    {
      inputs: ["html"],
      value: (function(html){return(
html `<img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Map_of_the_Community_Areas_and_%27Sides%27_of_the_City_of_Chicago.svg"></img>`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## Mapping Chicago Communites with [Vega Lite Embed Geo Projection](https://vega.github.io/vega-lite/docs/projection.html)`
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
      name: "viewof map",
      inputs: ["embed","width","layers"],
      value: (function(embed,width,layers){return(
embed({
  "width": width,
  "height": width * .6,
  "layer": layers,
  "config": {
    "view": {
      "stroke": "transparent"
    },
  }
})
)})
    },
    {
      name: "map",
      inputs: ["Generators","viewof map"],
      value: (G, _) => G.input(_)
    },
    {
      name: "layers",
      value: (function()
{}
)
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
md `## Chicago Communities Data`
)})
    },
    {
      name: "geoJsonUrl",
      value: (function(){return(
'https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/data/chicago-community-areas.geojson'
)})
    },
    {
      name: "infoUrl",
      value: (function(){return(
'https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/data/chicago-community-areas.csv'
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require('d3')
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
      name: "communityData",
      inputs: ["d3","infoUrl"],
      value: (function(d3,infoUrl){return(
d3.csv(infoUrl)
)})
    },
    {
      name: "sides",
      inputs: ["communityData"],
      value: (function(communityData)
{
  // group communities by side
  const sides = {}
  communityData.slice(1) // skip 1st null row
    .map(community => {
      if (!sides[community.Side]) {
        sides[community.Side] = [];
      }
      sides[community.Side].push(community);
    });
  return sides;
}
)
    },
    {
      name: "communities",
      inputs: ["communityData"],
      value: (function(communityData)
{
  // create communities info map
  const communities = {}
  communityData.slice(1) // skip 1st null row
    .map(community => communities[community.CommunityName.toLowerCase()] = community);       
  return communities;
}
)
    },
    {
      name: "features",
      inputs: ["addCommunityInfo","geoData","communities"],
      value: (function(addCommunityInfo,geoData,communities){return(
addCommunityInfo(geoData, communities)
)})
    },
    {
      name: "addCommunityInfo",
      value: (function(){return(
function addCommunityInfo(geoData, communities) {
  geoData.features.map(feature => {
    // replace community name with community info
    const communityName = feature.properties.community.toLowerCase();
    feature.properties.community = communities[communityName];
  });
  return geoData.features;
}
)})
    }
  ]
};

const notebook = {
  id: "fe14c39662a972fa@113",
  modules: [m0]
};

export default notebook;
