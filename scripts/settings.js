/**
 * Created by Jean on 02/06/2015.
 */

// If TrendyJob namespace doesn't exist we create it
if(typeof TrendyJob == "undefined"){
    TrendyJob = {};
}

// If TrendyJob.Model namespace doesn't exist we create it
if(typeof TrendyJob.Settings == "undefined"){
    TrendyJob.Settings = {};
}

TrendyJob.Settings = {
    SettingType : {
        "shape" : "<div> PROPDISPLAY : <select id=\"NODETYPE-SETTINGNAME\"> CBLIST </select></div>",
        "size" : "<div> PROPDISPLAY : <select id=\"NODETYPE-SETTINGNAME\"> CBLIST </select></div>",
        "color" : "<div> PROPDISPLAY : <select id=\"NODETYPE-SETTINGNAME\"> CBLIST </select></div>"
    },
    ByNode : {
        job : {
            shape: {
                display : "forme",
                default : "auto",
                actual : "auto",
                attributes : {
                    type: "auto"/*,
                     formation : auto*/
                }
            },
            size: {
                display : "taille",
                default : "wage",
                actual : "wage",
                attributes : {
                    wage: "auto",
                    //experience : auto,
                    date: "date"/*,
                     datesupp : "date"*/
                }
            },
            color : {
                display : "couleur",
                default : "company",
                actual : "company",
                attributes : {
                    company: "auto",
                    //formation : auto,
                    technos: "array",
                    wage: "numeric",
                    //experience : "numeric",
                    date: "auto"/*,
                     datesupp : "date"*/
                }
            }

        },
        company : {
            size : {
                display : "taille",
                default : "numberOfEdges",
                actual : "numberOfEdges",
                attributes : {
                    numberOfEdges : "auto"
                }
            },
            color : {
                display : "couleur",
                default : "title",
                actual : "title",
                attributes : {
                    title : "auto",
                    numberOfEdges : "auto"
                }
            }
        }

    },
    createPageSettings : function(nodeTypes){
        $.each(nodeTypes,function(i,val){
            TrendyJob.Settings.generateNodeSettings(val);
        });
    },
    generateNodeSettings : function(nodeType){
        var settings = TrendyJob.Settings.ByNode[nodeType];
        $.each(settings, function(key,val){
            TrendyJob.Settings.generateNodeSetting(val,key,nodeType);
        });
    },
    generateNodeSetting : function(settingObject,settingName, nodeType){
        var html = TrendyJob.Settings.SettingType[settingName];
        var cblist = "";
        html = html.replace(/PROPDISPLAY/g,settingObject["display"]);
        html = html.replace(/SETTINGNAME/g,settingName);
        html = html.replace(/NODETYPE/g,nodeType);
        $.each(settingObject.attributes,function(key,val){
            var dispKey = TrendyJob.Informations.ByNode[nodeType][key].display;
            cblist += "<option value=\"" + key + "\"> " + dispKey + "</option>";
        });
        html = html.replace(/CBLIST/g,cblist);
        $("#left-menu1 #collapseTwo .panel-body").append(html);
        $("#" + nodeType + "-" + settingName).change(function(){
            TrendyJob.Settings.ByNode[nodeType][settingName].actual = $("#" + nodeType + "-" + settingName + " option:selected").val();
            D3.update();
        });
        return html;
    },
    getActualParamater: function(node,settingType){
        var setting = TrendyJob.Settings.ByNode[node.nodeType][settingType];
        var actualVal = setting.actual;
        if(setting.attributes[actualVal] == "auto"){
            return node[actualVal];
        }
    }
}