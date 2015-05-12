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
      when('/ShowOrders', {
	templateUrl: 'templates/show_orders.html',
	controller: 'ShowOrdersController'
      }).
      otherwise({
	redirectTo: '/Accueil'
      });
}]);


FYJApp.controller('AddOrderController', function($scope) {
	
	$scope.message = 'This is Add new order screen';
	alert("coucou");
	
});


FYJApp.controller('ShowOrdersController', function($scope) {

	$scope.message = 'This is Show orders screen';
	alert("coucou");

});
