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
    containerSelector : "#left-menu1 #collapseOne .panel-body",
    FiltersType : {
        "numeric" : {
            "display": "<div> <input type=\"number\" id=\"PROPNAME-filter-numeric-over\" name=\"PROPNAME-filter-numeric-over\" value=\"OVER-VAL\" /> &gt; PROPDISPLAY &lt; <input type=\"number\" id=\"PROPNAME-filter-numeric-under\" name=\"PROPNAME-filter-numeric-under\" value=\"UNDER-VAL\"/> </div>"
        },
        'comboBox': {
            "display": "<div> PROPDISPLAY : <select id=\"NODENAME-PROPNAME-cb\"> LIST </select> </div>"
        },
        'multiText': {
            //"display" : "<div class=\"ui-widget\"> PROPNAME : <input type=\"text\" name=\"PROPNAME\" id=\"PROPNAME-autocomplete\"> </input> </div> \n <div id=\"PROPNAME-selected-list\"></div>"
            //"display" : "<select id=\"PROPNAME-multiText\" name=\"PROPNAME-multiText\" multiple=\"multiple\"> LIST </select>"
            "display" : "<h5> PROPDISPLAY : </h5> <div isteven-multi-select id=\"NODENAME-PROPNAME-mt\" input-model=\"mtlist\" output-model=\"mtlist_out\" button-label=\"BUTTON-LABEL\" item-label=\"ITEM-LABEL\" max-labels=\"2\" max-height=\"200px\" tick-property=\"ticked\" on-item-click=\"itemclickfn()\" on-select-all=\"selectallfn()\" on-select-none=\"selectnonefn()\" on-reset=\"resetfn()\"> </div>"
        },
        'date' : {
            "display" : "<div> PROPDISPLAY : </div>"
        }
    },
    NodeFilters: {
        'job': {
            'filtersType': {
                /*'title': 'multiText',*/
                'town': 'multiText',
                'type': 'comboBox',
                'company': 'multiText',
                'wage': 'numeric',
                'date': 'date',
                'technos': 'multiText'
            },
            // TODO : la définition des listes devraient pas avoir lieu là, l'user veut juste saisir pour chaque prop le type de filtre, il n'a pas à faire ça!
            'multiTextList': {},
            'comboBoxList': {},
            'numericList' : {},
            'scope': {},
            'activeFilterList': {}
        },
        'company': {
            'filtersType': {
                'title': 'multiText'
            },
            // TODO : la définition des listes devraient pas avoir lieu là, l'user veut juste saisir pour chaque prop le type de filtre, il n'a pas à faire ça!
            'multiTextList': {},
            'comboBoxList': {},
            'numericList' : {},
            'scope': {},
            'activeFilterList': {}
        },
        'technos': {
            'filtersType': {
                'title': 'multiText'
            },
            // TODO : la définition des listes devraient pas avoir lieu là, l'user veut juste saisir pour chaque prop le type de filtre, il n'a pas à faire ça!
            'multiTextList': {},
            'comboBoxList': {},
            'numericList' : {},
            'scope': {},
            'activeFilterList': {}
        }
    },
    resetFilters: function(nodeType){
        current = TrendyJob.Filters.NodeFilters[nodeType];
        current.multiTextList = {};
        current.comboBoxList = {};
        current.numericList = {};
    },
    refreshFilters: function(nodes, nodeType){
        TrendyJob.Filters.resetFilters(nodeType);
        $.each(nodes,function(k,node){
            TrendyJob.Filters.fillFilters(node);
        });
        $.each(TrendyJob.Filters.NodeFilters[nodeType].scope,function(k,scope){
            scope.mtlist = TrendyJob.Filters.NodeFilters[nodeType].multiTextList[k];
            if(!$.isArray(nodes)){
                scope.mtlist = [];
            }
            scope.$apply();
        });
        $.each(TrendyJob.Filters.NodeFilters[nodeType].comboBoxList,function(k,cbList){
            selectItem = $("#" + nodeType + "-" + k + "-cb");
            optionsItemList = "";
            for(var i=0;i<cbList.length;++i){
                current = cbList[i];
                optionsItemList+="<option value=\"" + current + "\">" + current + "</option>";
            }
            selectItem.empty();
            selectItem.append(optionsItemList);
        });
        // Empty combobox if array empty
        if(!$.isArray(nodes)){

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
                        var val = parseFloat(nodeObject[key]);
                        if(nlist.minVal > val){
                            nlist.minVal = val;
                        } else if(nlist.maxVal < val){
                            nlist.maxVal = val;
                        }
                    }
                }
            }

            if (modifiedList != null) {
                if (typeof modifiedList[key] == 'undefined') {
                    modifiedList[key] = [];
                }
                if(nodeObject[key] != "") {
                    var values = nodeObject[key];

                    if(!$.isArray(values) && !$.isPlainObject(values)){
                        values = [values];
                    }
                    $.each(values,function(useless, val){
                        if ($.inArray(val, modifiedList[key]) == -1) {
                            if (filtersType[key] == "multiText") {
                                var inArray = false;
                                for (var i = 0; i < modifiedList[key].length; ++i) {
                                    if (modifiedList[key][i].text == val) {
                                        inArray = true;
                                        break;
                                    }
                                }
                                if (!inArray) {
                                    modifiedList[key].push({"text": val, "ticked": true});
                                }
                            } else {
                                modifiedList[key].push(val);
                            }
                        }
                    });

                }

            }
        }
    },
    createPageFilters: function(nodeTypes, scope){
        var filterBody = $(TrendyJob.Filters.containerSelector);
        for(var i=0;i<nodeTypes.length;++i){
            nodeFilters = TrendyJob.Filters.NodeFilters[nodeTypes[i]];
            var nodeHead = TrendyJob.Settings.nodeDisplay;
            nodeHead = nodeHead.replace(/NODETYPEDISPLAY/g,TrendyJob.Informations.ByNode[nodeTypes[i]].display);
            filterBody.append(nodeHead);
            for (var key in nodeFilters.filtersType) {
                if (nodeFilters.filtersType.hasOwnProperty(key)) {
                    TrendyJob.Filters.generateFilter(nodeFilters,key, nodeTypes[i], filterBody, scope);
                }
            }
        }
    },
    generateFilter: function(nodeFilters, key, nodeType, filterBody, scope){
        displayContent = TrendyJob.Filters.FiltersType[nodeFilters.filtersType[key]].display;
        displayContent = displayContent.replace(/PROPNAME/g,key);
        displayContent = displayContent.replace(/PROPDISPLAY/g,TrendyJob.Informations.ByNode[nodeType][key].display);
        displayContent = displayContent.replace(/NODENAME/g,nodeType);
        filterType = nodeFilters.filtersType[key];
        if(filterType == "comboBox"){
            cbList = "";
            ftList = filterType + "List";
            for(var i=0;i<nodeFilters[ftList][key].length;++i){
                current = nodeFilters[ftList][key][i];
                cbList+="<option value=\"" + current + "\">" + current + "</option>";
            }
            displayContent = displayContent.replace("LIST",cbList);
            filterBody.append(displayContent);
        }
        if(filterType == "multiText"){
            superArray = [];
            displayContent = displayContent.replace(/BUTTON-LABEL/g,"text");
            displayContent = displayContent.replace(/ITEM-LABEL/g,"text");
            angular.element(document.body).injector().invoke(function($compile) {
                newScope = scope.$new();
                newScope.mtlist = nodeFilters[filterType + "List"][key];
                var selectedList = function(mtlist_out){
                    nodeFilters.activeFilterList[key] = $.grep(GraphManager.getInstance().getNodes(nodeType),function(n){
                        var retValue = $.inArray(n[key],mtlist_out) != -1;
                        if($.isArray(n[key]) || $.isPlainObject(n[key])){
                            $.each(n[key],function(useless,value){
                                retValue = retValue ||  $.inArray(value,mtlist_out) != -1;
                            });
                        }
                        return retValue;
                    });
                    TrendyJob.Filters.refreshNodeList(nodeFilters,nodeType);
                };
                newScope.itemclickfn = function(){
                    var mtlist_out = $(angular.element("#" + nodeType + "-" + key + "-mt").scope().mtlist_out).map(function(){
                        return this.text;
                    });
                    selectedList(mtlist_out);
                }
                newScope.selectallfn = function(){
                    var mtlist_out = $(angular.element("#" + nodeType + "-" + key + "-mt").scope().mtlist).map(function(){
                        return this.text;
                    });
                    selectedList(mtlist_out);
                };
                newScope.selectnonefn = function(){
                    var mtlist_out = [];
                    selectedList(mtlist_out);
                };
                newScope.resetfn = newScope.selectallfn;
                displayContent = angular.element(displayContent);
                filterBody.append($compile(displayContent)(newScope));
                newScope.$apply();
                nodeFilters.scope[key] = newScope;
        });
        }
        if(filterType == "numeric"){
            displayContent = displayContent.replace(/OVER-VAL/g,nodeFilters.numericList[key].minVal-1);
            displayContent = displayContent.replace(/UNDER-VAL/g,nodeFilters.numericList[key].maxVal+1);
            filterBody.append(displayContent);
            $.each(["under","over"], function(n,type){
                var previous;
                $("#" + key + "-filter-numeric-" + type).focus(function(){
                    previous = $(this).val();
                }).change(function(){
                    var valName = $(this).attr("id").split("-")[0];
                    if(!$.isNumeric($(this).val())){
                        $(this).val(previous);
                    }
                    if(type == "over"){
                        if($(this).val()<nodeFilters.numericList[key].minVal-1){
                            $(this).val(nodeFilters.numericList[key].minVal-1);
                        }
                    } else {
                        if($(this).val()>nodeFilters.numericList[key].maxVal+1){
                            $(this).val(nodeFilters.numericList[key].maxVal+1);
                        }
                    }
                    var value = $(this).val();
                    nodeFilters.activeFilterList[key + "-" + type] = $.grep(GraphManager.getInstance().getNodes(nodeType),function(n) {
                        if(type == "under"){
                            ret = parseInt(n[valName]) < value;
                        } else {
                            ret = parseInt(n[valName]) > value;
                        }
                        return ret;
                    });
                    TrendyJob.Filters.refreshNodeList(nodeFilters,nodeType);
                });
            });
        }
    },
    refreshNodeList: function(nodeFilters,nodeType){
        var allNodes = GraphManager.getInstance().getNodesByType(nodeType);
        D3.edges = GraphManager.getInstance().getEdges();
        $.each(nodeFilters.activeFilterList, function(key,list){
            //intersect arrays
            allNodes = $.grep(allNodes, function(v){
               return $.inArray(v,list) != -1;
            });
        });
        var removeIndexes = [];
        $.each(D3.nodes,function(k,node){
            if(node.nodeType == nodeType && !GraphManager.getInstance().nodeArrayContains(allNodes,node)){
                removeIndexes.push(k);
            }
        });
        $.each(removeIndexes,function(i,k){
            D3.nodes.splice(k-i,1);
        });
        $.each(allNodes,function(k,node){
           if(!D3.nodes.indexOf(node) != -1){
               D3.nodes.push(node);
           }
        });
        D3.edges = GraphManager.getInstance().getUpdatedEdges(D3.nodes);
        D3.update();
    }
};