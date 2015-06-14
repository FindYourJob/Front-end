/**
 * Created by Jean on 02/06/2015.
 */

// If TrendyJob namespace doesn't exist we create it
if(typeof TrendyJob == "undefined"){
    TrendyJob = {};
}

// If TrendyJob.Model namespace doesn't exist we create it
if(typeof TrendyJob.Informations == "undefined"){
    TrendyJob.Informations = {};
}

TrendyJob.Informations = {
    InformationType : {
        "longtext" : "<div class=\"panel panel-default\"> <div class=\"panel-heading\"> PROPDISPLAY : </div> <perfect-scrollbar class=\"panel-body longtext scroller\" suppress-scroll-x=true scroll-y-margin-offset=\"5\"> VALUE </perfect-scrollbar> </div>",
        "numeric" : "<div class=\"panel panel-default numeric\"> <div class=\"panel-heading\"> PROPDISPLAY : </div> <div class=\"panel-body\"> VALUE </div> </div>",
        "shorttext" : "<div class=\"panel panel-default shorttext\"> <div class=\"panel-heading\"> PROPDISPLAY : </div> <div class=\"panel-body\"> VALUE </div> </div>",
        "list" : "<div class=\"panel panel-default\"> <div class=\"panel-heading\"> PROPDISPLAY : </div> <perfect-scrollbar class=\"panel-body trendyJob-list scroller\" suppress-scroll-x=true> <ul> VALUE  </ul> </perfect-scrollbar> </div>"
    },
    ByNode : {
        job : {
            display : "Annonce",
            title : {
                display : "Titre",
                displaytype : "shorttext"
            },
            wage : {
                display : "Salaire",
                displaytype : "numeric"
            },
            text : {
                display : "Texte annonce",
                displaytype : "longtext"
            },
            town : {
                display : "Ville",
                displaytype : "shorttext"
            },
            type : {
                display : "Type",
                displaytype : "shorttext"
            },
            company : {
                display : "Entreprise",
                displaytype : "shorttext"
            },
            date : {
                display : "Date de publication",
                displaytype : "shorttext"
            },
            technos : {
                display : "Technologies",
                displaytype : "list"
            }
        },
        company : {
            display : "Entreprise",
            title : {
                display : "Nom",
                displaytype : "shorttext"
            },
            numberOfEdges : {
                display : "Nombre de liens",
                displaytype : "numeric"
            },
            actualNumberOfEdges : {
                display : "Nombre de liens actuel",
                displaytype : "numeric"
            },
            job : {
                display : "Annonces",
                displaytype : "list",
                link : "title",
                ref: "auto"
            },
            technos : {
                display: "Technologies",
                displaytype : "list",
                link : "title"
            }
        },
        technos : {
            display : "Technologie",
            title : {
                display : "Nom",
                displaytype : "shorttext"
            },
            numberOfEdges : {
                display : "Nombre de liens",
                displaytype : "numeric"
            },
            actualNumberOfEdges : {
                display : "Nombre de liens actuel",
                displaytype : "numeric"
            },
            job : {
                display : "Annonces",
                displaytype : "list",
                link : "title",
                ref: "auto"
            },
            company : {
                display: "Entreprises",
                displaytype : "list",
                link : "title"
            }
        }
    },
    generateNodeInfo : function(node){
        $("#nodeMenu * .panel-title a").empty();
        $("#nodeMenu * .panel-title a").append(TrendyJob.Informations.generateNodeTitle(node));
        $("#nodeMenu * .panel-body").empty();
        $("#nodeMenu").width($("svg").width() * 20 / 100);
        //$("#nodeMenu * .panel-body").append(TrendyJob.Informations.generateNodeInfo(d));
        var infos = TrendyJob.Informations.ByNode[node.nodeType];
        var htmlres = "";
        var infosContainer = $("#nodeMenu * .panel-body");
        $.each(infos, function(key,val){
            if(key != "display"){
                if(typeof node[key]!= "undefined") {
                    htmlres += TrendyJob.Informations.generateNodeAttribute(key, val, node[key],infosContainer);
                    //htmlres += TrendyJob.Informations.generateNodeAttribute(key, val, node[key]);
                }
            }
        });
        angular.element(document.body).injector().invoke(function($compile) {
            htmlres = angular.element(htmlres);
            infosContainer.append($compile(htmlres)(angular.element(document.body).scope()));
        });
        //return htmlres;
        $("#nodeMenu").css("left", $("svg").width() - $("#nodeMenu").width() - 35 + "px");

        /*$("#nodeMenu * .panel-body").css("max-height", $("svg").height() - $("#nodeMenu").height() + "px");
        $("#nodeMenu * .panel-body").css("overflow", "auto");*/

        $("#nodeMenu").show("fast");
        $("#closeNode").click(function(){
            $("#nodeMenu").hide("fast");
        });
    },
    generateNodeAttribute : function(propname, propattrs, propvalue, infosContainer){
        var html = TrendyJob.Informations.InformationType[propattrs["displaytype"]];
        html = html.replace(/PROPDISPLAY/g,propattrs["display"]);
        if(propattrs["displaytype"] == "list"){
            var htmlValue = "";
            $.each(propvalue,function(i,el){
                var displayedVal = el;
                if(typeof propattrs["link"] != "undefined"){
                    displayedVal = displayedVal[propattrs["link"]];
                }
                htmlValue += "<li>" + displayedVal + "</li>";
            });
            propvalue = htmlValue;
        } else {
            if(typeof propattrs["link"] != "undefined"){
                propvalue = propvalue[propattrs["link"]];
            }
        }
        html = html.replace(/VALUE/g,propvalue);
        return html;
    },
    generateNodeTitle: function(node){
        return "Informations " + TrendyJob.Informations.ByNode[node.nodeType]["display"];
    }
}