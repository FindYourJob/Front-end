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
		this.nodeTypesArray = [];
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
				this.nodeTypesArray.push(node.nodeType);
			}
			if(this.findNodeByTitle(node.title,node.nodeType) == null || node.nodeType == "job") {
				this.internalNodes[node.nodeType][node.id] = jQuery.extend(true, {}, node);
				this.internalNodes[node.nodeType][node.id].mapPos = this.mapPos;
				this.internalNodes[node.nodeType][node.id].numberOfEdges = 0;
				this.internalNodes[node.nodeType][node.id].actualNumberOfEdges = 0;
				this.nodes[this.mapPos] = this.internalNodes[node.nodeType][node.id];
				this.mapPos++;
				this.hasChanged = true;
				return this.internalNodes[node.nodeType][node.id];
			}
			return this.findNodeByTitle(node.title,node.nodeType);
		},
		getNodeTypes:function(){
			return this.nodeTypesArray;
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
						retArray[i].actualNumberOfEdges++;
        			}
        		}
			edgeExists = false;
			for(i=0;i<retArray.length;++i){
				//ADDING LINKED NODE INFORMATIONS TO NODE, no need to go through the edges array then
				if(typeof retArray[i][retArray[(i+1)%2].nodeType] == "undefined"){
					retArray[i][retArray[(i+1)%2].nodeType] = [retArray[(i+1)%2]];
				} else {
					if($.isArray(retArray[i][retArray[(i+1)%2].nodeType])){
						if($.inArray(retArray[(i+1)%2],retArray[i][retArray[(i+1)%2].nodeType]) == -1){
							retArray[i][retArray[(i+1)%2].nodeType].push(retArray[(i+1)%2]);
						} else {
							edgeExists = true;
						}
					}
				}
			}
			if(!edgeExists){
				this.edges.push({'source':retArray[0],'target':retArray[1]});
				this.hasChanged = true;
			}
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
			$.each(newNodes, function(useless,n){
				n.actualNumberOfEdges = 0;
			});
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
					newNodes[sourcePos].actualNumberOfEdges++;
					newNodes[targetPos].actualNumberOfEdges++;
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
		},
		generatePage: function(principalNodeType, otherNodeTypes, nodeList, scope){
			$.getScript('scripts/informations.js', function() {
				$.getScript('scripts/filters/filters.js', function () {
					$.getScript('scripts/settings.js', function () {
							$.getScript('scripts/Model/nodeFactory.js', function () {
								for (i = 0; i < nodeList.length; ++i) {
									var gm = GraphManager.getInstance();
									if(principalNodeType != ""){
										nodeList[i].nodeType = principalNodeType;
										TrendyJob.Filters.fillFilters(nodeList[i]);
										gm.addNode(nodeList[i]);
									}
									var nodesToLink = {};
									$.each(otherNodeTypes, function(useless,oNodeType){
										var otherNodes = nodeList[i][oNodeType];

										/*
										if($.isObject(otherNodes)){
											// On checke si l'objet qu'on nous donne est une map
											if($.grep(otherNodes.keys(),function(n){ return !$.isNumeric();}).length!=0){

											}
										}*/
										if(!$.isArray(otherNodes) && !$.isPlainObject(otherNodes)){
											otherNodes = [otherNodes];
										}
										$.each(otherNodes, function(useless, otherNodeTitle){

											var otherNode = gm.findNodeByTitle(otherNodeTitle,oNodeType);
											if(otherNode == null) {
												otherNode = TrendyJob.Model.NodeFactory.getInstance().getNode(otherNodeTitle, oNodeType, nodeList[i], otherNodeTypes);
												otherNode = gm.addNode(otherNode);
												TrendyJob.Filters.fillFilters(otherNode);
											}
											if($.isArray(nodesToLink[otherNode.nodeType])){
												nodesToLink[otherNode.nodeType].push(otherNode);
											} else {
												nodesToLink[otherNode.nodeType] = [otherNode];
											}
											if(principalNodeType != ""){
												gm.addEdge(TrendyJob.Model.NodeFactory.getInstance().getEdge(nodeList[i], otherNode));
											} else {
												/*if(typeof otherNode[nodeList[i].nodeType] == "undefined"){
													otherNode[nodeList[i].nodeType] = [nodeList[i]];
												} else {
													if($.isArray(otherNode[nodeList[i].nodeType])){
														otherNode[nodeList[i].nodeType].push(nodeList[i]);
													}
												}*/
											}
										});
									});
									var nodesToLinkarr = $.map(nodesToLink,function(v,k){ return k;});
									var lastNodeType = nodesToLinkarr[nodesToLinkarr.length-1];
									$.each(nodesToLink, function(nodeType,nodeList){
										if(nodeType != lastNodeType){
											$.each(nodeList, function(useless,node){
												$.each(nodesToLink, function(nodeType2, nodeList2){
													if($.inArray(nodeType2,nodesToLinkarr) > $.inArray(node.nodeType,nodesToLinkarr)){
														$.each(nodeList2, function(useless, otherNode){
															gm.addEdge(TrendyJob.Model.NodeFactory.getInstance().getEdge(node,otherNode));
														});
													}
												});
											});

										}
									});
								}
								if(principalNodeType != ""){
									var allNodeTypes = $.merge([principalNodeType],otherNodeTypes);
								} else {
									allNodeTypes = otherNodeTypes;
								}
								TrendyJob.Filters.createPageFilters(allNodeTypes, scope);
								console.log("settings");
								TrendyJob.Settings.createPageSettings(allNodeTypes);
								console.log("ONREADY");
								gm.onReady();
							});
						});
				});
			});
		},
		onReady : function(){

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