// If D3 namespace doesn't exist we create it
if(typeof D3 == "undefined"){
	D3 = {};
}
D3.nodes = [];
D3.edges = [];
D3.force = {};
D3.update = function(){
	var drag = d3.behavior.drag()
		.origin(function(d) { return d; })
		.on("dragstart", dragstarted)
		.on("drag", dragged)
		.on("dragend", dragended);

	var radiusScale = d3.scale.linear()
		.domain([0, d3.max(nodes,function(n){ return n.wage; })])
		.range([6,30]);



	var link = D3.container.selectAll(".link")
		.data(edges)
		.enter().append("line")
		.attr("class", "link");

	var node = D3.container.selectAll(".node")
		.data(D3.nodes);

	node.exit().remove();

	var enode = node.enter().append("g")
		.attr("class", "node")
		.call(drag);

	enode.append("circle")
		.attr("fill",function(d){ return d.nodeType==="entreprise" ? '#AAC' : '#ACA'})
		.attr("r", function(d){ return radiusScale(d.wage); });

	enode.append("text")
		.attr("dx", 12)
		.attr("dy", ".35em")
		.text(function(d) { return d.title });

	enode.on("click",function(d){
		$("#nodeMenu * .panel-title a").empty();
		$("#nodeMenu * .panel-title a").append("Informations " + d.nodeType.charAt(0).toUpperCase() + d.nodeType.slice(1));
		$("#nodeMenu * .panel-body").empty();
		$("#nodeMenu").width($("svg").width() * 20 / 100)
		$("#nodeMenu * .panel-body").append(TrendyJob.Informations.generateNodeInfo(d));
		$("#nodeMenu").css("left", $("svg").width() - $("#nodeMenu").width() - 35 + "px");
		$("#nodeMenu").show("fast");
		$("#closeNode").click(function(){
			console.log("clicked");
			$("#nodeMenu").hide("fast");
		})
	});
	var i=0;
	D3.force.on("tick", function() {
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
		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
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


	D3.force.gravity(.05)
		.charge(-300)
		.size([D3.w, D3.h])
		.linkDistance(100)
		.nodes(nodes)
		.links(edges)
		.start();

}
D3.printGraph = function(){
						$(document).ready(function(){
							D3.w = $(window).width();
							D3.h = $(window).height() - $(".graphContainer").offset().top - 10;
							var centerCoordinates = [0, 0];

							var zoom = d3.behavior.zoom()
							    .scaleExtent([1, 10])
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

							D3.nodes = gm.getNodes();
							D3.edges = gm.getEdges();
							nodes = D3.nodes;
							edges = D3.edges;

							D3.force = d3.layout.force();

							D3.update();
						    //force.start(10,15,20);
						});
};