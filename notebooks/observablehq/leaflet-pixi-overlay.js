// URL: https://beta.observablehq.com/@randomfractals/leaflet-pixi-overlay
// Title: Leaflet Pixi Overlay
// Author: Taras Novak (@randomfractals)
// Version: 630
// Runtime version: 1

const m0 = {
  id: "310a1a019d012db9@630",
  variables: [
    {
      name: "intro",
      inputs: ["md"],
      value: (function(md){return(
md`# Leaflet Pixi Overlay

This is my sandbox of [leaflet.js](https://leafletjs.com/) / 
[pixi.js](http://www.pixijs.com/) map overaly drawing for the 
[Chicago Crimes](https://www.linkedin.com/pulse/chicago-crimes-2017-taras-novak/) 
2018 revisit in JS.

We'll be wiring [Leaflet.PixiOverlay](https://github.com/manubb/Leaflet.PixiOverlay)
for this sample data map. You might also want to try
[Leaflet.glify plugin](https://github.com/robertleeplummerjr/Leaflet.glify) 
or straight up webgl to [draw many points on the map](http://bl.ocks.org/Sumbera/c6fed35c377a46ff74c3) 
or do it with [mapbox-gl.js](https://github.com/mapbox/mapbox-gl-js) 

Fresh 2018 Chicago crimes data loaded below with over 124K recrods for this webgl map notebook combo. See Imports section for the Leaflet, Pixi and PixiOverlay.js setup at the bottom.

Aslo see my [Intro to Using Apache Arrow JS with Large Datasets](https://beta.observablehq.com/@randomfractals/apache-arrow)`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Data`
)})
    },
    {
      name: "dataUrl",
      value: (function(){return(
'https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/data/2018/chicago-crimes-2018.arrow'
)})
    },
    {
      name: "data",
      inputs: ["dataUrl","arrow"],
      value: (async function(dataUrl,arrow)
{
  const response = await fetch(dataUrl);
  const dataTable = await response.arrayBuffer().then(buffer => {
    return arrow.Table.from(new Uint8Array(buffer));
  });
  return dataTable;
}
)
    },
    {
      name: "fields",
      inputs: ["data"],
      value: (function(data){return(
data.schema.fields.map(f => f.name)
)})
    },
    {
      name: "fieldTypes",
      inputs: ["data"],
      value: (function(data){return(
data.schema.fields.map(f => f.type)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Arrow Data Sample`
)})
    },
    {
      name: "every10KRecord",
      inputs: ["range","data"],
      value: (function(range,data){return(
range(data, 0, data.count(), 10000)
)})
    },
    {
      inputs: ["md","getMarkdown","every10KRecord","fields"],
      value: (function(md,getMarkdown,every10KRecord,fields){return(
md`${getMarkdown(every10KRecord, fields)}`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Map`
)})
    },
    {
      name: "viewof startDaySlider",
      inputs: ["slider","days"],
      value: (function(slider,days){return(
slider({min: 0, max: days, step: 1, value: 0})
)})
    },
    {
      name: "startDaySlider",
      inputs: ["Generators","viewof startDaySlider"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof endDaySlider",
      inputs: ["slider","days"],
      value: (function(slider,days){return(
slider({min: 0, max: days, step: 1, value: days})
)})
    },
    {
      name: "endDaySlider",
      inputs: ["Generators","viewof endDaySlider"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof selectedType",
      inputs: ["select"],
      value: (function(select){return(
select(['HOMICIDE', 'KIDNAPPING', 'PROSTITUTION', 'ARSON'])
)})
    },
    {
      name: "selectedType",
      inputs: ["Generators","viewof selectedType"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["md","startDate","startDaySlider","millisPerDay","endDaySlider","filteredData"],
      value: (function(md,startDate,startDaySlider,millisPerDay,endDaySlider,filteredData){return(
md`**from:** ${new Date(startDate.getTime() + startDaySlider*millisPerDay).toLocaleDateString()}
**to:** ${new Date(startDate.getTime() + endDaySlider*millisPerDay).toLocaleDateString()}
**count:** ${filteredData.length.toLocaleString()}
`
)})
    },
    {
      name: "map",
      inputs: ["DOM","width","createMap","pixiContainer","circle","createMapDataOverlay","filteredData","textures"],
      value: (function*(DOM,width,createMap,pixiContainer,circle,createMapDataOverlay,filteredData,textures)
{
  // create map container and leaflet map
  const mapContainer = DOM.element('div', {style: `width:${width}px;height:${width/1.6}px`});
  yield mapContainer;
  const map = createMap(mapContainer);
  
  // add Chicago center point to the Pixi container
  pixiContainer.addChild(circle);
  pixiContainer.interactive = true;
	pixiContainer.buttonMode = true;
  
  // create leaflet pixi overlay and draw points
  const pixiOverlay = createMapDataOverlay(map, filteredData, textures);
  pixiOverlay.addTo(map);
}
)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Map Vars`
)})
    },
    {
      name: "filteredData",
      inputs: ["filterByDate","data","startDate","startDaySlider","millisPerDay","endDaySlider"],
      value: (function(filterByDate,data,startDate,startDaySlider,millisPerDay,endDaySlider){return(
filterByDate(data, 
  new Date(startDate.getTime() + startDaySlider*millisPerDay),
  new Date(startDate.getTime() + endDaySlider*millisPerDay))
)})
    },
    {
      name: "startDate",
      value: (function(){return(
new Date('1/1/2018')
)})
    },
    {
      name: "endDate",
      value: (function(){return(
new Date('6/30/2018')
)})
    },
    {
      name: "days",
      inputs: ["endDate","startDate","millisPerDay"],
      value: (function(endDate,startDate,millisPerDay){return(
Math.ceil((endDate - startDate) / millisPerDay)
)})
    },
    {
      name: "millisPerDay",
      value: (function(){return(
24 * 60 * 60 * 1000
)})
    },
    {
      name: "pixiContainer",
      inputs: ["PIXI"],
      value: (function(PIXI){return(
new PIXI.Container()
)})
    },
    {
      name: "circle",
      inputs: ["PIXI"],
      value: (function(PIXI){return(
new PIXI.Graphics()
)})
    },
    {
      name: "textures",
      inputs: ["loadTextures"],
      value: (function(loadTextures){return(
loadTextures().then(t => t)
)})
    },
    {
      name: "doubleBuffering",
      value: (function(){return(
/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Map Functions`
)})
    },
    {
      name: "filterByDate",
      inputs: ["arrow","toDate","selectedType"],
      value: (function(arrow,toDate,selectedType){return(
function filterByDate(data, startDate, endDate) {
  let lat, long, date, block, type, info, results = [];
  const dateFilter = arrow.predicate.custom(i => {
    const date = toDate(data.getColumn('Date').get(i));
    const type = data.getColumn('PrimaryType').get(i);
    return date >= startDate && date <= endDate && type === selectedType;
  }, b => 1);  
  data.filter(dateFilter)   
    .scan((index) => {
      results.push({
        'lat': lat(index),
        'long': long(index),
        'info': `${block(index)}<br />${type(index)}<br />${info(index)}<br />${toDate(date(index)).toLocaleString()}`
      });
    }, (batch) => {
      lat = arrow.predicate.col('Latitude').bind(batch);
      long = arrow.predicate.col('Longitude').bind(batch);
      date = arrow.predicate.col('Date').bind(batch);
      block = arrow.predicate.col('Block').bind(batch);
      type = arrow.predicate.col('PrimaryType').bind(batch);
      info = arrow.predicate.col('Description').bind(batch);
    }
  );
  return results;
}
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
      name: "loadTextures",
      inputs: ["PIXI"],
      value: (function(PIXI){return(
function loadTextures() {
  // create pixi textures loader
  const loader = new PIXI.loaders.Loader();
  
  // add marker textures
  loader.add('circle', 'https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/maps/markers/black-circle.png');
  loader.add('focusCircle', 'https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/maps/markers/red-circle.png');

  // load marker pics
  return new Promise((resolve, reject) => {
    loader.load((loader, resources) => {
      const textures = [];    
      textures.push(resources.circle.texture);
      textures.push(resources.focusCircle.texture);
      resolve(textures);
    });
  });
}
)})
    },
    {
      name: "createMapDataOverlay",
      inputs: ["L","d3","circle","createMarker","solveCollision","findMarker","drawPoint","rescaleMarker","pixiContainer","doubleBuffering"],
      value: (function(L,d3,circle,createMarker,solveCollision,findMarker,drawPoint,rescaleMarker,pixiContainer,doubleBuffering){return(
function createMapDataOverlay(map, data, textures) {
  return L.pixiOverlay(utils => {
    // pixi overlay projection utils vars
    const pixiContainer = utils.getContainer();
    const renderer = utils.getRenderer();
    const project = utils.latLngToLayerPoint;
    const zoom = utils.getMap().getZoom();    
    const scale = utils.getScale();
    const scaleInverse = 1/scale;
    const duration = 250; // 100;
    const markers = [];
    // TODO: color scale based on crime type
    const colorScale = d3.scaleLinear()
		  .domain([0, 50, 100])
			.range(["#c6233c", "#ffd300", "#008000"]);
    
    // drawing vars
		let start = null;
    let frame = null;
		let firstDraw = true;
		let lastMapZoom;
		let centerPoint = [41.85, -87.68];
		let centerPointXY;
		let pointRadius = 5;
    let focusMarker = null;
    
		if (frame) { // reset zoom animation
		  cancelAnimationFrame(frame);
			frame = null;
		}    
    
    // add center point for preview
		[circle].forEach(function(geo) {
			geo.interactive = true;
		});
    
    if (firstDraw) {
      lastMapZoom = zoom;
			centerPointXY = project(centerPoint);
			pointRadius = pointRadius / scale;
      
      // plot data points
      const pointTexture = textures[0]; // circle png
      pixiContainer.removeChildren();
      data.forEach(dataPoint => {
        const xyPoint = project([dataPoint.lat, dataPoint.long]);
        const marker = createMarker(xyPoint.x, xyPoint.y, pointTexture, scaleInverse);
        marker.lat = dataPoint.lat;
        marker.long = dataPoint.long;
        marker.info = dataPoint.info;
        // TODO: tint them later based on crime type
        // const tint = d3.color(colorScale(marker.avancement || Math.random() * 100)).rgb();
				// marker.tint = 256 * (tint.r * 256 + tint.g) + tint.b;
        pixiContainer.addChild(marker);
        markers.push(marker);
      });
      console.log('markers:', markers.length);        
      
      // create zoom quad tree
      let zoomQuadTree = {};
			for (var z = map.getMinZoom(); z <= map.getMaxZoom(); z++) {
			  const initialRadius = 8 / utils.getScale(z); 
				zoomQuadTree[z] = solveCollision(markers, {r0: initialRadius, zoom: z});
		  }
      
      // add map interactions
      map.on('click', function(e) {        
			  let redraw = false;
				if (focusMarker) {
          // reset focused marker
          focusMarker.texture = textures[focusMarker.textureIndex];
				  focusMarker = null;
					redraw = true;
				}
        
        // get marker from map click
				const marker = findMarker(project(e.latlng), zoomQuadTree, zoom);
				if (marker) {
          marker.texture = textures[1]; // set dot marker focus texture
					focusMarker = marker;
          L.popup()
            .setLatLng(e.latlng)
            .setContent(marker.info)
            .openOn(map);
					redraw = true;
				}
				if (redraw) utils.getRenderer().render(pixiContainer);
			});
    } // end of first draw

    if (firstDraw || lastMapZoom !== zoom) {
      // draw center point
      drawPoint(circle, centerPointXY.x, centerPointXY.y, pointRadius, 
        1/scale, 0xff0000, 0xff0033); // line width, line color, fill color      
      // rescale markers
      markers.forEach(marker => {
        rescaleMarker(marker, scaleInverse, zoom);
      });			
    }
    
    // animate zoom
		function animate(timestamp) {
			let progress;
		  if (start === null) start = timestamp;
		  progress = timestamp - start;
		  let lambda = progress / duration;
		  if (lambda > 1) lambda = 1;
		  lambda = lambda * (0.4 + lambda * (2.2 + lambda * -1.6));
		  markers.forEach(marker => { 
			  marker.x = marker.currentX + lambda * (marker.targetX - marker.currentX);
				marker.y = marker.currentY + lambda * (marker.targetY - marker.currentY);
				marker.scale.set(marker.currentScale + lambda * (marker.targetScale - marker.currentScale));
      });			        
			renderer.render(pixiContainer);
		  if (progress < duration) {
		    frame = requestAnimationFrame(animate);
		  }
		}

		if (!firstDraw && lastMapZoom !== zoom) {
			// start = null;
			frame = requestAnimationFrame(animate);
		}
    
    firstDraw = false;
    lastMapZoom = zoom;
    renderer.render(pixiContainer);
    
  }, pixiContainer, {
    doubleBuffering: doubleBuffering,
    destoryInteractionManager: true
  });
}
)})
    },
    {
      name: "createMarker",
      inputs: ["PIXI"],
      value: (function(PIXI){return(
function createMarker(x, y, texture, scale) {
  const sprite = new PIXI.Sprite(texture);
  sprite.textureIndex = 0;
  sprite.x0 = x;
  sprite.y0 = y;
  sprite.anchor.set(.5, .5);
  sprite.scale.set(scale);
  sprite.currentScale = scale;
  return sprite;
}
)})
    },
    {
      name: "rescaleMarker",
      value: (function(){return(
function rescaleMarker(marker, scale, zoom, redraw) {
	const position = marker.cache[zoom];
	if (!redraw) { // 1st draw
	  marker.x = position.x;
		marker.y = position.y;
		marker.scale.set((position.r * scale < 8) ? position.r/8 : scale); // 16
	} else {
	  marker.currentX = marker.x;
		marker.currentY = marker.y;
		marker.targetX = position.x;
		marker.targetY = position.y;
		marker.currentScale = marker.scale.x;
		marker.targetScale = (position.r * scale < 8) ? position.r/16 : scale; // 16
	}
}
)})
    },
    {
      name: "findMarker",
      value: (function(){return(
function findMarker(layerPoint, quad, zoom) {
  const quadTree = quad[zoom];
	const maxR = quadTree.rMax;        
	let marker;
	let found = false;
	quadTree.visit((quad, x1, y1, x2, y2) => {    
	  if (!quad.length) {
		  const dx = quad.data.x - layerPoint.x;
			const dy = quad.data.y - layerPoint.y;
			const r = quad.data.scale.x * 8; // 16;
			if (dx * dx + dy * dy <= r * r) {
			  marker = quad.data;
				found = true;
			}
		}		
    return found || 
      x1 > layerPoint.x + maxR || 
      x2 + maxR < layerPoint.x || 
      y1 > layerPoint.y + maxR || 
      y2 + maxR < layerPoint.y;
	});
	return marker;
}
)})
    },
    {
      name: "drawPoint",
      value: (function(){return(
function drawPoint(graphics, x, y, r, 
  lineWidth, lineColor, fillColor) {
  graphics.clear();
	graphics.lineStyle(lineWidth, lineColor, 1);
	graphics.beginFill(fillColor, 0.5);
	graphics.x = x;
	graphics.y = y;
	graphics.drawCircle(0, 0, r); // radius
	graphics.endFill();
}
)})
    },
    {
      name: "solveCollision",
      inputs: ["d3"],
      value: (function(d3){return(
function solveCollision(circles, opts) {
  opts = opts || {};
  var tree = d3.quadtree()
  	.x(function(d) {return d.xp;})
  	.y(function(d) {return d.yp;});
  if (opts.extent !== undefined) tree.extent(opts.extent);
  var rMax = 0;
  circles.forEach(function(circle) {
  	circle.xp = circle.x0;
  	circle.yp = circle.y0;
  	if (opts.r0 !== undefined) circle.r0 = opts.r0;
  	circle.r = circle.r0;
  	circle.xMin = circle.x0 - circle.r0;
  	circle.xMax = circle.x0 + circle.r0;
  	circle.yMin = circle.y0 - circle.r0;
  	circle.yMax = circle.y0 + circle.r0;
    
  	function collide(d) {
  		function fixCollision(node) {
  			var x = d.xp - node.xp;
  			var y = d.yp - node.yp;
  			var l = x * x + y * y;
  			var r = d.r + node.r;
  			if (l < r * r) {
  				var c1, c2, lambda1, lambda2, u1, u2;
  				var delta = Math.sqrt(l);
  				if (d.r < node.r) {
  					c1 = node; c2 = d;
  				} else {
  					c1 = d; c2 = node;
  				}
  				var r1 = c1.r;
  				var r2 = c2.r;
  				var alpha = (r1 + r2 + delta) / 4;
  				if (l > 0) {
  					u1 = (c2.xp - c1.xp) / delta;
  					u2 = (c2.yp - c1.yp) / delta;
  				} else {
  					var theta = 2 * Math.PI * Math.random();
  					u1 = Math.cos(theta);
  					u2 = Math.sin(theta);
  				} 
          
  				if (r2 >= alpha) {
  					lambda1 = alpha / r1;
  					lambda2 = alpha / r2;
  				} else {
  					lambda1 = (r1 - r2 + delta) / (2 * r1);
  					if (lambda1 > 1) console.log(lambda1);
  					lambda2 = 1;
  				}
  				c1.r *= lambda1;
  				c2.r *= lambda2;
  				c1.xp += (lambda1 - 1) * r1 * u1;
  				c1.yp += (lambda1 - 1) * r1 * u2;
  				c2.xp += (1 - lambda2) * r2 * u1;
  				c2.yp += (1 - lambda2) * r2 * u2;
  				c1.xMin = c1.xp - c1.r;
  				c1.xMax = c1.xp + c1.r;
  				c1.yMin = c1.yp - c1.r;
  				c1.yMax = c1.yp + c1.r;
  				c2.xMin = c2.xp - c2.r;
  				c2.xMax = c2.xp + c2.r;
  				c2.yMin = c2.yp - c2.r;
  				c2.yMax = c2.yp + c2.r;
  			}
  		}
  		return function(quad, x1, y1, x2, y2) {
  			if (!quad.length) {
  				do {
  					if (quad.data != d && d.xMax > quad.data.xMin && d.xMin < quad.data.xMax && d.yMax > quad.data.yMin && d.yMin < quad.data.yMax) {
  						fixCollision(quad.data);
  					}
  				} while (quad = quad.next)
  			}
  			return x1 > d.xMax + rMax || x2 + rMax < d.xMin || y1 > d.yMax + rMax || y2 + rMax < d.yMin;
  		};
  	}
  	tree.visit(collide(circle));
  	rMax = Math.max(rMax, circle.r);
  	tree.add(circle);
  });
  if (opts.zoom !== undefined) {
  	circles.forEach(function(circle) {
  		circle.cache = circle.cache || {};
  		circle.cache[opts.zoom] = {
  			x: circle.xp,
  			y: circle.yp,
  			r: circle.r
  		};
  	});
  }
  var ret = d3.quadtree()
  	.x(function(d) {return d.xp;})
  	.y(function(d) {return d.yp;});
  var rMax2 = 0;
  circles.forEach(function(circle) {
  	ret.add(circle);
  	rMax2 = Math.max(rMax2, circle.r);
  })
  ret.rMax = rMax2;
  return ret;
}
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Apache Arrow Helper Functions Imports

from [Intro to Using Apache Arrow JS with Large Datasets](https://beta.observablehq.com/@randomfractals/apache-arrow)`
)})
    },
    {
      from: "@randomfractals/apache-arrow",
      name: "toDate",
      remote: "toDate"
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
      inputs: ["md"],
      value: (function(md){return(
md`## Appache Arrow, Leaflet, Pixi JS Imports`
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
      name: "L",
      inputs: ["require"],
      value: (function(require){return(
require('leaflet@1.2.0')
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
      name: "PIXI",
      inputs: ["require"],
      value: (function(require){return(
require('https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.7.1/pixi.min.js')
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
      from: "@jashkenas/inputs",
      name: "slider",
      remote: "slider"
    },
    {
      from: "@jashkenas/inputs",
      name: "select",
      remote: "select"
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Pixi Overlay Leaflet Plugin Setup`
)})
    },
    {
      inputs: ["PixiOverlay","L","PIXI"],
      value: (function(PixiOverlay,L,PIXI)
{
  // add Pixi overlay plugin to Leaflet
  PixiOverlay(L, PIXI)
  return L.PixiOverlay;
}
)
    },
    {
      name: "PixiOverlay",
      value: (function(){return(
function PixiOverlay (L, PIXI) {
	var round = L.Point.prototype._round;
	var no_round = function () {return this;};
  
	function setInteractionManager(interactionManager, destroyInteractionManager, autoPreventDefault) {
		if (destroyInteractionManager) {
			interactionManager.destroy();
		} else if (!autoPreventDefault) {
			interactionManager.autoPreventDefault = false;
		}
	}
  
	var pixiOverlayClass = {
		options: {
			// @option padding: Number = 0.1
			// How much to extend the clip area around the map view (relative to its size)
			// e.g. 0.1 would be 10% of map view in each direction
			padding: 0.1,
			// @option forceCanvas: Boolean = false
			// Force use of a 2d-canvas
			forceCanvas: false,
			// @option doubleBuffering: Boolean = false
			// Help to prevent flicker when refreshing display on some devices (e.g. iOS devices)
			// It is ignored if rendering is done with 2d-canvas
			doubleBuffering: false,
			// @option resolution: Number = 1
			// Resolution of the renderer canvas
			resolution: L.Browser.retina ? 2 : 1,
			// @option projectionZoom(map: map): Number
			// return the layer projection zoom level
			projectionZoom: function (map) {return (map.getMaxZoom() + map.getMinZoom()) / 2;},
			// @option destroyInteractionManager:  Boolean = false
			// Destroy PIXI Interaction Manager
			destroyInteractionManager: false,
			// @option
			// Customize PIXI Interaction Manager autoPreventDefault property
			// This option is ignored if destroyInteractionManager is set
			autoPreventDefault: true
		},
		initialize: function (drawCallback, pixiContainer, options) {
			L.setOptions(this, options);
			L.stamp(this);
			this._drawCallback = drawCallback;
			this._pixiContainer = pixiContainer;
			this._rendererOptions = {
				transparent: true,
				resolution: this.options.resolution,
				antialias: true,
				forceCanvas: this.options.forceCanvas
			};
			this._doubleBuffering = PIXI.utils.isWebGLSupported() && !this.options.forceCanvas &&
				this.options.doubleBuffering;
		},
		_setMap: function () {},
		_setContainerStyle: function () {},
		_addContainer: function () {
			this.getPane().appendChild(this._container);
		},
		_setEvents: function () {},
		onAdd: function (targetMap) {
			this._setMap(targetMap);
			if (!this._container) {
				var container = this._container = L.DomUtil.create('div', 'leaflet-pixi-overlay');
				container.style.position = 'absolute';
				this._renderer = PIXI.autoDetectRenderer(this._rendererOptions);
				setInteractionManager(
					this._renderer.plugins.interaction,
					this.options.destroyInteractionManager,
					this.options.autoPreventDefault
				);
				container.appendChild(this._renderer.view);
				if (this._zoomAnimated) {
					L.DomUtil.addClass(container, 'leaflet-zoom-animated');
					this._setContainerStyle();
				}
				if (this._doubleBuffering) {
					this._auxRenderer = PIXI.autoDetectRenderer(this._rendererOptions);
					setInteractionManager(
						this._auxRenderer.plugins.interaction,
						this.options.destroyInteractionManager,
						this.options.autoPreventDefault
					);
					container.appendChild(this._auxRenderer.view);
					this._renderer.view.style.position = 'absolute';
					this._auxRenderer.view.style.position = 'absolute';
				}
			}
			this._addContainer();
			this._setEvents();
      
			var map = this._map;
			this._initialZoom = this.options.projectionZoom(map);
			this._wgsOrigin = L.latLng([0, 0]);
			this._wgsInitialShift = map.project(this._wgsOrigin, this._initialZoom);
			this._mapInitialZoom = map.getZoom();
			this._scale = map.getZoomScale(this._mapInitialZoom, this._initialZoom);
			var _layer = this;

			this.utils = {
				latLngToLayerPoint: function (latLng, zoom) {
					zoom = (zoom === undefined) ? _layer._initialZoom : zoom;
					var projectedPoint = map.project(L.latLng(latLng), zoom);
					return projectedPoint;
				},
				layerPointToLatLng: function (point, zoom) {
					zoom = (zoom === undefined) ? _layer._initialZoom : zoom;
					var projectedPoint = L.point(point);
					return map.unproject(projectedPoint, zoom);
				},
				getScale: function (zoom) {
					if (zoom === undefined) return map.getZoomScale(map.getZoom(), _layer._initialZoom);
					else return map.getZoomScale(zoom, _layer._initialZoom);
				},
				getRenderer: function () {
					return _layer._renderer;
				},
				getContainer: function () {
					return _layer._pixiContainer;
				},
				getMap: function () {
					return _layer._map;
				}
			};
			this._update({type: 'add'});
		},
		onRemove: function () {
			L.DomUtil.remove(this._container);
		},

		getEvents: function () {
			var events = {
				zoom: this._onZoom,
				moveend: this._update,
				zoomend: this._zoomChange
			};
			if (this._zoomAnimated) {
				events.zoomanim = this._onAnimZoom;
			}
			return events;
		},

		_onAnimZoom: function (e) {
			this._updateTransform(e.center, e.zoom);
		},

		_onZoom: function (e) {
			this._updateTransform(this._map.getCenter(), this._map.getZoom());
		},

		_updateTransform: function (center, zoom) {
			var scale = this._map.getZoomScale(zoom, this._zoom),
				viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding),
				currentCenterPoint = this._map.project(this._center, zoom),

				topLeftOffset = viewHalf.multiplyBy(-scale).add(currentCenterPoint)
					.subtract(this._map._getNewPixelOrigin(center, zoom));

			if (L.Browser.any3d) {
				L.DomUtil.setTransform(this._container, topLeftOffset, scale);
			} else {
				L.DomUtil.setPosition(this._container, topLeftOffset);
			}
		},

		_redraw: function(offset, e) {
			this._disableLeafletRounding();
			var shift = this._map.latLngToLayerPoint(this._wgsOrigin)
				._subtract(this._wgsInitialShift.multiplyBy(this._scale))._subtract(offset);
			this._pixiContainer.scale.set(this._scale);
			this._pixiContainer.position.set(shift.x, shift.y);
			this._drawCallback(this.utils, e);
			this._enableLeafletRounding();
		},

		_update: function (e) {
			// is this really useful?
			if (this._map._animatingZoom && this._bounds) {return;}

			// Update pixel bounds of renderer container
			var p = this.options.padding,
				mapSize = this._map.getSize(),
				min = this._map.containerPointToLayerPoint(mapSize.multiplyBy(-p)).round();

			this._bounds = new L.Bounds(min, min.add(mapSize.multiplyBy(1 + p * 2)).round());
			this._center = this._map.getCenter();
			this._zoom = this._map.getZoom();

			if (this._doubleBuffering) {
				var currentRenderer = this._renderer;
				this._renderer = this._auxRenderer;
				this._auxRenderer = currentRenderer;
			}

			var view = this._renderer.view;
			var b = this._bounds,
				container = this._container,
				size = b.getSize();

			if (!this._renderer.size || this._renderer.size.x !== size.x || this._renderer.size.y !== size.y) {
				if (this._renderer.gl) {
					this._renderer.resolution = this._renderer.rootRenderTarget.resolution = this.options.resolution;
				}
				this._renderer.resize(size.x, size.y);
				view.style.width = size.x + 'px';
				view.style.height = size.y + 'px';
				if (this._renderer.gl) {
					var gl = this._renderer.gl;
					if (gl.drawingBufferWidth !== this._renderer.width) {
						this._renderer.resolution = this._renderer.rootRenderTarget.resolution = this.options.resolution * gl.drawingBufferWidth / this._renderer.width;
						this._renderer.resize(size.x, size.y);
					}
				}
				this._renderer.size = size;
			}

			if (this._doubleBuffering) {
				var self = this;
				requestAnimationFrame(function() {
					self._redraw(b.min, e);
					self._renderer.gl.finish();
					view.style.visibility = 'visible';
					self._auxRenderer.view.style.visibility = 'hidden';
					L.DomUtil.setPosition(container, b.min);
				});
			} else {
				this._redraw(b.min, e);
				L.DomUtil.setPosition(container, b.min);
			}
		},

		_disableLeafletRounding: function () {
			L.Point.prototype._round = no_round;
		},

		_enableLeafletRounding: function () {
			L.Point.prototype._round = round;
		},

		_zoomChange: function () {
			this._scale = this._map.getZoomScale(this._map.getZoom(), this._initialZoom);
		},

		redraw: function (data) {
			if (this._map) {
				this._disableLeafletRounding();
				this._drawCallback(this.utils, data);
				this._enableLeafletRounding();
			}
			return this;
		}

	};

	if (L.version >= "1") {

		L.PixiOverlay = L.Layer.extend(pixiOverlayClass);

	} else {

		// backport some leaflet@1.0.0 methods
		L.Map.prototype.getZoomScale = function (toZoom, fromZoom) {
			var crs = this.options.crs;
			fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
			return crs.scale(toZoom) / crs.scale(fromZoom);
		};

		L.DomUtil.setTransform = function (el, offset, scale) {
			var pos = offset || new L.Point(0, 0);

			el.style[L.DomUtil.TRANSFORM] =
				(L.Browser.ie3d ?
					'translate(' + pos.x + 'px,' + pos.y + 'px)' :
					'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
				(scale ? ' scale(' + scale + ')' : '');
		};

		// patch pixiOverlayClass for leaflet@0.7.7
		pixiOverlayClass.includes = L.Mixin.Events;

		pixiOverlayClass.addTo = function (map) {
			map.addLayer(this);
			return this;
		};

		pixiOverlayClass._setMap = function (map) {
			this._map = map;
			this._zoomAnimated = map._zoomAnimated;
		};

		pixiOverlayClass._setContainerStyle = function () {
			var self = this;
			[
				'-webkit-transform-origin',
				'-ms-transform-origin',
				'transform-origin'
			].forEach(function (property) {
				self._container.style[property] = '0 0';
			});
		};

		pixiOverlayClass._addContainer = function () {
			this._map.getPanes()[this.options.pane || 'overlayPane']
				.appendChild(this._container);
		};

		pixiOverlayClass._setEvents = function () {
			var events = this.getEvents();
			for (var evt in events) {
				this._map.on(evt, events[evt], this);
			}
		};

		pixiOverlayClass.onRemove = function () {
			this._map.getPanes()[this.options.pane || 'overlayPane']
				.removeChild(this._container);
			var events = this.getEvents();
			for (var evt in events) {
				this._map.off(evt, events[evt], this);
			}
		};

		L.PixiOverlay = L.Class.extend(pixiOverlayClass);

	}
}
)})
    },
    {
      inputs: ["L"],
      value: (function(L){return(
// @factory L.pixiOverlay(drawCallback: function, pixiContainer: PIXI.Container, options?: L.PixiOverlay options)
// Creates a PixiOverlay with the given arguments.
L.pixiOverlay = function (drawCallback, pixiContainer, options) {
  return L.Browser.canvas ? new L.PixiOverlay(drawCallback, pixiContainer, options) : null;
}
)})
    }
  ]
};

const m1 = {
  id: "@randomfractals/apache-arrow",
  variables: [
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
function getMarkdown (dataFrame, fields) {
  let markdown = `${fields.join(' | ')}\n --- | --- | ---`; // header row
  let i=0;
  for (let row of dataFrame) {
    markdown += '\n ';
    let td = '';
    let k = 0;
    for (let cell of row) {
      if ( Array.isArray(cell) ) {
        td = '[' + cell.map((value) => value == null ? 'null' : value).join(', ') + ']';
      } else if (fields[k] === 'Date') { 
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
    }
  ]
};

const m2 = {
  id: "@jashkenas/inputs",
  variables: [
    {
      name: "slider",
      inputs: ["input"],
      value: (function(input){return(
function slider(config = {}) {
  let {value, min = 0, max = 1, step = "any", precision = 2, title, description, format, submit} = config;
  if (typeof config == "number") value = config;
  if (value == null) value = (max + min) / 2;
  precision = Math.pow(10, precision);
  return input({
    type: "range", title, description, submit, format,
    attributes: {min, max, step, value},
    getValue: input => Math.round(input.valueAsNumber * precision) / precision
  });
}
)})
    },
    {
      name: "select",
      inputs: ["input","html"],
      value: (function(input,html){return(
function select(config = {}) {
  let {value: formValue, title, description, submit, multiple, size, options} = config;
  if (Array.isArray(config)) options = config;
  options = options.map(o => typeof o === "string" ? {value: o, label: o} : o);
  const form = input({
    type: "select", title, description, submit, 
    getValue: input => {
      const selected = Array.prototype.filter.call(input.options, i => i.selected).map(i => i.value);
      return multiple ? selected : selected[0];
    },
    form: html`
      <form>
        <select name="input" ${multiple ? `multiple size="${size || options.length}"` : ""}>
          ${options.map(({value, label}) => `
            <option value="${value}" ${value === formValue ? "selected" : ""}>${label}</option>
          `)}
        </select>
      </form>
    `
  });
  form.output.remove();
  return form;
}
)})
    },
    {
      name: "input",
      inputs: ["html","d3format"],
      value: (function(html,d3format){return(
function input(config) {
  let {form, type = "text", attributes = {}, action, getValue, title, description, format, submit, options} = config;
  if (!form) form = html`<form>
	<input name=input type=${type} />
  </form>`;
  const input = form.input;
  Object.keys(attributes).forEach(key => {
    const val = attributes[key];
    if (val != null) input.setAttribute(key, val);
  });
  if (submit) form.append(html`<input name=submit type=submit style="margin: 0 0.75em" value="${typeof submit == 'string' ? submit : 'Submit'}" />`);
  form.append(html`<output name=output style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"></output>`);
  if (title) form.prepend(html`<div style="font: 700 0.9rem sans-serif;">${title}</div>`);
  if (description) form.append(html`<div style="font-size: 0.85rem; font-style: italic;">${description}</div>`);
  if (format) format = d3format.format(format);
  if (action) {
    action(form);
  } else {
    const verb = submit ? "onsubmit" : type == "button" ? "onclick" : type == "checkbox" || type == "radio" ? "onchange" : "oninput";
    form[verb] = (e) => {
      e && e.preventDefault();
      const value = getValue ? getValue(input) : input.value;
      if (form.output) form.output.value = format ? format(value) : value;
      form.value = value;
      if (verb !== "oninput") form.dispatchEvent(new CustomEvent("input"));
    };
    if (verb !== "oninput") input.oninput = e => e && e.stopPropagation() && e.preventDefault();
    if (verb !== "onsubmit") form.onsubmit = (e) => e && e.preventDefault();
    form[verb]();
  }
  return form;
}
)})
    },
    {
      name: "d3format",
      inputs: ["require"],
      value: (function(require){return(
require("d3-format")
)})
    }
  ]
};

const notebook = {
  id: "310a1a019d012db9@630",
  modules: [m0,m1,m2]
};

export default notebook;
