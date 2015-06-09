//Define an angular module for our app
var FYJApp = angular.module('FYJApp', ['ngRoute','isteven-multi-select']);

//Define Routing for app
FYJApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/Accueil', {
	templateUrl: 'templates/accueil.html',
	controller: 'AccueilController'
      }).
      when('/Stats-Annonces', {
	templateUrl: 'templates/stats-annonces.html',
	controller: 'DefaultController'
      }).
      when('/Stats-Company', {
	templateUrl: 'templates/stats-company.html',
	controller: 'StatsCompanyController'
      }).
      when('/Stats-Annonces', {
	templateUrl: 'templates/stats-annonces.html',
	controller: 'DefaultController'
      }).
      when('/Graphe-Job-Company', {
	templateUrl: 'templates/graphes-job-company.html',
	controller: 'GraphesJCController'
      }).
      when('/Geo-Annonces', {
	templateUrl: 'templates/geo-annonces.html',
	controller: 'GeoAnnoncesController'
      }).
      otherwise({
	redirectTo: '/Accueil'
      });
}]);

FYJApp.controller("GraphesJCController", function($scope){
	$.ajax( {
		type: "GET",
		url: "http://www.trendyjobs.fr/backend/getJobAdverts/100",
		//TODO replace with trendyjobs adress
		//url: "jobs.json",
		dataType: "json",
		success: function(jobList){
			$.getScript('scripts/informations.js', function() {
				$.getScript('scripts/filters/filters.js', function () {
					$.getScript('scripts/graphManager.js', function () {
						$.getScript('scripts/Model/nodeFactory.js', function () {
							for (i = 0; i < jobList.length; ++i) {
								jobList[i].nodeType = 'job';
								TrendyJob.Filters.fillFilters(jobList[i]);
								var gm = GraphManager.getInstance();
								gm.addNode(jobList[i]);
                                var cn = gm.findNodeByTitle(jobList[i]['company'],'company');
                                if(cn == null) {
                                    cn = TrendyJob.Model.NodeFactory.getInstance().getNode(jobList[i], 'company');
                                    gm.addNode(cn);
                                }
								var e = TrendyJob.Model.NodeFactory.getInstance().getEdge(jobList[i], cn);
								gm.addEdge(e);
							}
							$.getScript('scripts/d3modules/graph.js', function () {
								D3.printGraph();
							});
							TrendyJob.Filters.createPageFilters(["job"], $scope);
						});
					});
				});
			});
		},
		fail: function(){
			console.log("FAILED");
		}
	});

});


FYJApp.controller('DefaultController', function($scope) {

	console.log("Default controller called");

});


FYJApp.controller("GeoAnnoncesController", function($scope){

  console.log("Controller Annonces");

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



FYJApp.controller("StatsCompanyController", function($scope){

	var margin = {top: 20, right: 20, bottom: 150, left: 40},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10);

	var svg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.xhr("http://trendyjobs.fr/backend/getJobAdverts/80", function(data) {

	  data=JSON.parse(data["response"]);

	  data.sort(function(a,b) {return parseInt(a.id)-parseInt(b.id);});

	  x.domain(data.map(function(d) { return d.company; }));
	  y.domain([0, d3.max(data, function(d) { console.log(d.company+" "+d.id);return parseInt(d.id); })]);
	  //console.log(d3.max(data, function(d) { return parseInt(d.id); }));

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	      .selectAll("text")  
	          .style("text-anchor", "end")
	          .attr("dx", "-.8em")
	          .attr("dy", ".15em")
	          .attr("transform", function(d) {
	              return "rotate(-65)" 
	              });

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("id");

	  svg.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.company); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.id); })
	      .attr("height", function(d) { return height - y(d.id); });

	});
});
