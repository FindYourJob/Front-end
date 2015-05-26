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
        getEdge: function(nodeObject, edgeType){
            return {'source' : nodeObject.title, 'target' : nodeObject.edgeType};
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