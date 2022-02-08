
import vertex from "./vertex.js";

//import {union} from "./lines.js"



/*
class vertex{
    constructor(name){
        this.name = name
		// (possibly not immediate) predecessor and successors
        this.pred = new Set();
        this.succ = new Set();
		// immediate predecessors and successors
        this.next = new Set();
        this.prev = new Set();
    }
}
export default vertex


*/
const _ = require("lodash");


function union(x,y){
	return new Set(_.union(Array.from(x), Array.from(y)));
}

class dag{
	// vertices : list (not set) of strings
	// edges : list (not set) of pairs of strings
	constructor(vertices, edges){
		this.vertices = new Set(vertices.map(x => new vertex(x.toString())));
		this.verticesTable = {}
		for(var vertex_ of this.vertices){
			this.verticesTable[vertex_.name] = vertex_;
		}
		for (var edge of edges){
			this.add_edge(edge[0].toString(), edge[1].toString());
		}

	}
	//string
	add_vertex(name){ // cannot remove vertices
		var vertex_ = new vertex(name);
		this.vertices.add(vertex_);
		this.verticesTable[name] =vertex_;
	}
	get_vertices(){
		return Array.from(this.vertices).map((x) => x.name);
	}
	//strings
	will_be_cycle(v1, v2){
		var v1obj = this.get_vertex_by_name(v1);
		var v2obj = this.get_vertex_by_name(v2);
		
		if(v2obj.succ.has(v1obj)){
			return true;
		}
		return false;
	}
	add_edge(v1, v2){
		if(this.has_edge(v1, v2) || v1 == v2){
			return;
		}
		// no redundant edges
		if(Array.from(this.get_vertex_by_name(v1).succ).map((x) => x.name).indexOf(v2) != -1){
			return;
		}
		if(this.will_be_cycle(v1, v2)){
			
			throw new Error("this edge will create a cycle")
		}
		
		var v1obj = this.get_vertex_by_name(v1);
		var v2obj = this.get_vertex_by_name(v2);	
		
		v1obj.next.add(v2obj)
		v2obj.prev.add(v1obj)
		v1obj.succ.add(v2obj)
		v2obj.pred.add(v1obj)
		// every successor of v2 is also a successor of v1 now
		for(var vertex of v1obj.pred){
			vertex.succ.add(v2obj)
			vertex.succ = union(vertex.succ, v2obj.succ)
		}
		for(var vertex of v2obj.succ){
			vertex.pred.add(v1obj)
			vertex.pred = union(vertex.pred, v1obj.pred)
		}
		v1obj.succ = union(v1obj.succ, v2obj.succ)
		v2obj.pred = union(v1obj.pred, v2obj.pred)
	} // CANNOT remove edges!!!
	
	
	get_vertex_by_name(name){
		return this.verticesTable[name];
	}
	// returns a list of vertices that are not in the list but all pre-requisites are in the list
	get_exposed_vertices(set_){
		var exposed = new Set();
		for(var vertex of this.vertices){
			if(set_.has(vertex.name)){
				continue;
			}
			var valid = true;
			for(var prev of vertex.prev){
				if(!set_.has(prev.name)){
					valid = false;
					break;
				}
			}
			if(valid){
				exposed.add(vertex.name);
			}
		}
		return exposed;
	}
	// get a list of (only names) vertices with no successor
	get_leaves(){
		var leaves = new Set();
		for(var vertex of this.vertices){
			if(vertex.next.size == 0){
				leaves.add(vertex.name);
			}
		}
		return leaves;
	}
	// strings
	has_edge(v1, v2){ // v1 -> v2 is an edge
		return this.get_vertex_by_name(v1).next.has(this.get_vertex_by_name(v2))
	}
	// list of strings
	subgraph(vertices){
		var vertex_set = vertices;
		var edge_set = [];
		for(var x of vertices){
			for(var y of vertices){
				if(this.has_edge(x,y)){
					edge_set.push([x,y])
				}
			}
		}
		return new dag(vertex_set, edge_set);
	}
	// list of strings
	subgraph_without(vertices){
		var vertex_set = [];
		for(var vertex of this.vertices){
			if(this.vertices.indexOf(vertex.name) == -1){
				vertex_set.push(vertex.name);
			}
		}
		return this.subgraph(vertex_set);
	}
	// combines two dags by adding an edge between this_vertex of this dag, and other_vertex of other dag.
	// vertices are given as strings
	join_on(other_dag, this_vertex, other_vertex , mode = "merge"){
		// add all of the vertices from other dag
		
		// mode: edge : this edge has an edge to the other vertex
		// union : disjoint union of graphs
		// merge: this edge becomes the same as other_dag's vertex
		// add all of the vertices
		for(var vertex of other_dag.get_vertices()){
			if(this.verticesTable[vertex] != undefined){
				throw new Error("this graph and other graph has vertex with same name : " + vertex);
			}
			if(vertex==other_vertex && mode == "merge"){
				continue;
			}
			this.add_vertex(vertex);
		}
		// add all the edges
		for(var vertex of other_dag.get_vertices()){
			var source = vertex;
			if(vertex == other_vertex && mode == "merge"){
				source = this_vertex;
			}
			var their_edges = other_dag.get_vertex_by_name(vertex).next;
			for(var next_vertex of their_edges){
				this.add_edge(source, next_vertex.name);
			}
		}
		if(mode == "edge"){
			this.add_edge(this_vertex, other_vertex);
		}
	}
	// returns just the list of names
	toposort(){
		var prev = {};
		var next = {};
		var frontier = new Set();
		var toposort = [];
		//initialize variables
		for(var vertex of this.vertices){
			prev[vertex.name] = new Set(Array.from(vertex.prev).map((x) => x.name))
			next[vertex.name] = new Set(Array.from(vertex.next).map((x) => x.name))
			if(prev[vertex.name].size == 0){
				frontier.add(vertex.name)
			}
		}
		//main loop
		while(frontier.size != 0){
			var vertex = Array.from(frontier)[0];
			frontier.delete(vertex);
			toposort.push(vertex)
			for (var vertex2 of next[vertex]){
				prev[vertex2].delete(vertex);
				if(prev[vertex2].size == 0){
					frontier.add(vertex2);
				}
			}
		}
		return toposort;
	}
	// to be used here:
	//https://codepen.io/mauriciom/pen/ZbXmYb
	// or a.html, that works too
	output(){
		var sort = this.toposort();
		var preamble = 
		`		
		
		<html>
 <head>
  <script type="text/javascript">
   window.onload = function() {
   
   var cy = cytoscape({
  container: document.getElementById('canvas'),
  
  style: [
    {
        selector: 'node',
        style: {
            label: 'data(id)'
        }
    }, {
		selector:"edge",
		style:{
		"curve-style":"straight",
			"mid-target-arrow-color":"red",
			"mid-target-arrow-shape":"triangle",
			"target-arrow-color":"red",
			"target-arrow-shape":"triangle"			
		}
	
	}]
	
});

var eles = cy.add([
`			
			var mid = "";
			var i=0;
			for(var v of  sort){
				i += 1600 / (this.vertices.size+1)
				mid += `{ group: 'nodes', data: { id: '${v}' }, position: { x: ${i}, y: ${Math.random() * 650 + 100} } },
				`;
			}
			for(var v of  this.vertices){
				for(var w of v.next){
					mid += ` { group: 'edges', data: { id: '${v.name + " " + w.name}', source: '${v.name}', target: '${w.name}' } },
					`;
				}
			}

		var postamble = `]);


cy.resize();

cy.mount()
   };
  </script>
  
  <style>
    #canvas {
        width: 1600;
        height: 750;
        position: absolute;
        top: 0px;
        left: 0px;
    }
</style>


 </head>
 
 <body>
  <div id="canvas"></div>
   <div>
        </div>
	
			<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.15.2/cytoscape.min.js"></script>
			
			
			<script type="text/javascript" src="a.js"></script>
 </body>
</html>



`
		return preamble + mid + postamble;
	}
	toJSON(){
		var adjList = {};
		for(var vertex of this.vertices){
			adjList[vertex.name] = [];
			for(var next of vertex.next){
				adjList[vertex.name].push(next.name);
			}
		}
		return {
				"vertices" : Array.from(this.vertices).map((x) => x.name),
				"adjacency list": adjList,
			}
		
	}

}
export default dag;