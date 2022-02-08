const _ = require("lodash");

class dungeon{
	constructor(name, stuff, next){
		this.name = name; // names must be unique!
		this.stuff = stuff; // list of (monster, item, locked door, lever, scroll, "nothing")
		// locked doors and levers are coded as strings, beginning with "door_" or "lever_"
		// scrolls are also coded as strings, beginning with "scroll_" 
		if(stuff[0] != "nothing"){
			throw new Error("dungeon must start with nothing");
		}
		this.next = next; // (list (ordered) of dungeon nodes names (as strings) ), or "exit"
	}
	
}
export default dungeon;
