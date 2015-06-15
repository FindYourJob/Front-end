// If D3 namespace doesn't exist we create it
if(typeof D3 == "undefined"){
	D3 = {};
}
D3.nodes = [];
D3.edges = [];
D3.force = {};
D3.size = {};
D3.color = {};

D3.generateColours = function(n){
	var gColors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
	var basicColors = gColors.map(function(n){return d3.rgb(n);});
	var nbColors = basicColors.length;
	if(n<nbColors){
		basicColors = basicColors.splice(0,n);
	} else {
		var lighter = true;
		for(var i = nbColors;i<=n;++i){
			if(i%nbColors == 0){
				lighter = !lighter;
			}
			if(lighter){
				basicColors.push(basicColors[i-nbColors].brighter(.5));
			} else {
				basicColors.push(basicColors[i-nbColors].darker(.5));
			}
		}
	}
	return basicColors;
}

D3.update = function(){
	var drag = d3.behavior.drag()
		.origin(function(d) { return d; })
		.on("dragstart", dragstarted)
		.on("drag", dragged)
		.on("dragend", dragended);

	$.each(["size","color"],function(useless,settingType){
		$.each(GraphManager.getInstance().getNodeTypes(), function (i, nodeType) {
			var consideredNodes = $.grep(D3.nodes, function (n) {
				return n.nodeType == nodeType;
			});
			var scaleType, scale;
			scaleType = TrendyJob.Settings.getScaleType(nodeType, settingType);
			/*console.log(nodeType);
			console.log(settingType);
			console.log(scaleType);*/
			if (scaleType == "linear") {
				D3[settingType][nodeType] = d3.scale.linear()
					.domain([0, d3.max(consideredNodes, function (n) {
						return TrendyJob.Settings.getActualParameter(n, settingType);
					})]);

					if(settingType == "size"){
						D3[settingType][nodeType].range([6, 30]);
					} else if(settingType == "color"){
						D3[settingType][nodeType].range([d3.rgb(255,243,232), d3.rgb(255,0,0)]);
					}
			} else {
				var tmpArray = consideredNodes.map(function (n) {
					return TrendyJob.Settings.getActualParameter(n, settingType)
				});
				tmpArray = $.grep(tmpArray, function (el, index) {
					return index == $.inArray(el, tmpArray);
				});
				D3[settingType][nodeType] = d3.scale.ordinal()
					.domain(tmpArray);
				if(settingType == "size"){
					D3[settingType][nodeType].range(tmpArray);
				} else if(settingType == "color"){
					D3[settingType][nodeType].range(D3.generateColours(tmpArray.length));
				}

			}
		});
	});

	var link = D3.container.selectAll(".link")
		.data(D3.edges);



	link.enter().append("line")
		.attr("class", "link");

	link.exit().remove();



	var node = D3.container.selectAll(".node")
		.data(D3.nodes,function(d){
			return d.mapPos;
		});

	node.exit().remove();

	//To keep nodes on top of links
	$(".node").each(function(index){
		this.parentNode.appendChild(this);
	});

	var enode = node.enter().append("g")
		.attr("class", "node")
		.call(drag);

	enode.append("circle");

	node.selectAll("circle").attr("fill",function(d){ return D3.color[d.nodeType](TrendyJob.Settings.getActualParameter(d,"color"))})
		.attr("r", function(d){ return D3.size[d.nodeType](TrendyJob.Settings.getActualParameter(d,"size")); });

	enode.append("text")
		.attr("dx", 12)
		.attr("dy", ".35em");

	node.selectAll("text")
		.text(function(d) { return d.title });

	enode.on("click",function(d){
		TrendyJob.Informations.generateNodeInfo(d)
		/*
			$("#nodeMenu * .panel-title a").empty();
			$("#nodeMenu * .panel-title a").append(TrendyJob.Informations.generateNodeTitle(d));
			$("#nodeMenu * .panel-body").empty();
			$("#nodeMenu").width($("svg").width() * 20 / 100)
			$("#nodeMenu * .panel-body").append(TrendyJob.Informations.generateNodeInfo(d));
			$("#nodeMenu").css("left", $("svg").width() - $("#nodeMenu").width() - 35 + "px");
			$("#nodeMenu").show("fast");
			$("#closeNode").click(function(){
				$("#nodeMenu").hide("fast");
			});*/
		});


	var i=0;

	D3.force.gravity(D3.gravity)
		.charge(D3.charge)
		.size([D3.w, D3.h])
		.linkDistance(D3.linkDistance)
		/*.nodes(D3.nodes)
		.links(D3.edges)*/
		.start();

	D3.force.on("tick", function() {
		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		link.attr("x1", function(d) { /*if(d.source.numberOfEdges>d.target.numberOfEdges){
		 if(d.source.x<d.target.x){
		 d.target.x--;
		 } else {
		 d.target.x++;
		 }
		 } else if(d.source.numberOfEdges<d.target.numberOfEdges){
		 if(d.source.x<d.target.x){
		 d.source.x++;
		 } else {
		 d.source.x--;
		 }
		 } */
			return d.source.x; })
			.attr("y1", function(d) {
				/*if(d.source.numberOfEdges>d.target.numberOfEdges){
				 if(d.source.y<d.target.y){
				 d.target.y--;
				 } else {
				 d.target.y++;
				 }
				 } else if(d.source.numberOfEdges<d.target.numberOfEdges){
				 if(d.source.y<d.target.y){
				 d.source.y++;
				 } else {
				 d.source.y--;
				 }
				 } */

				return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

	});

	function dragstarted(d) {
		d3.event.sourceEvent.stopPropagation();
		D3.force.start();
		d3.select(this).classed("dragging", true);
	}

	function dragged(d) {
		d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
	}

	function dragended(d) {
		d3.select(this).classed("dragging", false);
	}



}
D3.printGraph = function(){
						$(document).ready(function(){
							D3.w = $(window).width();
							D3.h = $(window).height() - $(".graphContainer").offset().top - 10;
							var centerCoordinates = [0, 0];

							var zoom = d3.behavior.zoom()
							    .scaleExtent([0, 10])
							    //.center([w/2,h/2]) (center zoom op)
							    .on("zoom", zoomed);

							function zoomed() {
								D3.container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
							}

							var svg = d3.select(".graphContainer").append("svg")
							    .attr("width", D3.w)
							    .attr("height", D3.h)
							    .call(zoom);

							$("#nodeMenu").css("left", $("svg").width() - $("#nodeMenu").width() - 35 + "px");
							/* FIXME trouver une façon de ne pas bouger le menu tout le temps */
							/*$("#nodeMenu * .panel-title a").click(function(){
								console.log("clicked");
								$("#nodeMenu").css("left", $("svg").width() - $("#nodeMenu").width() - 35 + "px");
							})*/

							$("#buttonReset").click(function(){ reset();});

							function reset() {
								zoom.translate([0,0]);
								zoom.scale(1);
								zoom.event(D3.container);
							}


							D3.container = svg.append("g").
												attr("id","container");


							var gm = GraphManager.getInstance();



							D3.force = d3.layout.force();


							D3.nodes = D3.force.nodes();
							D3.edges = D3.force.links();

							$.each(gm.getNodes(),function(k,n){
								D3.nodes.push(n);
								n = D3.nodes[k];
							});

							$.each(gm.getEdges(),function(k,e){
								D3.edges.push(e);
								e = D3.edges[k];
							});

							D3.update();
						    //force.start(10,15,20);
						});
};