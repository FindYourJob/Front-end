GraphManager = (function (){
	var instance;

	function GraphManagerp(){
		//TODO ajouter une current nodesList
		this.nodes = {};
		this.edges = [];
		hasChanged = false;
		this.mapPos=0;
		this.NAID=0;
	}

	GraphManagerp.prototype = {
		constructor:GraphManagerp,
		printNodes:function (){
			console.log(this.nodes);
				$.each(this.nodes,function(index,value){
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
			if(typeof this.nodes[node.nodeType] === 'undefined'){
				this.nodes[node.nodeType]={};
			}
			this.nodes[node.nodeType][node.id]=jQuery.extend(true, {}, node);
			this.nodes[node.nodeType][node.id].mapPos=this.mapPos;
			this.mapPos++;
			this.hasChanged = true;
		},
		findNode:function(nodeId){
			var type;
			for(type in this.nodes){
				if(typeof this.nodes[type][nodeId] !== 'undefined'){
					return this.nodes[type][nodeId];
				}
			}
			return null;
		},
		addEdge:function(edge){
			var i, stArray,retArray,edge;
			stArray = [edge.source,edge.target];
			retArray=[];
			
			for(i=0;i<stArray.length;++i){
				retArray[i] = this.findNode(stArray[i]);
        			if(typeof retArray[i] !== 'undefined'){
        				retArray[i].numberOfEdges++;
        			}
        		}
        		this.edges.push({'source':retArray[0].mapPos,'target':retArray[1].mapPos});
			this.hasChanged = true;
		},
		refreshInformation:function(){
		},
		getEdgesNumberMap:function(type){
			map=[];
			$.each(this.nodes,function(index,value){
				if(index===type || typeof(type)==='undefined')
						$.each(value,function(index,node){
							map.push([index,node.numberOfEdges]);
						});
				});
				return map;
		},
		getNodes:function(type){
			map=[];
			$.each(this.nodes,function(index,value){
				if(index===type || typeof(type)==='undefined')
						$.each(value,function(index,node){
							map.push(node);
						});
				});
				return map;
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
			for(type in this.nodes){
				for(nid in this.nodes[type]){
					node=this.nodes[type][nid];
					if(node.title===title){
						return node;
					}
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