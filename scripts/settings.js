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
    nodeDisplay : "<h4 class=\"node-title\"> NODETYPEDISPLAY </h4>",
    containerSelector : "#left-menu1 #collapseTwo .panel-body",
    SettingType : {
        "shape" : "<div> PROPDISPLAY : <select id=\"NODETYPE-SETTINGNAME\"> CBLIST </select></div>",
        "size" : "<div> PROPDISPLAY : <select id=\"NODETYPE-SETTINGNAME\"> CBLIST </select></div>",
        "color" : "<div> PROPDISPLAY : <select id=\"NODETYPE-SETTINGNAME\"> CBLIST </select></div>",
        "numeric" : "<div> PROPDISPLAY : <input type=\"number\" id=\"NODETYPE-SETTINGNAME\" value=DEFAULTVAL> </input> </div>"
    },
    GenericGraphSettings : {
        gravity : {
            display : "Gravit&eacute;",
            type : "numeric",
            default : .05
        },
        charge : {
            display : "Charge",
            type : "numeric",
            default : -400
        },
        linkDistance : {
            display : "Distance entre liens",
            type : "numeric",
            default : 300
        }
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
                    numberOfEdges : "numeric"
                }
            }
        },
        technos : {
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
                    numberOfEdges : "numeric"
                }
            }
        }

    },
    createPageSettings : function(nodeTypes){
        $.each(TrendyJob.Settings.GenericGraphSettings, function(k, setting){
            var html = TrendyJob.Settings.SettingType[setting.type];
            html = html.replace(/PROPDISPLAY/g,setting.display);
            html = html.replace(/DEFAULTVAL/g,setting.default);
            D3[k] = setting.default;
            html = html.replace(/NODETYPE/g,"GenericGraphSettings");
            html = html.replace(/SETTINGNAME/g,k);
            $(TrendyJob.Settings.containerSelector).append(html);
            $("#GenericGraphSettings-" + k).change(function(){ D3[k] = $(this).val(); D3.update(); })
        });
        $.each(nodeTypes,function(i,val){
            TrendyJob.Settings.generateNodeSettings(val);
        });
    },
    generateNodeSettings : function(nodeType){
        var settings = TrendyJob.Settings.ByNode[nodeType];
        var html = TrendyJob.Settings.nodeDisplay;
        html = html.replace(/NODETYPEDISPLAY/,TrendyJob.Informations.ByNode[nodeType].display);
        $(TrendyJob.Settings.containerSelector).append(html);
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
        $(TrendyJob.Settings.containerSelector).append(html);
        $("#" + nodeType + "-" + settingName).change(function(){
            console.log(nodeType + "CHANGED");
            TrendyJob.Settings.ByNode[nodeType][settingName].actual = $("#" + nodeType + "-" + settingName + " option:selected").val();
            D3.update();
        });
        return html;
    },
    getActualParameter: function(node,settingType){
        var setting = TrendyJob.Settings.ByNode[node.nodeType][settingType];
        var actualVal = setting.actual;
        if(setting.attributes[actualVal] == "auto" || setting.attributes[actualVal] == "numeric"){
            return node[actualVal];
        }
    },
    getRange: function(nodeType,settingType){
        var setting = TrendyJob.Settings.ByNode[nodeType][settingType];
        var actualVal = setting.actual;
    },
    getScaleType: function(nodeType, settingType){
        var setting = TrendyJob.Settings.ByNode[nodeType][settingType];
        var actualVal = setting.actual;
        var retValue;
        if(setting.attributes[actualVal] == "numeric"){
            retValue = "linear";
        } else if(settingType == "size"){
            retValue = "linear";
        } else {
            retValue = "ordinal";
        }
        return retValue;
    }
}