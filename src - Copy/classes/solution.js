class solution{
	constructor(starting_items, hatches, directions){
		// starting items: list : item index (from level's list) -> name of starting dungeon, or undefined
		// hatches : hash table : name of dungeon + " " + dungeon index -> boolean , indicating whether or not to hatch this egg.
		// directions: hash table : name of dungeon (next not exit) -> integer ,indicating which dungeon to go to next (index in dungeon.exit)
		this.starting_items = starting_items;
		this.hatches = hatches;
		this.directions = directions;
	}
	// get the index of the ith (start counting from 0) item equipped by given hero, or undefined if hero equips < i items.
	get_ith_equip(hero, index){
		if(hero == undefined || index == undefined){
			throw new Error("ith equip with undefined input");
		}
		var counter = -1;
		for(var i=0; i<this.starting_items.length; i++){
			if(this.starting_items[i] == hero){
				counter ++;
				if(counter == index){
					return i;
				}					
			}
		}
	}
}
export default solution;
