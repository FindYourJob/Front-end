/**
 * Created by Jean on 24/05/2015.
 */

// If TrendyJob namespace doesn't exist we create it
if(typeof TrendyJob == "undefined"){
    TrendyJob = {};
}

// If TrendyJob.Model namespace doesn't exist we create it
if(typeof TrendyJob.Model == "undefined"){
    TrendyJob.Model = {};
}

TrendyJob.Model.NodeFactory = (function (){
    var instance;
    var nodeIDs = {};

    function NodeFactoryp(){
    }

    NodeFactoryp.prototype = {
        constructor: NodeFactoryp,
        getJobNode: function(jobOject){
            jobObject.nodeType = "job";
            jobObject.filters = {

            }
            return jobOject;
        },
        getEdge: function(nodeObject, otherNode){
            return {'source' : {"id" : nodeObject.id, "type" : nodeObject.nodeType}, 'target' : {"id" : otherNode.id, "type" : otherNode.nodeType}};
        },
        getNode : function(otherNodeTitle,outNodeType, node, otherNodeTypes){
            if(typeof nodeIDs[outNodeType] == "undefined"){
                nodeIDs[outNodeType]=0;
            }
            var outNode = {"title" : otherNodeTitle,"id" : nodeIDs[outNodeType]};

            outNode.nodeType = outNodeType;
            //this.fillNodeInfos(node,outNode,otherNodeTypes)
            nodeIDs[outNodeType]++;
            return outNode;
        },

        //FIXME Logically this function is now legacy
        fillNodeInfos : function(node,outNode,otherNodeTypes){
            $.each($.merge(otherNodeTypes,[node.nodeType]), function(useless, type){
                if(type != outNode.nodeType){
                    if(type == node.nodeType){
                        typeInfos = {"id" : node.id, "title" : node.title};
                    } else {
                        typeInfos = node[type];
                    }
                    if(typeof outNode[type] == 'undefined') {
                        if($.isArray(typeInfos) || $.isPlainObject(typeInfos)){
                            outNode[type] = typeInfos;
                        } else {
                            outNode[type] = [typeInfos];
                        }
                    } else {
                        if($.isArray(outNode[type])){
                            if($.isArray(typeInfos)){
                                //Merging arrays storing unique values
                                outNode[type] = $.merge($.grep(typeInfos,function(n){ return $.inArray(outNode[type],n) == -1;}));
                            } else {
                                if($.inArray(outNode[type],typeInfos) == -1){
                                    outNode[type].push(typeInfos);
                                }
                            }
                        } else {
                            $.each(typeInfos,function(key, value){
                                if(typeof outNode[type][key] == "undefined"){
                                    outNode[type][key] = value;
                                }
                            });
                        }
                    }
                }
            });
        }
    }

    function createInstance(){
        return new NodeFactoryp();
    }

    return{
        getInstance: function() {
            if(!instance){
                instance = createInstance();
            }
            return instance;
        }
    }
})();