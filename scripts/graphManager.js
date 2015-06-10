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
			if(this.findNodeByTitle(node.title,node.nodeType) == null || node.nodeType == "job") {
				this.internalNodes[node.nodeType][node.id] = jQuery.extend(true, {}, node);
				this.internalNodes[node.nodeType][node.id].mapPos = this.mapPos;
				this.internalNodes[node.nodeType][node.id].numberOfEdges = 0;
				this.nodes[this.mapPos] = this.internalNodes[node.nodeType][node.id];
				this.mapPos++;
				this.hasChanged = true;
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
				retArray[i] = this.findNode(stArray[i].id,stArray[i].type);
        			if(typeof retArray[i] !== 'undefined'){
        				retArray[i].numberOfEdges++;
        			}
        		}
        		this.edges.push({'source':retArray[0],'target':retArray[1]});
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
		getNodesByType:function(nodeType){
			var map = [];
			$.each(this.internalNodes[nodeType],function(i,node){
				map.push(node);
			});
			return map;
		},
		getEdges:function(){
			return this.edges;
		},
		getUpdatedEdges:function(newNodes){
			var retEdges = [];
			var j, i;
			$.each(this.edges,function(j,e){
				var sourcePos = -1;
				var targetPos = -1;
				$.each(newNodes, function(i,n){
					/*if(j==0){
						n.mapPos = i;
					}*/
					if(e.target.id == n.id && e.target.nodeType == n.nodeType){
						targetPos = i;
					} else if(e.source.id == n.id && e.source.nodeType == n.nodeType){
						sourcePos = i;
					}
				});

				if(sourcePos != -1 && targetPos != -1){
					console.log({source: newNodes[sourcePos],target : newNodes[targetPos]});
					retEdges.push({source: newNodes[sourcePos],target : newNodes[targetPos]});
				}
			});
			return retEdges;
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
		},
		compareNodes : function(n1,n2){
				return n1.mapPos == n2.mapPos;
		},
		nodeArrayContains: function(arr,n){
			$.each(arr,function(k,n2){
				if(GraphManager.getInstance().compareNodes(n,n2)){
					return true;
				}
			});
			return false;
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