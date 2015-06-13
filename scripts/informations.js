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
        "longtext" : "<div class=\"panel panel-default\"> <div class=\"panel-heading\"> PROPDISPLAY : </div> <div class=\"panel-body longtext\"> VALUE </div> </div>",
        "numeric" : "<div class=\"numeric\"> <p class=\"title\"> PROPDISPLAY : </p> <p> VALUE </p> </div>",
        "shorttext" : "<div class=\"shorttext\"> <p class=\"title\"> PROPDISPLAY : </p> <p> VALUE </p> </div>",
        "list" : "<div class=\"trendyJob-list\"> PROPDISPLAY : <ul> VALUE  </ul> </div>"
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
        var infos = TrendyJob.Informations.ByNode[node.nodeType];
        var htmlres = "";
        $.each(infos, function(key,val){
            if(key != "display"){
                if(typeof node[key]!= "undefined") {
                    htmlres += TrendyJob.Informations.generateNodeAttribute(key, val, node[key]);
                }
            }
        });
        return htmlres;
    },
    generateNodeAttribute : function(propname, propattrs, propvalue){
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