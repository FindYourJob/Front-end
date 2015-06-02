//Define an angular module for our app
var FYJApp = angular.module('FYJApp', ['ngRoute']);

//Define Routing for app
//Uri /AddNewOrder -> template AddOrder.html and Controller AddOrderController
//Uri /ShowOrders -> template ShowOrders.html and Controller AddOrderController
FYJApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/Accueil', {
	templateUrl: 'templates/accueil.html',
	controller: 'AccueilController'
      }).
      when('/Stats-Annonces', {
	templateUrl: 'templates/stats-annonces.html',
	controller: 'AccueilController'
      }).
      when('/Graphe-Job-Company', {
	templateUrl: 'templates/graphes-job-company.html',
	controller: 'GraphesJCController'
      }).
      when('/Geo-Annonces', {
	templateUrl: 'templates/testd3GoogleMap.html',
	controller: 'GeoAnnoncesController'
      }).
      otherwise({
	redirectTo: '/Accueil'
      });
}]);

FYJApp.controller("GraphesJCController", function($scope){
	$.ajax( {
		type: "GET",
		//url: "http://www.trendyjobs.fr/backend/getJobAdverts/1",
		//TODO replace with trendyjobs adress
		url: "jobs.json",
		dataType: "json",
		success: function(jobList){
			console.log(jobList);
			$.getScript('scripts/filters/filters.js', function(){
				$.getScript('scripts/graphManager.js', function() {
					$.getScript('scripts/Model/nodeFactory.js', function(){
						for(i=0;i<jobList.length;++i) {
							jobList[i].nodeType = 'job';
							TrendyJob.Filters.fillFilters(jobList[i]);
							var gm = GraphManager.getInstance();
							gm.addNode(jobList[i]);
							var e = TrendyJob.Model.NodeFactory.getInstance().getEdge(jobList[i], 'company');
							//gm.addEdge(e);
						}
						$.getScript('scripts/d3modules/graph.js', function(){
							D3.printGraph();
						});
						TrendyJob.Filters.createPageFilters(["job"]);
					});
				});
			});
		},
		fail: function(){
			console.log("FAILED");
		}
	});

});


FYJApp.controller('AddOrderController', function($scope) {
	
	$scope.message = 'This is Add new order screen';
	alert("coucou");
	
});


FYJApp.controller('ShowOrdersController', function($scope) {

	$scope.message = 'This is Show orders screen';
	alert("coucou");

});


FYJApp.controller("GeoAnnoncesController", function($scope){

// Create the Google Map…
var map = new google.maps.Map(d3.select("#map").node(), {
  zoom: 5,
  center: new google.maps.LatLng(46.7157467, 2.2096957),
  mapTypeId: google.maps.MapTypeId.TERRAIN
});

// Load the station data. When the data comes back, create an overlay.
//d3.json("jobsWithLatLong.json", function(data) {
d3.xhr("http://trendyjobs.fr/backend/getJobAdvertsLocated/20", function(data) {
  data=JSON.parse(data["response"]);

  //Mise à jour des coordonnées pour introduire un peu de flou au cas où il existerait des points avec les mêmes coordonnées.
  for(var d in data)
  {
     data[d]["lat"]=(parseFloat(data[d]["lat"])+(Math.random() >0.5 ? 1 : -1)*(Math.random()*0.005)).toString();
     data[d]["long"]=(parseFloat(data[d]["long"])+(Math.random() >0.5 ? 1 : -1)*(Math.random()*0.005)).toString();
  }

  var overlay = new google.maps.OverlayView();

  // Add the container when the overlay is added to the map.
  overlay.onAdd = function() {
    var layer = d3.select(this.getPanes().overlayLayer).append("div")
        .attr("class", "stations");

    // Draw each marker as a separate SVG element.
    // We could use a single SVG, but what size would it have?
    overlay.draw = function() {
      var projection = this.getProjection(),
          padding = 10;

      var marker = layer.selectAll("svg")
          .data(d3.entries(data))
          .each(transform) // update existing markers
        .enter().append("svg:svg")
          .each(transform)
          .attr("class", "marker");

      // Add a circle.
      marker.append("svg:circle")
          .attr("r", 4.5)
          .attr("cx", padding)
          .attr("cy", padding);

      // Add a label.
      marker.append("svg:text") 
          .attr("x", padding + 7)
          .attr("y", padding)
          .attr("dy", ".31em")
          .text(function(d) { return d.value["title"]; });

      function transform(d) {
        d = new google.maps.LatLng(d.value["lat"], d.value["long"]);
        //d = new google.maps.LatLng(d.value["lat"]+(Math.random() >0.5 ? 1 : -1)*(Math.random()*0.1), d.value["long"]);
        //d = new google.maps.LatLng(d.value["lat"]+(Math.random() >0.5 ? 1 : -1)*(Math.random()*0.01), d.value["long"]+(Math.random() >0.5 ? 1 : -1)*(Math.random()*0.001));
        d = projection.fromLatLngToDivPixel(d);
        return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px");
      }
    };
  };

  // Bind our overlay to the map…
  overlay.setMap(map);
});
});


FYJApp.controller("AccueilController", function($scope){
 // Activate Carousel
    $("#myCarousel").carousel();

// Enable Carousel Indicators
$(".item").click(function(){
  $("#myCarousel").carousel(1);
});

// Enable Carousel Controls
$(".left").click(function(){
  $("#myCarousel").carousel("prev");
});
});


