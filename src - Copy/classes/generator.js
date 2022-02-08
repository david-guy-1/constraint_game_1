import dag from "./dag.js";
import vertex from "./vertex.js";
import dungeon from "./dungeon.js";
import level from "./level.js";

import solution from "./solution.js";
import is_solution from "./is_solution.js";
import item from "./item.js";
import monster from "./monster.js";
import * as r from "./random.js";
import * as d from "../display/display_constants";
var _ = require("lodash");

/*
we use h1, h2, ... for heroes, p1, p2, ... for paths, and i1, i2, ... for items, s1, s2, ... for scrolls, d1, d2, ... for doors, e1, e2, ... for eggs and c1, c2, ... for statements (not written out explicitly)

*/

/*
example: 

a part that can only be solved if s1 (for example, a monster being blocked)
s1 must be collected by a h2~p1
For h2~p1, a door must be opened, requiring e1 and h3~p2, and h3~i2
h4 can go down two paths. one of which requires i2. This means that path cannot be taken.

(f : s1 , g : -)

( any )
(f : e1, d1 ,  g : s1)  (any)

(any)
(any) (f : h3~i2 , g : d1)

(any)
(f : i2) (any)



*/
// returns the vertices with only a single descendent
export function get_single_desc(tree){
	var s = new Set();
	for(var vertex of tree.get_vertices()){
		if(tree.get_vertex_by_name(vertex).next.size == 1){
			s.add(vertex);
		}
	}
	return s;
}
export function generate_tree(seed, size, prefix){
	// size : number
	// prefix : string, to put at the beginnning of every vertex name
	//generates a rooted tree with (size) vertices
	var tree = new dag([prefix +  "root"], []);
	for(var i=size-1; i> 0; i--){
		// i is the number of vertices left to add
		//choose a r vertex with less than 3 out, and add another thing there.
		var single_desc = get_single_desc(tree);
		if(i <= single_desc.size){
			for(var vertex of single_desc){
				if(i != 0){
					tree.add_vertex(prefix + " vertex " + i)
					tree.add_edge(vertex, prefix + " vertex " + i)
					i-=1
				}
			}
			break;
		}
		var good_vertices = new Set();
		for(var vertex of tree.get_vertices()){
			if(tree.get_vertex_by_name(vertex).next.size < 3){
				good_vertices.add(vertex);
			}
		}
		// HERE IS WHERE WE CAN PARAMETERIZE!!!
		// specifically, how do we choose a vertex to add to?
		var vertex = r.choice(good_vertices, seed + "choose " + i);
		tree.add_vertex(prefix + " vertex " + i)
		tree.add_edge(vertex, prefix + " vertex " + i)	
	}
	return tree;
}

// given a tree, find the vertices that has a sibling that is a forced vertex.
// returns a set
export function forced_away(tree, forced_vertices){
	var forced_away = [];
	forced_vertices = new Set(forced_vertices);
	for(var vertex of forced_vertices){
		var vertexObj = tree.get_vertex_by_name(vertex);
		if(vertexObj.prev.size == 0){
			continue;
		}
		var prevObj = Array.from(vertexObj.prev)[0];
		var siblings = Array.from(prevObj.next);
		for(var sibling of siblings){
			if(! forced_vertices.has(sibling.name) ){
				forced_away.push(sibling.name);
			}
		}
	}
	var all_exclude = union_exclude_index([forced_away].concat(forced_away.map(function(x) {return new Set(Array.from(tree.get_vertex_by_name(x).succ).map(function(y){return y.name})) }) ), -1)
	return all_exclude
}
// given a list of sets (A_i)_{i=1}^n, returns \cup_{i=1, i \neq index }^n A_i 
// although still remember that js is 0-indexed.
export function union_exclude_index(lst, index){
	var x = [];
	for(var i=0; i<lst.length ; i++){
		if (i == index){
			continue;
		}
		x = x.concat(Array.from(lst[i]))
	}
	return new Set(x);
}
// for MULTIPLE heroes/trees!!!
export function get_forced_nodes(critical_nodes, forced_index){
	var x  = [];
	for(var i=0; i<critical_nodes.length ; i++){
		x.push(new Set());
		for(var j=0; j<forced_index[i]; j++){
			x[i].add(critical_nodes[i][j]);
		}
	}
	return x;
}

/* existing_level = trees, things_on_vertices, scrolls, keys, items, pool 
new_level = r_trees, r_things_on_vertices, r_scroll_count, r_key_count, r_item_count (from generate_piece)
call_name = name used to call the generate_piece function
heroes = number of heroes used in genreate_piece
merge_on_nodes = name of the nodes to merge on.
*/
function merge_piece(existing_level , new_level, call_name, heroes, merge_on_nodes){
		var [trees, things_on_vertices, scrolls, keys, items, pool ] = existing_level
		var [r_trees, r_things_on_vertices, r_scroll_count, r_key_count, r_item_count ] = new_level

		for(var j=0; j<heroes; j++){
			trees[j].join_on(r_trees[j], merge_on_nodes[j], call_name + " tree " + j + "root")
			
			
		}
		// update scrolls, keys, items list
		// note that monsters are NOT named right now;
		for(var j=0; j<r_key_count; j++){
			keys.push("lever_" +call_name+j);
		}
		for(var j=0; j<r_scroll_count; j++){
			scrolls.push("scroll_" +call_name+j);
		}
		for(var j=0; j<r_item_count; j++){
			items.push(call_name+" "+j);
			pool.push(call_name+" "+j);
		}
		// merge things on vertices
		for(var j=0; j<heroes; j++){
			for (var thing of r_trees[j].get_vertices()){
				if(things_on_vertices[thing] == undefined && thing != call_name + " tree " + j + "root"){
					things_on_vertices[thing] = [];
				}
				var merge_thing = thing == call_name + " tree " + j + "root" ? merge_on_nodes[j] : thing ;
				//console.log(trees[j].get_vertex_by_name(merge_thing).name);
				things_on_vertices[merge_thing] = things_on_vertices[merge_thing].concat(r_things_on_vertices[thing])
			}
		}
		// mutates existing_level's objects
		
}
export function generate_piece(seed, heroes, size, name="FORBIDDEN"){
	
	// heroes : number, size : range ([small, large]) , name : string (name of this piece, for tree generation prefixes)
	
	// initialization
	var trees = [];
	var forced_nodes = []; 
	var destinations = [];
	var dependencies = new dag([],[]);
	
	
	for(var i=0; i<heroes; i++){
		// HERE IS WHERE WE CAN PARAMETERIZE!!!
		// specifically, set tree sizes.
		trees.push(generate_tree(seed  + " tree " + i,  r.randint(size[0], size[1]+1, seed + " tree size " + i), name + " tree " + i))
		forced_nodes.push(new Set());
		forced_nodes[i].add(name + " tree " + i + "root")
	}
	
	// choose a r leaf node to set as "destination"
	var i=0;
	for(var tree of trees){
		var leaves = tree.get_leaves();
		destinations.push(r.choice(leaves, seed + " set destination " + i))
		i+=1;
	}
	// every path from root to the destination is labelled "critical". 
	// make this an ORDERED list, starting from the root, to the destination
	var critical_nodes = [];
	// smallest index such that critical_nodes[i] is not a forced node
	var forced_index = [];
	// a list of things on these vertices. 
	// scrolls, doors and keys are strings with prefixes scroll_, door_, lever_.
	// monsters are pairs (list of weaknesses, list of drops)
	var things_on_vertices = {} // values are lists , since we need to keep track of which order we add in
	
	// initialize lists for every vertex
	for(var i=0; i< heroes; i++){
		for(var vertex of trees[i].get_vertices()){
			things_on_vertices[vertex] = [];
		}
		forced_index.push(1);
		var this_lst = [destinations[i]]
		while(trees[i].get_vertex_by_name(_.last(this_lst)).prev.size != 0){
			this_lst.push(Array.from(trees[i].get_vertex_by_name(_.last(this_lst)).prev)[0].name)
		}
		_.reverse(this_lst);
		critical_nodes.push(this_lst);
	}
	
	// end of initialization. We now start making edges forced;
	// get all indices where forced_index[i] is not critical_nodes[i].length
	var it = 0;
	var scroll_count = 0;
	var key_count = 0; // count of how many items we've added.
	var item_count = 0;
	while(true){
		it ++;
		var good_indices = new Set();
		for(var i=0; i< heroes; i++){
			if(forced_index[i] != critical_nodes[i].length){
				good_indices.add(i);
			}
		}
		if(good_indices.size == 0){
			break;
		}
		var this_hero = r.choice(good_indices, seed + " choose hero " + it);
		// choose a method to make this vertex forced
		
		// HERE IS WHERE WE CAN PARAMETERIZE!!!
		//how do we choose a way?
		var forced_nodes = get_forced_nodes(critical_nodes, forced_index); 
		var other_forced_nodes = union_exclude_index(forced_nodes, this_hero);
		var node_to_force = critical_nodes[this_hero][forced_index[this_hero]];
		// forced_nodes is a list of sets , for each of the hero's forced nodes
		// other_forced_nodes is a single set, of all of the forced nodes for all heroes EXCEPT the given one.. 
		// node_to_force is the node we want to make forced.
		var way = r.choice(["scroll", "door", "blocker","blocker","blocker"], seed + " force choice " + it);
		//console.log("forcing node " + node_to_force + " using " + way)
		switch(way){
			case "scroll":
				// choose another hero's forced nodes
				var chosen_target = r.choice(other_forced_nodes, seed + " scroll "  + it)
				// add a monster there weak to the scroll, and add a scroll here.
				things_on_vertices[chosen_target].push([["scroll_" + name + scroll_count],[]])
				things_on_vertices[node_to_force].push("scroll_" + name + scroll_count);
				scroll_count += 1;
				//console.log("monster weak to scroll is at " + chosen_target)
			break;
			case "door":
				// choose another hero's forced nodes
				var chosen_target = r.choice(other_forced_nodes, seed + " scroll "  + it)
				// add a door there, and a key here
				things_on_vertices[chosen_target].push("door_" + name + key_count)
				things_on_vertices[node_to_force].push("lever_" + name + key_count);
				//console.log("door is at " + chosen_target)
				key_count += 1;			
			break;
			case "blocker":
			var siblings = trees[this_hero].get_vertex_by_name(critical_nodes[this_hero][forced_index[this_hero]-1]).next;
			for(var to_block of siblings){
				if(to_block.name == node_to_force){
					continue;
				} 
				var to_block_name = to_block.name ;
				// block the vertex to_block_name
				var block_way = r.choice(["monster", "key", "monster", "monster"] , seed + " block choice " + it);
				//console.log("blocking " + to_block_name + " with "  + way)
				switch(block_way){
					case "key":
						var other_forced_away_nodes = union_exclude_index(_.range(1, heroes+1).map(function(x){return forced_away(trees[i], forced_nodes[i])} ), -1);
						if(other_forced_away_nodes.size != 0){
							var key_here = r.choice(other_forced_away_nodes, seed + " key force away " + it);
							// put a key there and a door here
							things_on_vertices[to_block_name].push("door_" + name + key_count)
							things_on_vertices[key_here].push("lever_" + name + key_count);
							key_count ++;
							//console.log("key (force away) is at " + key_here)
							break;
						}
						// fall through
					case "monster":
						// choose another hero's forced node
						var chosen_target = r.choice(other_forced_nodes, seed + " monster block "  + it)
						// place a monster there and a monster here, both weak to the same item
						things_on_vertices[chosen_target].push([[name + " " +item_count],[]])
						things_on_vertices[to_block_name].push([[name + " " +item_count],[]])
						//console.log("monster is at " + chosen_target)
						item_count ++;
					break;
					
					
					
				}
				it ++;
			}
			
		}
		forced_index[this_hero] ++;
	}
	// graph made, now let's return :
	return [trees, things_on_vertices, scroll_count, key_count, item_count, destinations]
	
}

// given a list of DAGs and a vertex name (just the name), return which DAG contains the vertex
function get_hero(trees, vertex){
	for(var i=0; i<trees.length; i++){
		if(trees[i].get_vertex_by_name(vertex) != undefined){
			return i;
		}			
	}	
}
// generates as a DAG - not a full level instance. 

//dag should consist of : list of trees, hash table of things on vertices, list of scrolls, keys and items used, item pool. 
export function generate_level(seed, heroes, level_size, piece_size, scroll_limit=46, item_limit=114, key_limit=42, name=""){
	var trees = [];
	var things_on_vertices = {};
	var scrolls = [];
	var keys = [];
	var items = []; 
	var last_nodes = [];
	var starts = []
	var pool = [];
	// initialize
	for(var i=0; i<heroes; i++){
		trees.push(new dag([name + "root " + i], []));
		last_nodes.push(name + "root " + i);
		starts.push(name + "root " + i);
		things_on_vertices[name + "root " + i] = [];
	}
	for(var i=0; i<level_size; i++){
		////console.log("adding piece")
		var call_name = name + " part "+i
		var [r_trees, r_things_on_vertices, r_scroll_count, r_key_count, r_item_count, r_destinations] =generate_piece(seed + " part " + i, heroes, piece_size, call_name);
		// vertices are named (name + " tree " + hero number +" vertex "+ i)
		// example: "sample tree 2 vertex 1"
		// roots are named (name + " tree " + hero number + "root") (no space)
		// example: "sample tree 0root"
		// doors, levers, and scrolls are named (prefix + name + index)
		// example: scroll_sample2
		// items are named (name + " " + index)
		// example: sample 2
		merge_piece([trees, things_on_vertices, scrolls, keys, items, pool],[r_trees, r_things_on_vertices, r_scroll_count, r_key_count, r_item_count], call_name, heroes, last_nodes);
		for(var j=0; j<heroes; j++){
			last_nodes[j] = r_destinations[j]; 	
			
		}

	}
	
	////console.log([scrolls.length, keys.length, items.length]);
	
	// add some "merge" parts on non-terminal vertices....
	var target = 2 * level_size
	var additional_times = r.randint( Math.floor(target/2), target, seed + " additional times " );
	
	for(var i=0; i < additional_times; i++){
		// attach a r piece to a r blocked leaf. 
		
		var [r_trees, r_things_on_vertices, r_scroll_count, r_key_count, r_item_count, r_destinations] = generate_piece(seed + " extra piece " + i, heroes,  piece_size, name + " extra piece " + i)
		////console.log(piece_size)
		
		
		// choose a r non-critical leaf node to attach onto.
		var attach_to = [];
		for(var j=0; j<heroes; j++){
			var temp = trees[j].get_leaves();
			temp.delete(last_nodes[j])
			attach_to.push(r.choice( temp, seed + " attach to " + i + " " + j) );
		}
		merge_piece([trees, things_on_vertices, scrolls, keys, items, pool ], [ r_trees, r_things_on_vertices, r_scroll_count, r_key_count, r_item_count],  name + " extra piece " + i, heroes, attach_to);
	}
	
	////console.log([scrolls.length, keys.length, items.length]);
	

	
	
	//  don't use Object.keys, order is inconsistent
	// get critical vertices
	var critical_vertices = new Set();
	var herowise_critical_vertices = [];
	
	for(var i=0; i< heroes; i++){
		herowise_critical_vertices.push([]);
		var readhead = last_nodes[i];
		while(readhead != undefined){
			critical_vertices.add(readhead);
			herowise_critical_vertices[i].push(readhead)
			readhead = Array.from(trees[i].get_vertex_by_name(readhead).prev)[0]
			if(readhead != undefined){
				readhead = readhead.name;
			}
		}
	}
	var non_critical_vertices = new Set();
	for(var i=0; i< heroes; i++){
		for(var vertex of trees[i].get_vertices()){
			if(!critical_vertices.has(vertex)){
				non_critical_vertices.add(vertex);
			}
		}
	}
	
	// get items that each hero needs
	
	var items_needed = [];
	for(var i=0; i< heroes; i++){
		items_needed.push([])
		var readhead = last_nodes[i];
		while(readhead != undefined){
			// look at this vertex and get its monsters;
			var this_items = things_on_vertices[readhead];
			for(var thing_on_vertex of this_items){
				// if it's a monster, then iterate over its weaknesses
				if(Array.isArray(thing_on_vertex)){
					for(var weakness of thing_on_vertex[0]){
						if(weakness.indexOf("scroll_") == -1){
							items_needed[i].push(weakness);
						}
					}
				}
			}
			readhead = Array.from(trees[i].get_vertex_by_name(readhead).prev)[0]
			if(readhead != undefined){
				readhead = readhead.name;
			}
		}
	}

	// make sure every hero needs at least one item
	for(var i=0; i< heroes; i++){
		if(items_needed[i].length == 0){
			// choose a random vertex on this hero's critical path
			var vertex_to_add = r.choice(herowise_critical_vertices[i], seed + " force hero item " + i);
			var item_name = name + "force hero item " + i;
			things_on_vertices[vertex_to_add].push([[item_name],[]]);
			items.push(item_name);
			pool.push(item_name);
			items_needed[i].push(item_name);
			
		}
	}
	
	//  get all non-empty vertices
	
	var empty_vertices = []
	for(var i=0; i < heroes; i++){
		empty_vertices = empty_vertices.concat(Array.from(trees[i].get_vertices()).filter(function(x){return things_on_vertices[x].length == 0})  );
	}
	var critical_empty_vertices = empty_vertices.filter(function(x){return critical_vertices.has(x)});
	
	var non_critical_empty_vertices = empty_vertices.filter(function(x){return !critical_vertices.has(x)});

	// now make them all sets
	
	empty_vertices = new Set(empty_vertices);
	
	critical_empty_vertices = new Set(critical_empty_vertices);
	non_critical_empty_vertices = new Set(non_critical_empty_vertices);
	
	
	//start adding eggs
	//var egg_count = Math.floor(Object.keys(things_on_vertices).length/10); 
	var egg_count =  Math.floor(Object.keys(things_on_vertices).length/10); 
	var eggs_to_hatch = [];
	for(var i=0; i<egg_count; i++){
		//egg to hatch : replace a scroll or key on a critical vertex with an egg. Make it weak to a new item. add monsters weak to that item on non-critical.
		// egg to not hatch: put it on a critical vertex, weak to an item that another hero needs. drops a scroll. put monsters weak to that scroll on non-critical vertices.
		var candidate_eggs = Array.from(critical_vertices).filter(function(x){
			return _.some(things_on_vertices[x], function(y){
				// item is a key or a scroll
				return typeof(y) == "string" && (y.indexOf("lever_") != -1 || y.indexOf("scroll_") != -1); 
			})
		})
		if(candidate_eggs.length == 0){
			var add_hatch_egg = false;
		}
		else {
			var add_hatch_egg = r.randint(0, 2, seed + " egg hatch " + i) == 0;
		}
		if(add_hatch_egg){
			
		//egg to hatch : replace a scroll or key on a critical vertex with an egg. Make it weak to a new item. add monsters weak to that item on non-critical.
			var candidate_eggs_empty = candidate_eggs.filter(function(x){ return empty_vertices.has(x)});
			
			if(candidate_eggs_empty.length == 0){
				// choose fron candidate_eggs
				var vertex_to_egg = r.choice(candidate_eggs, seed + " egg choice " + i);
			}
			else {
				// choose from candidate_eggs_empty
				var vertex_to_egg = r.choice(candidate_eggs_empty, seed + " egg choice " + i);
			}
			//console.log(vertex_to_egg + " hatch egg");
			// choose non-critical vertices
			if(non_critical_empty_vertices.size > 0){
				var non_critical_choice = non_critical_empty_vertices;
			} else {
				var non_critical_choice = non_critical_vertices;
			}
			var vertices_to_add = r.choice_n(non_critical_choice, Math.min(3, non_critical_choice.size), seed + " non crit choice " + i);
			
			// make the given vertex an egg
			var index = _.findIndex(things_on_vertices[vertex_to_egg],function(y){
				// item is a key or a scroll
				return typeof(y) == "string" && (y.indexOf("lever_") != -1 || y.indexOf("scroll_") != -1); 
			})
			var hero = get_hero(trees,vertex_to_egg);
			eggs_to_hatch.push([vertex_to_egg, index]);
			items.push(name +"item from open egg " + i);
			pool.push(name +"item from open egg " + i);
			items_needed[hero].push(name +"item from open egg " + i);
			things_on_vertices[vertex_to_egg][index] = [[name + "item from open egg " + i],[things_on_vertices[vertex_to_egg][index]],true]
			for(var vertex of vertices_to_add){
				things_on_vertices[vertex].push([[name + "item from open egg " + i],[]])
			}
			// update empty lists
			empty_vertices.delete(vertex_to_egg);
			critical_empty_vertices.delete(vertex_to_egg);
			for(var vertex of vertices_to_add){
				empty_vertices.delete(vertex)
				non_critical_empty_vertices.delete(vertex);
			}
		} else {
			// egg to not hatch: put it on a critical vertex, weak to an item that another hero needs. drops a scroll/key. put monsters weak to that scroll/doors opened by that key on non-critical vertices.
			var vertex_to_egg_choices = critical_empty_vertices.size == 0? critical_vertices : critical_empty_vertices 
			var vertex_to_egg = r.choice(vertex_to_egg_choices, seed + " add closed egg " + i);
			//console.log(vertex_to_egg + " not hatch egg");
			var hero = get_hero(trees,vertex_to_egg);
			// choose where to put the monsters
			if(non_critical_empty_vertices.size > 0){
				var non_critical_choice = non_critical_empty_vertices;
			} else {
				var non_critical_choice = non_critical_vertices;
			}
			var vertices_to_add = r.choice_n(non_critical_choice, Math.min(3, non_critical_choice.size), seed + " non crit choice closed " + i);

			// choose an item that another hero needs
			var it=0;
			var other_item = undefined;
			while(other_item == undefined){
				it++;
				var other_hero = r.randint(0, heroes-1, seed + " other hero " + i + " " + it);
				if(other_hero >= hero){
					other_hero ++;
				}
				// choose any item from there
				if(items_needed[other_hero].length != 0){
					other_item = r.choice(items_needed[other_hero] , seed + " other hero item " + i + " " + it);
				}
			}
			// add the egg
			var choice = r.choice(["scroll","key"], seed + " closed egg choice " + i);
			if(choice == "scroll"){
				var scroll_name = "scroll_" + name + "scroll from closed egg" + i;
				scrolls.push(scroll_name);
				things_on_vertices[vertex_to_egg].push([[other_item], [scroll_name], true]);
				for(var vertex of vertices_to_add){
					things_on_vertices[vertex].push([[scroll_name],[]])
				}
			} else {
				var key_name = "lever_" + name + "scroll from closed egg" + i;
				things_on_vertices[vertex_to_egg].push([[other_item], [key_name], true]);
				for(var vertex of vertices_to_add){
					things_on_vertices[vertex].push("door_" + name + "scroll from closed egg" + i);
				}
				keys.push(key_name);
			}
			// update empty lists
			empty_vertices.delete(vertex_to_egg);
			critical_empty_vertices.delete(vertex_to_egg);
			for(var vertex of vertices_to_add){
				empty_vertices.delete(vertex)
				non_critical_empty_vertices.delete(vertex);
			}
			
		}
	}
	////console.log([scrolls.length, keys.length, items.length]);
	
	// make sure no vertex is empty.	
	var it = 0;
	while(empty_vertices.size != 0 ){
		it++;
		/*
		we have empty vertices (critical and non-critical) that we want to fill in.

		how can we do this?

		we also have "remainder" scrolls, items and keys. we do NOT need to use all of them

		S I K C NC for scroll , item, key, critical empty vertex, non-critical empty vertex

		cost : 1 C 1 C/NC 1 K
		place a key on the critical vertex, and a door on the non-critical one. If on the same path, they key must be before the door.

		cost : * NC 1 S
		place a scroll anywhere, and monsters weak to that scroll anywhere. scroll and monsters both NC, since right now scrolls basically indicate the correct path.

		cost : * C/NC 1 I
		place monsters weak to a certain item. Forcing the hero to have that item. Can only use critical vertices for one hero.

		cost : * NC
		place monsters weak to an existing scroll or item
		
		names will be (prefix)fill in (it)
		
		
		*/
		var options = []
		if(keys.length < key_limit && empty_vertices.size >= 2 && critical_empty_vertices.size >= 1){
			options.push("key");
			options.push("key");
		}
		if(scrolls.length < scroll_limit && non_critical_empty_vertices.size >= 2){
			options.push("scroll");
			options.push("scroll");
		}
		if(items.length < item_limit && critical_empty_vertices.size >= 1){
			options.push("item");
			options.push("item");
		}
		if(non_critical_empty_vertices.size >= 1){
			if(scrolls.length > 0){
				options.push("weak to existing scroll");
			}
			if(items.length > 0){
				options.push("weak to existing item");
			}
		}
		if(critical_empty_vertices.size >= 1){
				options.push("weak to existing item (critical)");
		}
		if(options.length == 0){
			break;
		}
		var chosen_option = r.choice(options, seed + " fill in " + it);
		switch(chosen_option){
			case "key":
				// choose any two vertices. If one of them is critical and other is not, then the critical one must get the key. 
				// if both are critical , earlier one gets key
				var [p1, p2] = r.choice_n(empty_vertices, 2, seed + " a " + it);
				// unless crit/non crit as above, p1 gets door and p2 gets key. 
				if(critical_empty_vertices.has(p1) && critical_empty_vertices.has(p2)){
					// both critical, 
					var hero = get_hero(trees, p1)
					if(trees[hero].get_vertex_by_name(p2) != undefined && trees[hero].get_vertex_by_name(p1).succ.has(trees[hero].get_vertex_by_name(p2))){
						// p1 comes first, p1 takes key
						var key_vertex = p1;
						var door_vertex = p2;
					} else{
						var key_vertex = p2;
						var door_vertex = p1;
					}
				}
				if(!critical_empty_vertices.has(p1) && critical_empty_vertices.has(p2)){
					// swap p1 and p2
					[p1, p2] = [p2,p1]
				}
				if(critical_empty_vertices.has(p1) && !critical_empty_vertices.has(p2)){
					// p1 is critical, gets key
					var key_vertex = p1;
					var door_vertex = p2;
				}
				if(!critical_empty_vertices.has(p1) && !critical_empty_vertices.has(p2)){
					// neither critical, doesn't matter
					var key_vertex = p1;
					var door_vertex = p2;				
				}
				// key_vertex takes key, door_vertex takes door
				things_on_vertices[key_vertex].push("lever_" + name + "fill in " + it )
				things_on_vertices[door_vertex].push("door_" + name + "fill in " + it )
				keys.push("lever_" + name + "fill in " + it )
			break;
			case "scroll":
				var [p1, p2] = r.choice_n(non_critical_empty_vertices, 2, seed + " a " + it);
				// put a monster on one of them and a scroll on another.
				things_on_vertices[p1].push("scroll_" + name + "fill in " + it )
				things_on_vertices[p2].push([["scroll_" + name + "fill in " + it],[]] )
				scrolls.push("scroll_" + name + "fill in " + it);
			break;
			case "item":
				var p1 = r.choice(critical_empty_vertices, seed + " a "  + it);
				things_on_vertices[p1].push([[name + "fill in " + it],[]] )
				items.push(name + "fill in " + it);
				pool.push(name + "fill in " + it);
				var hero = get_hero(trees,p1);
				items_needed[hero].push(name + "fill in " + it)
			break;
			case "weak to existing scroll":
				var p1 = r.choice(non_critical_empty_vertices, seed + " a "  + it);
				var scroll_ = r.choice(scrolls, seed + " b" + it);
				things_on_vertices[p1].push([[scroll_],[]] );
			break;
			case "weak to existing item":
				var p1 = r.choice(non_critical_empty_vertices, seed + " a "  + it);
				var item_ = r.choice(items, seed + " b" + it);
				things_on_vertices[p1].push([[item_],[]] );
			break;
			case "weak to existing item (critical)":
				var p1 = r.choice(critical_empty_vertices, seed + " a "  + it);
				var hero = get_hero(trees,p1);
				if(items_needed[hero].length == 0){
					continue;
				}
				var item_thing = r.choice(items_needed[hero], seed + " b " + it);
				things_on_vertices[p1].push([[item_thing],[]]);
			break;
		}
		for (var s of [empty_vertices, critical_empty_vertices, non_critical_empty_vertices]){
			s.delete(p1);
			s.delete(p2);
		}
	}
	////console.log([scrolls.length, keys.length, items.length]);
	
	//console.log([heroes,starts, trees, things_on_vertices, scrolls, keys, items, pool]);
	//console.log(JSON.stringify([herowise_critical_vertices, items_needed, eggs_to_hatch])); // SOLUTION
	//console.log("generation is DONE");
	// one line to get all monster weakness items :
	
	// for(var i=0; i<heroes; i++) { ////console.log(new Set(_.flatten(_.flatten(trees[i].get_vertices().map(function(x){return things_on_vertices[x]})).filter(function(x){return typeof(x) != "string"}).map(function(x){return x[0]}))))}
	
	// failure due to too many, try again.
	if(scrolls.length > scroll_limit || keys.length > key_limit || items.length > item_limit){
		return generate_level(seed + "a", heroes, level_size, piece_size, scroll_limit, item_limit, key_limit, name);
	}
	

	
	
	
			if(Array.isArray(things_on_vertices)){
				throw new Error("things on vertices is array");
			}
			
	return [heroes,starts, trees, things_on_vertices, scrolls, keys, items, pool, herowise_critical_vertices, items_needed, eggs_to_hatch];
}



// for things_on_vertices:
// scrolls, doors and keys are strings with prefixes scroll_, door_, lever_.
// monsters are pairs (list of weaknesses, list of drops)


export function compile_level(seed, heroes,starts, trees, things_on_vertices, scrolls, keys, items,pool, ignore_overflow = false, return_matching = false){
	////console.log(scrolls)
	////console.log(keys)
	////console.log(items)
	////console.log(pool)

	// turns the given things into a real level.
	// uses display tables to see which names are "valid".
	// monsters, doors and heroes are NOT needed right now, since they don't have to be unique
	// all items in the pool MUST be in the items list
	var item_table = r.shuffle(Object.keys(d.item_table), Math.random());
	var scroll_table = r.shuffle(Object.keys(d.scroll_table), Math.random());
	var key_table = r.shuffle(Object.keys(d.key_table), Math.random());
	var monster_table = r.shuffle(Object.keys(d.monster_table), Math.random());
	
	if(item_table.length < items.length){
		if(ignore_overflow == false){
			throw Error("too many items");
		} else {
			//console.log("too many items")
		}
	}
	if(scroll_table.length < scrolls.length){
		if(ignore_overflow == false){
			throw Error("too many scrolls");
		} else {
			//console.log("too many scrolls")
		}
	}
	if(key_table.length < keys.length){
		if(ignore_overflow == false){
			throw Error("too many keys");
		} else {
			//console.log("too many keys")
		}
	}

	// if ignore_overflow is true, all overflows will be set to "nothing".
	var matching = {}; // key = item, scroll or key name.  value : something that can be in the dungeon's "stuff"
	var scrolls_shuffled = r.shuffle(scrolls, seed + " scroll shuffle");
	var items_shuffled = r.shuffle(items, seed + " items shuffle");
	var keys_shuffled = r.shuffle(keys, seed + " keys shuffle"); 
	for(var i=0; i < scrolls_shuffled.length; i++){
		matching[scrolls_shuffled[i] ] = scroll_table[i] == undefined ? scrolls_shuffled[i] : scroll_table[i]
	}
	for(var i=0; i < items_shuffled.length; i++){
		matching[items_shuffled[i] ] = item_table[i] == undefined ? new item(items_shuffled[i] , []) : new item(item_table[i], [])
	}
	for(var i=0; i < keys_shuffled.length; i++){
		matching[keys_shuffled[i] ] = key_table[i] == undefined ? keys_shuffled[i]  : key_table[i]
		matching[keys_shuffled[i].replace("lever","door") ] = key_table[i] == undefined ? keys_shuffled[i].replace("lever","door")  : key_table[i].replace("lever","door")
	}
	var dungeons = [];
	var monster_count = 0;
	for(var i=0; i < heroes; i++){
		// add in the levels from the table
		for(var vertex of trees[i].get_vertices()){
			var things = things_on_vertices[vertex];
			var dungeon_things = ["nothing"].concat(things.map(function(x){
				if(typeof(x) == "string"){
					return matching[x]
				} else {
					return new monster(r.choice(monster_table, Math.random()), x[0].map(function(x){return matching[x].name == undefined? matching[x] : matching[x].name}), x[1].map(function(x){return matching[x]}), x[2] == true);
					monster_count++;
				}
			}));
			// last element cannot be an egg
			if(dungeon_things[dungeon_things.length -1]  instanceof monster && dungeon_things[dungeon_things.length -1].is_egg){
				dungeon_things.push("nothing");
			}
			// leaf nodes must end with nothing
			if(dungeon_things[dungeon_things.length -1] != "nothing" && trees[i].get_vertex_by_name(vertex).next.size == 0){
				dungeon_things.push("nothing");
			}
			// dungeon cannot have size 0 or 1
			while(dungeon_things.length < 2){
				dungeon_things.push("nothing");
			}
			var nexts = [];
			for(var next_vertex of trees[i].get_vertex_by_name(vertex).next){
				nexts.push(next_vertex.name);
			}
			// make a new dungeon
			dungeons.push(new dungeon(vertex, dungeon_things, nexts.length == 0? "exit"  : nexts));
		}
		
	}
	//console.log("matching is")
	//console.log(JSON.stringify(matching))
	pool =  r.shuffle(pool, Math.random());;
	if(return_matching){
		return [new level(dungeons, starts, pool.map(function(x){return matching[x]})) , matching];
	} 	
	return new level(dungeons, starts, pool.map(function(x){return matching[x]}));
}


export function generate_and_compile(seed, heroes, level_size, piece_size, scroll_limit=46, item_limit=114, key_limit=42, name=""){
	while(true){
		var [heroes,starts, trees, things_on_vertices, scrolls, keys, items,pool, herowise_critical_vertices, items_needed, eggs_to_hatch] = generate_level(seed, heroes, level_size, piece_size, scroll_limit, item_limit, key_limit, name )
		var [t1, matching] = compile_level("a" , heroes,starts, trees, things_on_vertices, scrolls, keys, items,pool, false, true);
		//var solution = [herowise_critical_vertices, items_needed, eggs_to_hatch]
		// first, make the starting items 
		var inv_matching = {}
		for(var x of Object.keys(matching)){
			var y= matching[x]
			if(typeof(y) == "object"){
				inv_matching[y.name]= x;
			}
			else{
				inv_matching[y]= x;
			}
		}
		var starting_items = [];
		for(var i = 0 ; i < t1.item_pool.length ; i++){
			var added = false;
			for(var j=0; j < items_needed.length; j++){
				// if hero j requires item i : add it in
				if( items_needed[j].indexOf(inv_matching[t1.item_pool[i].name] ) != -1){
					added = true;
					starting_items.push(t1.starts[j])
					break;
				}
			}
			if(added == false){
				starting_items.push(undefined);
			}
		}
		// eggs
		var hatches = {}
		var eggs_to_hatch_2 = [];
		for(var egg of eggs_to_hatch){
			eggs_to_hatch_2.push(egg[0] + " " + egg[1]);
		}
		for(var d of Object.keys(things_on_vertices)){
			var things = things_on_vertices[d];
			for(var i=0; i<things.length; i++){
				var thing = things[i];
				if(thing[2] == true){
					hatches[d + " " + (i+1)]  = (eggs_to_hatch_2.indexOf(d + " " + i) != -1)
				}
			}
		}
		var directions = {};
		for(var d of Object.keys(things_on_vertices)){
			if(t1.dungeon_table[d].next == "exit"){
				continue;
			}
			directions[d] = 0;
			for(var i=0; i  < t1.dungeon_table[d].next.length; i++){
				var next = t1.dungeon_table[d].next[i];
				if(_.some(herowise_critical_vertices, function(x){return x.indexOf(next) != -1})){
					directions[d] = i;
					break;
				}
			}
		}
		var sol = new solution(starting_items, hatches, directions);
		var rl = is_solution(t1,sol);
		if(rl){
			return t1;
		} else {
			seed = seed + "a";
		}
		//check if given solution is actually a solution
		
	}
	
}

