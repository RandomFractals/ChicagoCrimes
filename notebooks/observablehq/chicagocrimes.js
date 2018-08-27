// URL: https://beta.observablehq.com/@randomfractals/chicagocrimes
// Title: Chicago Crimes EDA
// Author: Taras Novak (@randomfractals)
// Version: 82
// Runtime version: 1

const m0 = {
  id: "8db142c9acb93c5b@82",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Crimes EDA

Exploratory data analysis of 2018 Chicago Crimes with Apache Arrow JS data, various mapping and charting libs.

See similar 2017 Python notebooks data summary at: https://www.linkedin.com/pulse/chicago-crimes-2017-taras-novak/

and live repo for this project at: https://github.com/RandomFractals/ChicagoCrimes

Data Source: [Chicago Data Portal/Public Safety/Crimes 2001 to present](https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-present/ijzp-q8t2)
`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## [2018 Chicago Crimes Notebooks](https://beta.observablehq.com/search?query=Chicago%20Crimes)`
)})
    },
    {
      inputs: ["html"],
      value: (function(html){return(
html `<a href="https://beta.observablehq.com/search?query=Chicago%20Crimes">
  <img src="https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/notebooks/observablehq/chicago-crimes-2018-js-notebooks.png" alt="Search Chicago Crimes" />
</a>
`
)})
    },
    {
      name: "crimesNotebooks",
      inputs: ["md","getLinksMarkdown","searchByTitle","notebooks"],
      value: (function(md,getLinksMarkdown,searchByTitle,notebooks){return(
md `${getLinksMarkdown(searchByTitle(notebooks, 'chicago crimes'))}`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md `## [Chicago Homicides, 2001-2018, Notebooks](https://beta.observablehq.com/search?query=Chicago%20Homicides)`
)})
    },
    {
      name: "homicides",
      inputs: ["html"],
      value: (function(html){return(
html `<a href="https://beta.observablehq.com/search?query=Chicago%20Homicides">
  <img src="https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/notebooks/observablehq/chicago-homicides-notebooks-3.png" alt="Search Chicago Homicides" />
</a>
`
)})
    },
    {
      name: "homicidesNotebooks",
      inputs: ["md","getLinksMarkdown","searchByTitle","notebooks"],
      value: (function(md,getLinksMarkdown,searchByTitle,notebooks){return(
md `${getLinksMarkdown(searchByTitle(notebooks, 'chicago homicides'))}`
)})
    },
    {
      from: "@randomfractals/notebooks",
      name: "notebooks",
      remote: "notebooks"
    },
    {
      from: "@randomfractals/notebooks",
      name: "searchByTitle",
      remote: "searchByTitle"
    },
    {
      from: "@randomfractals/notebooks",
      name: "getLinksMarkdown",
      remote: "getLinksMarkdown"
    }
  ]
};

const m1 = {
  id: "@randomfractals/notebooks",
  variables: [
    {
      name: "notebooks",
      inputs: ["MAXDOCS","apiUrl","userName"],
      value: (async function*(MAXDOCS,apiUrl,userName)
{
  const documents = [];
  var last = "4096-01-01T00:45:25.493Z"; // infinite future
  var seen = false;
  do {
    seen = (await fetch(`${apiUrl}/documents/@${userName}?before=${last}`).then(d => d.json()))
    .map(d => {
      documents.push(d);
      last = d.update_time;
    }).length;
    yield documents.slice(0, MAXDOCS);
  } while (seen && documents.length < MAXDOCS)
}
)
    },
    {
      name: "searchByTitle",
      value: (function(){return(
function searchByTitle(notebooks, title) {
  const matchingNotebooks = [];
  notebooks.map(notebook => {
    if( notebook.title.toLowerCase().indexOf(title) >= 0) {
      matchingNotebooks.push(notebook); 
    }
  });
  return matchingNotebooks;
}
)})
    },
    {
      name: "getLinksMarkdown",
      inputs: ["userName"],
      value: (function(userName){return(
function getLinksMarkdown(notebooks) {
  const links = [];
  return notebooks.map(notebook => `[${notebook.title}](https://beta.observablehq.com/@${userName}/${notebook.slug})<br /><br />`)
    .reduce((html, link) => html + link);
}
)})
    },
    {
      name: "MAXDOCS",
      value: (function(){return(
210
)})
    },
    {
      name: "apiUrl",
      value: (function(){return(
"https://cors-anywhere.herokuapp.com/" + "https://api.observablehq.com"
)})
    },
    {
      name: "viewof userName",
      inputs: ["md"],
      value: (function(md){return(
md`<input value=randomfractals>`
)})
    },
    {
      name: "userName",
      inputs: ["Generators","viewof userName"],
      value: (G, _) => G.input(_)
    }
  ]
};

const notebook = {
  id: "8db142c9acb93c5b@82",
  modules: [m0,m1]
};

export default notebook;
