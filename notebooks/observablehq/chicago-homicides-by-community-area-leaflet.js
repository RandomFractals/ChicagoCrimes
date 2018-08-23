// URL: https://beta.observablehq.com/@randomfractals/chicago-homicides-by-community-area-leaflet
// Title: Chicago Homicides by Community Area Leaflet
// Author: Taras Novak (@randomfractals)
// Version: 315
// Runtime version: 1

const m0 = {
  id: "a4d06b248e8c595c@315",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Homicides by Community Area Leaflet

Chicago is divided into 77 community areas and 9 sides as defined by the Social Science Research Committee at the University of Chicago back in 2012:

https://en.wikipedia.org/wiki/Community_areas_in_Chicago
`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## Chicago Homicides Data, 2001-2018

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
      inputs: ["md"],
      value: (function(md){return(
md `## Mapping Chicago Homicides by Community with [LeafletJS](https://leafletjs.com/)`
)})
    },
    {
      name: "map",
      inputs: ["DOM","width","createMap","communities","L","geoData","homicidesByCommunity"],
      value: (function*(DOM,width,createMap,communities,L,geoData,homicidesByCommunity)
{
  // create map container and leaflet map
  const mapContainer = DOM.element('div', {style: `width:${width}px;height:${width/1.6}px`});
  yield mapContainer;
  const map = createMap(mapContainer);

  // data mapping patch
  communities['lake view'] = communities['lakeview'];
  communities['ohare'] = communities["o'hare"];
  
  // create communities map layer
  // todo: color by homicides count
  const communitiesLayer = L.geoJson(geoData, {
    weight: 2,
    color: '#000',
    onEachFeature: function (feature, layer) {
      const communityName = feature.properties.community.toLowerCase();
      const community = communities[communityName];
      const html = `<div class="popup"><h4>${homicidesByCommunity[community.CommunityArea].length} in ${community.CommunityName}, ${community.Side}</h4></div>`;
      layer.bindPopup(html);
      layer.bindTooltip(html, {sticky: true});
    }
  }).addTo(map);
}
)
    },
    {
      name: "L",
      inputs: ["require"],
      value: (function(require){return(
require('leaflet@1.3.2')
)})
    },
    {
      name: "leafletCSS",
      inputs: ["html","resolve"],
      value: (function(html,resolve){return(
html`<link href='${resolve('leaflet@1.2.0/dist/leaflet.css')}' rel='stylesheet' />`
)})
    },
    {
      name: "sideColors",
      inputs: ["d3"],
      value: (function(d3){return(
d3[`scheme${'Pastel1'}`]
)})
    },
    {
      name: "createMap",
      inputs: ["L"],
      value: (function(L){return(
function createMap(mapContainer) {
  // create Stamen leaflet toner map with attributions
  const map = L.map(mapContainer).setView([41.85, -87.68], 10); // Chicago origins
  const mapTiles = '//stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
  const osmCPLink = '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  const mapCPLink = '<a href="http://maps.stamen.com/toner">Stamen Design</a>';
  const tileLayer = L.tileLayer(mapTiles, {
    attribution: `${osmCPLink} | ${mapCPLink}`,
    detectRetina: false,
    maxZoom: 18,
    minZoom: 10,
    noWrap: false,
    subdomains: 'abc'
  }).addTo(map);
  return map;
}
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
      name: "communitiesInfoUrl",
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
      inputs: ["d3","communitiesInfoUrl"],
      value: (function(d3,communitiesInfoUrl){return(
d3.csv(communitiesInfoUrl)
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
      name: "homicidesByCommunity",
      inputs: ["groupByField","homicides"],
      value: (function(groupByField,homicides){return(
groupByField(homicides, 'Community Area')
)})
    },
    {
      name: "groupByField",
      value: (function(){return(
function groupByField(dataArray, groupField) {
  let results = {};
  dataArray.map(data => {
    const key = data[groupField];
    if (!results[key]) {
      results[key] = [];
    }
    results[key].push(data);
  });
  return results;
}
)})
    }
  ]
};

const notebook = {
  id: "a4d06b248e8c595c@315",
  modules: [m0]
};

export default notebook;
