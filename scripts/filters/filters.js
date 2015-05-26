/**
 * Created by Jean on 12/05/2015.
 */

// If TrendyJob namespace doesn't exist we create it
if(typeof TrendyJob == "undefined"){
    TrendyJob = {};
}

// If TrendyJob.Model namespace doesn't exist we create it
if(typeof TrendyJob.Filters == "undefined"){
    TrendyJob.Filters = {};
}

TrendyJob.Filters = {
    FiltersType : {
        "numeric" : {
            "display": "<div> <input type=\"number\" id=\"PROPNAME-filter-numeric-over\" name=\"PROPNAME-filter-numeric-over\"/> &gt; PROPNAME &lt; <input type=\"number\" id=\"PROPNAME-filter-numeric-under\" name=\"PROPNAME-filter-numeric-under\" </div>"
        },
        'comboBox': {
            "display": "<div> PROPNAME : <select> CBLIST </select> </div>"
        },
        'multiText': {
            "display" : "<div class=\"ui-widget\"> PROPNAME : <input type=\"text\" name=\"PROPNAME\" id=\"PROPNAME-autocomplete\"> </input> </div> \n <div id=\"PROPNAME-selected-list\"></div>"
        },
        'date' : {
            "display" : "<div> PROPNAME : </div>"
        }
    },
    NodeFilters: {
        'job': {
            'filtersType': {
                'title': 'multiText',
                'town': 'multiText',
                'type': 'comboBox',
                'company': 'multiText',
                'wage': 'numeric',
                'date': 'date'
            },
            // TODO : la définition des listes devraient pas avoir lieu là, l'user veut juste saisir pour chaque prop le type de filtre, il n'a pas à faire ça!
            'multiTextList': {},
            'comboBoxList': {},
            'numericList' : {}
        }
    },
    fillFilters: function (nodeObject) {
        current = TrendyJob.Filters.NodeFilters[nodeObject.nodeType];
        filtersType = current.filtersType;
        for (var key in filtersType) {
            var modifiedList = null;
            if (filtersType.hasOwnProperty(key)) {
                if (filtersType[key] == 'multiText') {
                    modifiedList = current.multiTextList;
                }
                if (filtersType[key] == 'comboBox') {
                    modifiedList = current.comboBoxList;
                }
                if (filtersType[key] == 'numeric'){
                    if(typeof current.numericList[key] == 'undefined'){
                        current.numericList[key] = {"minVal" : nodeObject[key], "maxVal" : nodeObject[key]};
                    } else {
                        nlist = current.numericList[key];
                        if(nlist.minVal > nodeObject[key]){
                            nlist.minVal = nodeObject[key];
                        } else if(nlist.maxVal < nodeObject[key]){
                            nlist.maxVal = nodeObject[key];
                        }
                    }
                }
            }

            if (modifiedList != null) {
                if (typeof modifiedList[key] == 'undefined') {
                    modifiedList[key] = [];
                }
                if($.inArray(nodeObject[key],modifiedList[key]) == -1){
                    modifiedList[key].push(nodeObject[key]);
                }

            }
        }
    },
    createPageFilters: function(nodeTypes){
        var filterBody = $("#left-menu1 .panel-body");
        for(i=0;i<nodeTypes.length;++i){
            nodeFilters = TrendyJob.Filters.NodeFilters[nodeTypes[i]];
            for (var key in nodeFilters.filtersType) {
                if (filtersType.hasOwnProperty(key)) {
                    TrendyJob.Filters.generateFilter(nodeFilters,key,filterBody);
                }
            }
        }
    },
    generateFilter: function(nodeFilters, key, filterBody){
        displayContent = TrendyJob.Filters.FiltersType[nodeFilters.filtersType[key]].display;
        displayContent = displayContent.replace(/PROPNAME/g,key);
        if(nodeFilters.filtersType[key] == "comboBox"){
            cbList = "";
            for(i=0;i<nodeFilters["comboBoxList"][key].length;++i){
                current = nodeFilters["comboBoxList"][key][i];
                cbList+="<option value=\"" + current + "\">" + current + "</option>";
            }
            displayContent = displayContent.replace("CBLIST",cbList);
            filterBody.append(displayContent);
        }
        if(nodeFilters.filtersType[key] == "multiText"){
            filterBody.append(displayContent);
            ac = $( "#" + key + "-autocomplete");
            ac.autocomplete({
                source: nodeFilters.multiTextList[key]
            });
            ac.data("selectedList",[]);
            ac.data("propname",key);
            $("#" + key + "-autocomplete").bind("autocompleteselect", function (event, ui) {

                autocList = $(this).autocomplete("option","source");
                // Remove the element and overwrite the classes var
                autocList.splice(autocList.indexOf(ui.item.value),1);
                // Re-assign the source
                $(this).autocomplete("option","source",autocList);
                arr = $(this).data("selectedList");
                arr.push(ui.item.value);
                $(this).data("selectedList",arr);
                $("#" + $(this).data("propname") + "-selected-list").append("<span>" + ui.item.value + "</span><br/>");
            });
        }
        if(nodeFilters.filtersType[key] == "numeric"){
            filterBody.append(displayContent);
            $("#" + key + "-filter-numeric-under").change(function(){
                var valName = $(this).attr("id").split("-")[0];
                var value = $(this).val();
                D3.nodes = $.grep(D3.nodes,function(n) {
                    return parseInt(n[valName]) < value;
                });
                D3.update();
            });
            $("#" + key + "-filter-numeric-over").change(function(){
                var valName = $(this).attr("id").split("-")[0];
                var value = $(this).val();
                D3.nodes = $.grep(D3.nodes,function(n) {
                    return parseInt(n[valName]) > value;
                });
                D3.update();
            });
        }
    }
};