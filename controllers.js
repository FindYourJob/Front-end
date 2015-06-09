angular.module('app.controllers', ['isteven-multi-select'])


    .controller('DefaultController', function($scope) {

        console.log("Controller DefaultController");

    })


    .controller("GraphesJCController", function($scope){
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
