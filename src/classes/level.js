import dag from "./dag.js";
import dungeon from "./dungeon.js";
import solution from "./solution.js";
import monster from "./monster.js";
import item from "./item.js";
class level{
	constructor(dungeons, starts, item_pool){ // dungeons = set of dungeons, starts = list of  of starts (as strings, ordered), item_pool = list of items (ordered)
		this.dungeons = new Set(dungeons);
		this.starts = Array.from(starts);
		this.dungeon_table = {}; // so we can get dungeon by name
		this.dag = new dag([],[])
		this.item_pool = item_pool;
		for(var x of item_pool){
			if(!x instanceof item){
				throw Error(x + " is not an item");
			}
		}
		for(var dungeon of dungeons){
			if(this.dungeon_table[dungeon.name] != undefined){
				throw new Error("name of dungeon not unique : " + dungeon.name);
			}
			this.dungeon_table[dungeon.name] = dungeon;
			this.dag.add_vertex(dungeon.name);
		}
		//add edges to the dag. this automatically checks for cycles
		for(var dungeon of dungeons){
			if(dungeon.next != "exit"){
				for(var succ of dungeon.next){
					this.dag.add_edge(dungeon.name, succ);
				}
			}
		}
	}
	make_standard_solution(){
		var starting_items = []
		var hatches = {};
		var directions = {};
		for(var item of this.item_pool){
			starting_items.push(undefined)
		}
		
		for(var dungeon of this.dungeons){
			if(dungeon.next != "exit"){
				directions[dungeon.name] = 0
			}
			for(var i=0; i<dungeon.stuff.length; i++){
				var thing = dungeon.stuff[i];
				if(thing instanceof monster && thing.is_egg){
					hatches[dungeon.name + " " + i] = false;
				}
			}
		}
		return new solution(starting_items, hatches, directions);
	}
	// given a dungeon name, get the root of the tree it's in
	get_start(name){
		var v = this.dag.get_vertex_by_name(name);
		while(v.prev.size != 0){
			v = Array.from(v.prev)[0];
		}
		return v.name
	}
	
}
export default level;
