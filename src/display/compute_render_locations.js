import * as c from "./display_constants.js";
import * as r from "../classes/random.js";
const _ = require("lodash");
export function merge(obj1, obj2){ // mutates obj1
	for(var key of Object.keys(obj2)){
		obj1[key] = obj2[key]
	}
}

function vertex_size(level, vertex_){
	return level.dungeon_table[vertex_.name].stuff.length
}

var collision_margin = 30


function get_max_move_up(set1, set2, y_limit = 0){
	// set1 and set2 are lists of rectangles, given in the form tlx, tly, brx, bry.
	// get the most that we can move set2 up by, without going above any in set1
	// and also, y coordiante of any set2 element cannot be < y_limit
	//console.log("CALLED" + JSON.stringify(set1) + " " + JSON.stringify(set2))
	// assumes set1 is above set2
	if(set2.length == 0){
		throw new Error("second set is empty");
	}
	var y_move = Infinity;
	for (var rect2 of set2){
		y_move = Math.min(rect2[1] - y_limit, y_move);
		//console.log(y_move)
		for(var rect1 of set1){
			// if they don't collide, continue
			if(rect1[0] - collision_margin >= rect2[2] || rect1[2] <= rect2[0] - collision_margin){
				continue;
			}
			// rect2 top - rect1 bottom 
			y_move = Math.min(y_move, rect2[1] - rect1[3] - collision_margin);
			//console.log(y_move)
			//console.log(rect1 + " " + rect2)
		}
	}
	if(isNaN(y_move) || y_move < -collision_margin) {
		throw Error("invalid input");
	}
	//console.log(y_move);
	return y_move
}
function compute_render_locations(level, vertex_, start_w =0 , start_h =0, recursion_depth = 0){
	// input : "level" is a level, "vertex" is a vertex object(NOT the name), start_w and start_h are locations of the top left corner of "render area"
	//	which is NOT the location of root vertex
	
	// returns a triple : 
	// 1. hash table (vertices -> x and y of top left, x and y of bottom right, does NOT include any right gaps)
	// 2 and 3. width and height of entire render (NOT x and y coords of bottom).
	
	// base case : node has no children
	if(vertex_.succ.size == 0){
		return [{[vertex_.name] : [start_w,start_h,start_w + c.box_width * vertex_size(level, vertex_) , start_h + c.box_height ]},c.box_width * vertex_size(level, vertex_) , c.box_height ]  
	}
	// render each of its children
	else {
		var rendered = {};
		var root_width = c.box_width * vertex_size(level, vertex_) + c.right_gap
		var y_cumulative = 0;
		var x_max = 0;
		
		for(var next of vertex_.next){
			// render the next one
			
			var result = compute_render_locations(level, next, root_width + start_w, y_cumulative+start_h,recursion_depth+1);
			x_max = Math.max(result[1], x_max);
			
			// move up
			var existing_rectangles = Object.values(rendered);
			var new_rectangles = Object.values(result[0]);
			var y_move_up = existing_rectangles.length == 0 ? 0 : get_max_move_up(existing_rectangles, new_rectangles, start_h) 
			
		//	console.log([existing_rectangles, new_rectangles, y_move_up])
			for(var a of Object.keys(result[0])){
				result[0][a][1] -= y_move_up
				result[0][a][3] -= y_move_up
			}
			y_cumulative += Math.max(0, result[2] - y_move_up);
		//	console.log(y_cumulative);
			// merge this render and rendered
			for(var vertex2 of Object.keys(result[0])){
				rendered[vertex2] =  result[0][vertex2]
			}
		}
		var root_tl = [start_w, Math.floor((y_cumulative- c.box_height)/2 ) + start_h]
		rendered[vertex_.name] = [root_tl[0], root_tl[1], root_tl[0] + c.box_width * vertex_size(level, vertex_) , root_tl[1] + c.box_height  ]
		
		// assert every bottom right is <= y_cumulative
		for(var rect of Object.values(rendered)){
			if(rect[3] > y_cumulative+start_h+c.box_height){
				throw new Error("rect[3] > y_cumulative")
			}
		}
		return [rendered, x_max+root_width, y_cumulative+c.box_height]
	}
	
	
	
}

// rectangle geometry stuff

function pointInsideRectangle(px, py, tlx, tly, width, height){
	if(px < tlx || px > tlx+width || py < tly || py > tly+height){
		return false;
	}
	return true;
}
// given as tlx, tly, brx, bry

function doRectanglesIntersect(r1, r2){
	if(r1.length != 4 || r2.length != 4){
		throw new Error("rectangles intersect error");
	}
	//console.log(r1, r2);
	for(var point of [[r1[0], r1[1]], [r1[0], r1[3]], [r1[2], r1[1]], [r1[2], r1[3]]]){
		if(pointInsideRectangle(point[0], point[1], r2[0], r2[1], r2[2] - r2[0], r2[3] - r2[1])){
			return true;
		}
	}
	return false; 
}

// level : a level instance
// randomize : either undefined, or a seed to "nudge" the locations of every vertex
function compute_render_locations_total(level, randomize = undefined){
	var obj = {};
	var y_val = 0;
	var x_max = 0;
	for(var start of level.starts){
		var result = compute_render_locations(level, level.dag.get_vertex_by_name(start), 0, y_val);
		x_max = Math.max(x_max, result[1])
		y_val  += result[2];
		merge(obj, result[0]);
	}

	if(randomize != undefined){
		//
		var it = 0
		for (var rect of Object.keys(obj)){
			// make 5 attempts to move it
			for(var i = 0; i < 5; i++){
				it++;
				var rects = Object.values(obj);
				// choose a new location
				var dxc = 300;
				var dyc = 150
				var dx = r.randint(0, dxc, randomize + " x "  + it) - dxc/2;
				var dy = r.randint(0, dyc, randomize + " y "  + it) - dyc/2;			
				var new_rect = [obj[rect][0] - dx, obj[rect][1] - dy, obj[rect][2] - dx, obj[rect][3] - dy]
				// check if it's valid
				if(! _.some(rects, function(x){return doRectanglesIntersect(new_rect, [x[0] - collision_margin, x[1] - collision_margin, x[2] + collision_margin, x[3] + collision_margin]) && obj[rect] != x }) && new_rect[0] >= 0 && new_rect[1] >= 0
				&& 
				(level.dag.get_vertex_by_name(rect).prev.size == 0 || obj[Array.from(level.dag.get_vertex_by_name(rect).prev)[0].name][2] < new_rect[0] - collision_margin) // can't collide with parent when movign left
				&& 
				! _.some(Array.from(level.dag.get_vertex_by_name(rect).next), function(x){ return new_rect[2] >= obj[x.name][0] - collision_margin}) // can't collide with children when moving right
				){
					//move!
					obj[rect] = new_rect;
					break
				}
			}
		}
	}
	console.log(obj)
	return [obj, _.max(Object.values(obj).map(function(x){return x[2]})), _.max(Object.values(obj).map(function(x){return x[3]}))  ];
}
export default compute_render_locations_total; 