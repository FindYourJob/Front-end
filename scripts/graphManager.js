GraphManager = (function (){
	var instance;

	function GraphManagerp(){
		//TODO ajouter une current internalNodesList
		this.internalNodes = {};
		this.nodes = [];
		this.edges = [];
		hasChanged = false;
		this.mapPos=0;
		this.NAID=0;
	}

	GraphManagerp.prototype = {
		constructor:GraphManagerp,
		printNodes:function (){
			console.log(this.internalNodes);
				$.each(this.internalNodes,function(index,value){
					console.log(index);
					console.log(value);
					if(index==="job")
						$.each(value,function(index,node){
							console.log("Nom job : " + node.title);
						});
				});
		},
		printEdges:function(){
			console.log(this.edges);
		},
		addNode:function (node){
			if(typeof this.internalNodes[node.nodeType] === 'undefined'){
				this.internalNodes[node.nodeType]={};
			}
			console.log(this.findNodeByTitle(node.title,node.nodeType));
			if(this.findNodeByTitle(node.title,node.nodeType) == null) {
				this.internalNodes[node.nodeType][node.id] = jQuery.extend(true, {}, node);
				this.internalNodes[node.nodeType][node.id].mapPos = this.mapPos;
				this.internalNodes[node.nodeType][node.id].numberOfEdges = 0;
				this.nodes[this.mapPos] = this.internalNodes[node.nodeType][node.id];
				this.mapPos++;
				this.hasChanged = true;
				console.log("ADDING " + node.title);
			}
		},
		findNode:function(nodeId,type){
			if(typeof this.internalNodes[type][nodeId] !== 'undefined'){
				return this.internalNodes[type][nodeId];
			}
			return null;
		},
		addEdge:function(edge){
			var i, stArray,retArray,edge;
			stArray = [edge.source,edge.target];
			retArray=[];
			
			for(i=0;i<stArray.length;++i){
				console.log(stArray[i]);
				retArray[i] = this.findNode(stArray[i].id,stArray[i].type);
        			if(typeof retArray[i] !== 'undefined'){
        				retArray[i].numberOfEdges++;
        			}
        		}
				if(retArray[0].nodeType == retArray[1].nodeType) {
					console.log("Adding edge s : " + retArray[0].title + " type " + retArray[0].nodeType + " t : " + retArray[1].title + " type " + retArray[1].nodeType);
				}
			console.log(retArray[0]);
			console.log(retArray[1]);
        		this.edges.push({'source':retArray[0].mapPos,'target':retArray[1].mapPos});
			this.hasChanged = true;
		},
		refreshInformation:function(){
		},
		getEdgesNumberMap:function(type){
			map=[];
			$.each(this.internalNodes,function(index,value){
				if(index===type || typeof(type)==='undefined')
						$.each(value,function(index,node){
							map.push([index,node.numberOfEdges]);
						});
				});
				return map;
		},
		getNodes:function(){
			return this.nodes;
		},
		getEdges:function(){
			return this.edges;
		},
		//TODO FIXME LOL Jean ne sait pas à quoi sert ceci alors qu'il l'a codé.
		getNAID:function(){
			this.NAID++;
			return this.NAID;
		},
		//FIXME nodeByTitle peut renvoyer plusieurs noeuds => pas bien et pas prévu. En plus devrait p-ê prendre le type en arg
		findNodeByTitle:function(title){
			var type;
			for(type in this.internalNodes){
				for(nid in this.internalNodes[type]){
					node=this.internalNodes[type][nid];
					if(node.title===title){
						return node;
					}
				}
			}
			return null;
		},
		findNodeByTitle:function(title,type){
				for(nid in this.internalNodes[type]){
					node=this.internalNodes[type][nid];
					if(node.title===title){
						return node;
					}
				}
			return null;
		}
	}

	function createInstance(){
		return new GraphManagerp();
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