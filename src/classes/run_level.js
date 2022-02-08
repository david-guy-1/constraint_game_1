
import monster from "./monster.js";
import item from "./item.js";
import dungeon from "./dungeon.js";
import level from "./level.js";
import solution from "./solution.js";
const _ = require("lodash");

//naming conventions:
// monsters are in a class
// items are in a class
// doors and levers are strings, beginning with "door_" or "lever_" respectively
// scrolls are strings, beginning with "scroll_" 
// display will ignore these. 
class run_level{
	constructor(level, solution){
		this.level = level;
		this.solution = solution;
		this.r = Math.random();
		// that every non-exit has a next, and that it's valid
		for (var dungeon of level.dungeons){
			if(dungeon.next != "exit"){
				var way = solution.directions[dungeon.name]
				if(typeof(way) != "number" ||  way >= dungeon.next.length || way < 0){
					throw new Error("next step at " + dungeon.name + " is invalid");
				}
			}
		}
		// that every egg has an indication :
		for (var dungeon of level.dungeons){
			for(var i=0; i<dungeon.stuff.length; i++){
				var tile = dungeon.stuff[i]
				if(tile instanceof monster && tile.is_egg && solution.hatches[dungeon.name + " " + i] == undefined){
					throw new Error("solution doesn't specify egg at " + dungeon.name + " " + i)
				}
			}
		}
		//end of error checking
		
		this.scrolls = new Set();
		this.opened_doors = new Set();
		this.exited = {}
		// for every hero (indexed by name of starting dungeon), record their location and list of items (as item instances, NOT just names)
		this.items = {};
		this.locations = {};
		this.location_index = {};
		for (var hero of this.level.starts){
			this.locations[hero] = hero;
			this.location_index[hero] = 0;
			// items
			this.items[hero] = new Set();
			for(var i=0; i<level.item_pool.length; i++){
				if(solution.starting_items[i] == hero){
					this.items[hero].add(level.item_pool[i])
				}
			}
			this.exited[hero] = false;
		}
		
	}
	// define the following functions: next location , can move, do move
	//first two should not mutate, last one should.
	
	next_location(name){ // name of hero (= name of starting location)
	// output : either a pair (name of dungeon ,location) or "exit"
		if(this.exited[name] == true){
			throw new Error("next location on exited hero")
		}
		var curr_dungeon_name = this.locations[name]
		var curr_dungeon_index = this.location_index[name]
		var curr_dungeon =  this.level.dungeon_table[curr_dungeon_name]
		if(curr_dungeon.stuff.length > curr_dungeon_index + 1){
			// not at the end
			return [curr_dungeon_name, curr_dungeon_index+1]
		} else if (curr_dungeon.next == "exit"){
			// at the end
			return "exit"
		} else {
			// next dungeon
			return [curr_dungeon.next[this.solution.directions[curr_dungeon.name]], 0]
		}
	}
	 can_move(name){
		var result = this.next_location(name);
		if(result == "exit"){
			return true;
		}
		// get the item there
		var item_there =  this.level.dungeon_table[result[0]].stuff[result[1]];
		if(item_there instanceof monster){
			// unhatched egg
			if(item_there.is_egg && !this.solution.hatches[result[0] + " " + result[1]]){
				return true;
			} else { // check if we can fight the monster
				for(var item of this.items[name]){
					if(item_there.should_die(item)){
						return true;
					}
				}
				for(var scroll of this.scrolls){
					if(item_there.should_die_scroll(scroll)){
						return true;
					}
				}
			}
			return false;
		} else if (typeof(item_there ) == "string"){
			if(item_there.substr(0, 5) == "door_"){
				return this.opened_doors.has(item_there)
			}
		}
		return true;
	}
	 do_move(name, check=true){ // check = check if we can move before doing the move.
		// returns whether or not we can move
		if(check && ! this.can_move(name)){
			return false;
		}
		var result = this.next_location(name);
		if(result == "exit"){
			this.exited[name] = true;
			return true;
		}
		this.locations[name] = result[0];
		this.location_index[name]  = result[1];
		// get the item there
		var item_there =   this.level.dungeon_table[result[0]].stuff[result[1]];
		var add_list = [];
		// list of things collected with this move
		// if it's a monster , and it's either not an egg or we hatch it
		if(item_there instanceof monster && (item_there.is_egg == false  || this.solution.hatches[result[0] + " " + result[1]] == true)){
			add_list = add_list.concat(item_there.drops)
		}
		if(item_there instanceof item){
			add_list.push(item_there);
		}
		if(typeof(item_there) == "string" && item_there != "nothing"){
			add_list.push(item_there);
		}
		for(var drop of add_list){
				if(drop instanceof item){
					this.items[name].add(drop)
				}
				else if(typeof(drop) == "string"){
					if(drop.substr(0, 7) == "scroll_"){
						this.scrolls.add(drop);
					}
					if(drop.substr(0, 5) == "lever"){
						this.opened_doors.add("door_" + drop.substr(6))
					}
				}
		}
		return true;
	}
	step(){
		// returns if any of them stepped
		var anyMoved = false;
		for(var hero of this.level.starts){
			if(! this.exited[hero]){
				var result = this.do_move(hero, true); 
				if(result){
					anyMoved = true;
				}
			}
		}
		return anyMoved;
	}
	completed(){
		for(var hero of this.level.starts){
			if(! this.exited[hero]){
				return false;
			}
		}
		return true;
	}
}

export default run_level;