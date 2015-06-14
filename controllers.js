angular.module('app.controllers', ['isteven-multi-select'])


    .controller('DefaultController', function($scope) {

        console.log("Controller DefaultController");

    })


    .controller("GraphesJCController", function($scope){
        $.ajax( {
            type: "GET",
            url: "http://www.trendyjobs.fr/backend/getJobAdverts/1000",
            //TODO replace with trendyjobs adress
            //url: "jobs.json",
            dataType: "json",
            success: function(jobList){
                //TODO FIXME replace when technos is no more a string
                /*$.each(jobList,function(useless,node){
                    node.technos = $.parseJSON(node.technos);
                });*/
                $.getScript('scripts/graphManager.js', function () {
                    GraphManager.getInstance().generatePage("job",["company"],jobList,$scope);
                    $.getScript('scripts/d3modules/graph.js', function () {
                        GraphManager.getInstance().onReady = function(){D3.printGraph();};
                    });
                });
            },
            fail: function(){
                console.log("FAILED");
            }
        });
    })

    .controller("GraphesJTController", function($scope){
        $.ajax( {
            type: "GET",
            url: "http://www.trendyjobs.fr/backend/getJobAdverts/1000",
            //TODO replace with trendyjobs adress
            //url: "jobs.json",
            dataType: "json",
            success: function(jobList){
                //TODO FIXME replace when technos is no more a string
               /* $.each(jobList,function(useless,node){
                    node.technos = $.parseJSON(node.technos);
                });*/
                $.getScript('scripts/graphManager.js', function () {
                    GraphManager.getInstance().generatePage("job",["technos"],jobList,$scope);
                    $.getScript('scripts/d3modules/graph.js', function () {
                        GraphManager.getInstance().onReady = function(){D3.printGraph();};
                    });
                });
            },
            fail: function(){
                console.log("FAILED");
            }
        });
    })

    .controller("GraphesCTController", function($scope){
        $.ajax( {
            type: "GET",
            url: "http://www.trendyjobs.fr/backend/getJobAdverts/1000",
            //TODO replace with trendyjobs adress
            //url: "jobs.json",
            dataType: "json",
            success: function(jobList){

                $.getScript('scripts/graphManager.js', function () {
                    GraphManager.getInstance().generatePage("",["company","technos"],jobList,$scope);
                    $.getScript('scripts/d3modules/graph.js', function () {
                        GraphManager.getInstance().onReady = function(){D3.printGraph();};
                    });
                });
            },
            fail: function(){
                console.log("FAILED");
            }
        });
    })


    .controller("GeoAnnoncesController", function($scope){

        console.log("Controller GeoAnnoncesController");

    })


    .controller("AccueilController", function($scope){
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
    })



    .controller("StatsCompanyController", function($scope){
        console.log("Controller StatsCompanyController");

    });
