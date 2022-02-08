
/*

for item in ["monster", "item", "dungeon", "level", "run_level" ,"solution"]:
	print("import {} from \"./{}.js\";".format(item, item))
	
*/
import monster from "./monster.js";
import item from "./item.js";
import dungeon from "./dungeon.js";
import level from "./level.js";
import run_level from "./run_level.js";
import solution from "./solution.js";
import is_solution from "./is_solution.js";
import dag from "./dag.js";
import compute_render_locations_total from "../display/compute_render_locations.js"
import {items} from "./tables.js"
import {compile_level} from "./generator.js"
import * as g from "./generator.js";

const _ = require("lodash");
function shift(render, x,y){
	for(var t of Object.values(render[0])){
		t[0] += x;
		t[1] += y;
		t[2] += x;
		t[3] += y;
	}
	render[1] += Math.max(0, x);
	render[2] += Math.max(0, y);
}
export function tutorial(v){
	if(v == 1){
		var t1 =compile_level("", 1, ["v1"], [new dag(["v1", "v2"], [["v1","v2"]])], {"v1":[], "v2":[]}, [], [],[],[])
		var v1 = compute_render_locations_total(t1); 
		shift(v1, 200, 200);
		var extra_draw_stuff = []
		
		extra_draw_stuff.push({type:"text", x:30, y:30, scroll:true, data:"Get all of the heroes to the exit (glowing tile on the right)"})
		extra_draw_stuff.push({type:"text", x:30, y:60, scroll:true, data:"Click \"start\" and watch your hero go!"})

		
		
		v1[2] += 200;
		v1[1] += 200;
		return [t1, v1, extra_draw_stuff]
	}	else if (v == 2){
		var t1 =compile_level("", 1, ["v1"], [new dag(["v1"], [])], {"v1":[[["a"],["b"]], [["b"],[]]],}, [], [],["a","b"],["a"])
		var v1 = compute_render_locations_total(t1); 
		shift(v1, 200, 200);
		var extra_draw_stuff = []
		
		extra_draw_stuff.push({type:"text", x:30, y:90, scroll:true, data:"In front of the hero is a monster. "})		
		
		extra_draw_stuff.push({type:"text", x:30, y:120, scroll:true, data:"Weaknesses on top, drops on bottom"})	

		extra_draw_stuff.push({type:"text", x:30, y:520, scroll:true, data:"Click on a hero to go to their inventory"})
		
		extra_draw_stuff.push({type:"text", x:30, y:550, scroll:true, data:"Note: you can't change equips while running a solution. If you are, press \"reset\" first."})
		v1[2] += 200;
		v1[1] +=600;
		return [t1, v1, extra_draw_stuff]

	}		else if (v == 3){
		
		var t1 =compile_level("", 3, ["v1", "w1", "x1"], [new dag(["v1"], []), new dag(["w1"], []), new dag(["x1"], [])], {"v1":[[["a"],[]]], "w1":[[["b"],[]]],"x1":[[["c"],[]]]}, [], [],["a", "b","c"],["a", "b","c"])
		var v1 = compute_render_locations_total(t1); 
		shift(v1, 200, 170);
		var extra_draw_stuff = []
		extra_draw_stuff.push({type:"text", x:30, y:30, scroll:true, data:"Now, there are three heroes."})

		v1[2] += 300;
		v1[1] += 400;
		
		extra_draw_stuff.push({type:"text", x:30, y:60, scroll:true, data:"Scroll using the arrow/WASD keys, or by clicking on the minimap in the bottom right corner"})
		return [t1, v1, extra_draw_stuff]
		
	} else if(v == 4){
		var t1 =compile_level("", 2, ["v1","w1"], [new dag(["v1"], []), new dag(["w1"], [])], {"v1":["door_1", [["a"],[]] ] , "w1":[[["b"],["lever_1"]]] }, [], ["lever_1"],["a","b"],["a","b"])
		var v1 = compute_render_locations_total(t1); 
		shift(v1, 200, 200);
		var extra_draw_stuff = []
		
		
		extra_draw_stuff.push({type:"text", x:30, y:30, scroll:true, data:"Doors block heroes until they are unlocked"})
		extra_draw_stuff.push({type:"text", x:30, y:60, scroll:true, data:"Collecting a key will unlock all doors that the key can unlock, in the entire dungeon."})	
		v1[2] += 300;
		v1[1] += 400;
		return [t1, v1, extra_draw_stuff]
		
	}
	else if (v == 5){
		
		var t1 =compile_level("", 2, ["v1", "w1"], [new dag(["v1"], []), new dag(["w1","w2","w3"], [["w1","w2"], ["w1", "w3"]]) ], {"v1":["door_1"], "w1":[], "w2":[],"w3":["lever_1"]}, [], ["lever_1"],[],[])
		var v1 = compute_render_locations_total(t1); 
		shift(v1, 200, 200);
		var extra_draw_stuff = []
		extra_draw_stuff.push({type:"text", x:30, y:120, scroll:true, data:"Sometimes, the dungeon branches"})
		
		extra_draw_stuff.push({type:"text", x:30, y:150, scroll:true, data:"To choose which path to take, click on the first tile of the path's end point"})
		extra_draw_stuff.push({type:"text", x:30, y:180, scroll:true, data:"This can only be done when NOT running a solution"})
		
		
		extra_draw_stuff.push({type:"text", x:30, y:370, scroll:true, data:"Alternatively, click the last tile of a room to iterate over the possible next paths"})
		extra_draw_stuff.push({type:"text", x:430, y:770, scroll:true, data:"Click the first tile here"})
		v1[2] += 300;
		v1[1] += 300;

		console.log(v1)
		return [t1, v1, extra_draw_stuff]
		
	}
	
	else if (v == 6){
		var t1 =compile_level("", 2, ["v1", "w1"], [new dag(["v1"], []), new dag(["w1"], []) ], {"v1":["door_1"], "w1":[[["a"],["lever_1"]]], }, [], ["lever_1"],["a"],["a"])
		
		//var t1 =compile_level("", 2, ["v1", "w1"], [new dag(["v1"], []), new dag(["w1","w2","w3"], [["w1","w2"], ["w1", "w3"]]) ], {"v1":[[["scroll_a"],[]]], "w1":[], "w2":[],"w3":[[["a"],["scroll_a"]]]}, ["scroll_a"], [],["a"],["a"])
		var v1 = compute_render_locations_total(t1); 
		shift(v1, 200, 200);
		var extra_draw_stuff = []
		extra_draw_stuff.push({type:"text", x:30, y:30, scroll:true, data:"Books and scrolls (not to be confused with scrolling the map) kills all monsters weak to them"})

		v1[2] += 300;
		v1[1] += 800;

		console.log(v1)
		return [t1, v1, extra_draw_stuff]
		
	}
	
	else if (v == 7){
		var t1 =compile_level("", 2, ["v1", "w1"], [new dag(["v1", "v2", "v3"], [["v1", "v2"], ["v1", "v3"]]), new dag(["w1","w2","w3"], [["w1","w2"], ["w1", "w3"]]) ], {"v1":[[["item_a"],["lever_a"], true] ], "v2":[],v3 : [ [["item_b"],[]], [["item_c"],["scroll_b"], true]] , "w1":[[["item_a"],[]] ], "w2":["door_a"],"w3":[[["scroll_b"],[]]]}, ["scroll_a", "scroll_b"], ["lever_a"],["item_a", "item_b", "item_c"],["item_a", "item_b", "item_c"])
		var v1 = compute_render_locations_total(t1); 
		shift(v1, 100, 100);
		var extra_draw_stuff = []
		extra_draw_stuff.push({type:"text", x:30, y:30, scroll:true, data:"Monster eggs are optional monsters. You can choose whether or not to fight them."});
		extra_draw_stuff.push({type:"text", x:30, y:60, scroll:true, data:"If you don't fight them, you don't get the drop"});
		extra_draw_stuff.push({type:"text", x:30, y:90, scroll:true, data:"Click on an egg to toggle whether or not to hatch (and then fight) it."});
		
		console.log(v1)
		return [t1, v1, extra_draw_stuff]		
		
	}
	else if (v == 8){
		
		var t1 = g.generate_and_compile("a",3,1, [4,6] )
		var v1 = compute_render_locations_total(t1); 
		shift(v1, 300, 300);
		var extra_draw_stuff = []		
		
		extra_draw_stuff.push({type:"text", x:30, y:30, scroll:true, data:"This is your first real level. Good luck!"});
		extra_draw_stuff.push({type:"text", x:30, y:60, scroll:true, data:"Objects are color coded as follows:"});
		extra_draw_stuff.push({type:"text", x:30, y:90, scroll:true, data:"scroll/book = red | key = blue | monster = yellow | egg = green | door = purple | item = no border"});
		extra_draw_stuff.push({type:"text", x:30, y:120, scroll:true, data:"You can go to a hero's inventory , or scroll to that hero, by clicking on their icon on the bottom"});

		return [t1, v1, extra_draw_stuff]	
	}
	else if (v == 9){
		var t1 = g.generate_and_compile("b",3, 2, [3,4] )
		var v1 = compute_render_locations_total(t1); 
		shift(v1, 100, 100);
		var extra_draw_stuff = []		
		
	
		return [t1, v1, extra_draw_stuff]			
		
	}
	
	else if (v == 10){
		var t1 = g.generate_and_compile("b",3, 2, [4,5])
		var v1 = compute_render_locations_total(t1); 

		shift(v1, 100, 100);
		var extra_draw_stuff = []

		
		console.log(v1)
		return [t1, v1, extra_draw_stuff]		
	}
	else if (v == 11){
		var t1 = g.generate_and_compile("b",4, 2, [3,4])
		var v1 = compute_render_locations_total(t1); 
		shift(v1, 100, 100);
		var extra_draw_stuff = []		
		
	
		return [t1, v1, extra_draw_stuff]			
		
	}
	else if (v ==12){
		var t1 = g.generate_and_compile("b",5, 2, [3,4])
		var v1 = compute_render_locations_total(t1); 
		shift(v1, 100, 100);
		var extra_draw_stuff = []		
		
	
		return [t1, v1, extra_draw_stuff]			
		
	}
}
export default tutorial;