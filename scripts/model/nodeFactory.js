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
        getNode : function(jobObject,outNodeType){
            if(typeof nodeIDs[outNodeType] == "undefined"){
                nodeIDs[outNodeType]=0;
            }
            var outNode = {"title" : jobObject[outNodeType],"id" : nodeIDs[outNodeType]};
            outNode.nodeType = outNodeType;
            nodeIDs[outNodeType]++;
            return outNode;
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