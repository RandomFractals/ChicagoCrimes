// URL: https://beta.observablehq.com/@randomfractals/chicago-homicides-treemap
// Title: Chicago Homicides Treemap
// Author: Taras Novak (@randomfractals)
// Version: 226
// Runtime version: 1

const m0 = {
  id: "540643c8c4924ccd@226",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Homicides Treemap

This treemap displays Chicago homicides by 'side' and community area.

Chicago is divided into 9 sides and 77 community areas as defined by the Social Science Research Committee at the University of Chicago back in 2012:

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
      name: "data",
      inputs: ["groupBySide","sides","homicides"],
      value: (function(groupBySide,sides,homicides){return(
groupBySide(sides, homicides)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `*mouseover for extended crime data cell toolip*`
)})
    },
    {
      name: "chart",
      inputs: ["treemap","data","d3","DOM","width","height","format","color"],
      value: (function(treemap,data,d3,DOM,width,height,format,color)
{
  const root = treemap(data);

  const svg = d3.select(DOM.svg(width, height))
      .style("width", "100%")
      .style("height", "auto")
      .style("font", "10px sans-serif");

  const leaf = svg.selectAll("g")
    .data(root.leaves())
    .enter().append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

  leaf.append("title")
      .text(d => `${format(d.value)} on ${d.ancestors().reverse().map(d => d.data.name).join("/").replace('flare/', '')}`);

  leaf.append("rect")
      .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", 0.6)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);

  leaf.append("clipPath")
      .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
    .append("use")
      .attr("xlink:href", d => d.leafUid.href);

  leaf.append("text")
      .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
    .enter().append("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => (i === nodes.length - 1) * 3 + 16 + (i - 0.5) * 9)
      .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
      .text(d => d);

  return svg.node();
}
)
    },
    {
      name: "treemap",
      inputs: ["d3","width","height"],
      value: (function(d3,width,height){return(
data => d3.treemap()
    .size([width, height])
    .padding(1)
    .round(true)
  (d3.hierarchy(data)
    .sum(d => d.size)
    .sort((a, b) => b.height - a.height || b.value - a.value))
)})
    },
    {
      name: "height",
      inputs: ["width"],
      value: (function(width){return(
width
)})
    },
    {
      name: "color",
      inputs: ["d3"],
      value: (function(d3){return(
d3.scaleOrdinal().range(d3.schemeCategory10)
)})
    },
    {
      name: "format",
      inputs: ["d3"],
      value: (function(d3){return(
d3.format(",d")
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## Chicago Sides/Communities Data`
)})
    },
    {
      name: "communitiesInfoUrl",
      value: (function(){return(
'https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/data/chicago-community-areas.csv'
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
      name: "groupBySide",
      inputs: ["groupByCommunity"],
      value: (function(groupByCommunity){return(
function groupBySide(sides, homicides) {
  const communityData = groupByCommunity(homicides);
  return {
    name: 'flare',
    children: Object.keys(sides).map(sideName => {
      return {
        name: sideName, 
        children: sides[sideName].map(community => {
          return {
            name: community.CommunityName, 
            size: communityData[community.CommunityArea].length
          };
        })
      };
    })
  };
}
)})
    },
    {
      name: "groupByCommunity",
      value: (function(){return(
function groupByCommunity (data) {
  const communityData = {};
  data.map(d => {
    const communityId = d['Community Area'];
    if (!communityData[communityId]) {
      communityData[communityId] = [];
    }
    communityData[communityId].push(d);
  });
  return communityData;  
}
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require("https://d3js.org/d3.v5.min.js")
)})
    }
  ]
};

const notebook = {
  id: "540643c8c4924ccd@226",
  modules: [m0]
};

export default notebook;
