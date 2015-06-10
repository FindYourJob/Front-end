//Define an angular module for our app
angular.module('FYJApp', ['ngRoute', 'app.controllers'])

//Define Routing for app
.config(['$routeProvider', function($routeProvider) {

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