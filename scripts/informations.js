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
        "shorttext" : "<div class=\"shorttext\"> <p class=\"title\"> PROPDISPLAY : </p> <p> VALUE </p> </div>"
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
            }
        }
    },
    generateNodeInfo : function(node){
        var infos = TrendyJob.Informations.ByNode[node.nodeType];
        var htmlres = "";
        $.each(infos, function(key,val){
            if(key != "display"){
                htmlres += TrendyJob.Informations.generateNodeAttribute(key, val, node[key]);
            }
        });
        return htmlres;
    },
    generateNodeAttribute : function(propname, propattrs, propvalue){
        console.log(TrendyJob.Informations);
        console.log(propattrs["displaytype"]);
        console.log(TrendyJob.Informations.InformationType[propattrs["displaytype"]]);
        var html = TrendyJob.Informations.InformationType[propattrs["displaytype"]];
        html = html.replace(/PROPDISPLAY/g,propattrs["display"]);
        html = html.replace(/VALUE/g,propvalue);
        return html;
    }
}