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
