// If D3 namespace doesn't exist we create it
if(typeof D3 == "undefined"){
	D3 = {};
}
D3.printBarChart = function(){
						$(document).ready(function(){
							var w = 500;
							var h = 300;

							var gm = GraphManager.getInstance();

							var edgesNumberMap = gm.getEdgesNumberMap("administrateur");
							var i;
							var dataset = [];

							console.log(edgesNumberMap);

							console.log(dataset[5]);

							for(i=0;i<edgesNumberMap.length;++i){
								numberOfEdges=edgesNumberMap[i][1];
								if(typeof dataset[numberOfEdges] === 'undefined'){
									dataset[numberOfEdges]=0;
									console.log("new array : " + numberOfEdges);
								}
								++dataset[numberOfEdges];
							}

							//Fill empty spaces with 0
							for(i=0;i<dataset.length;++i){
								if(typeof dataset[i] === 'undefined'){
									dataset[i]=0;
								}
							}

							console.log(dataset);


							var svg = d3.select(".graphContainer")
					            .append("svg")
					            .attr("width", w)
					            .attr("height", h);

					        var barPadding = 5;

					         var xScale = d3.scale.linear()
			                     .domain([0,dataset.length])
			                     .range([0, w]);

			                var yScale = d3.scale.linear()
			                	.domain([0, d3.max(dataset, function(d,i) { return d; })])
			                	.range([0,h]);

			                var colorScale = d3.scale.linear()
			                	.domain([0, d3.max(dataset, function(d,i) { return d; })])
			                	.range([50,255]);

			                var xAxis = d3.svg.axis()
			                  .scale(xScale)
			                  .orient("bottom")
			                  .ticks(dataset.length);

			                svg.selectAll("rect")
							   .data(dataset)
							   .enter()
							   .append("rect")
							   .attr("x", function(d,i){
							   		console.log("Test");
							   		console.log(xScale);
							   		console.log(i);
							   		return xScale(i);
							   })
							   .attr("y", function(d,i){
							   		return h - yScale(d);
							   })
							   .attr("width", function(d,i){
							   		return w/dataset.length - barPadding;
							   })
							   .attr("height", function(d,i){
							   		return yScale(d);
							   })
							   .attr("fill", function(d){
							   		console.log(colorScale(d));
							   		return "rgb(" + Math.round(colorScale(d)) + ", " + Math.round(colorScale(d/4)) + ", 0)";
							   });


			                  svg.append("g")
							    .attr("class", "axis")  //Assign "axis" class
							    .call(xAxis);


						})
					}