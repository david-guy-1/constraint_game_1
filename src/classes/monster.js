const _ = require("lodash");

class monster{
	constructor(name, weaknesses, drops, is_egg = false){
		this.name = name; // string
		this.weaknesses = weaknesses; // list of strings, indicating what the weaknesses are. they can be item names, item types, or scroll names. got it?
		this.drops = drops; // items or levers or scrolls (scrolls are coded as strings, starting with "scroll_")
		for(var drop of drops){
			if(typeof(drop) == "string" && drop.substr(0, 6) != "lever_" && drop.substr(0, 7) != "scroll_"){
				throw new Error("monster drop must be lever or scroll or item : " + drop);
			}
		}
		this.is_egg = is_egg;// boolean
	}
	 should_die(item){
		// if names are the same, then yes
		// otherwise, check if types intersect.
		if(this.weaknesses.indexOf(item.name) != -1){
			return true
		} else if(_.intersection(this.weaknesses, item.types).length != 0){
			return true;
		}
		return false;
	}
	 should_die_scroll(scroll_name){
		if(this.weaknesses.indexOf(scroll_name) != -1){
			return true
		}
		return false
	}
	
}
export default monster;
