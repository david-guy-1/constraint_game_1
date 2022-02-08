//these functions should mutate solution based on the clicked thing....


//passes only CHANGES back to renderer.  Handles mutating solution

// posx and posy are relative to top left of the dungeon
// "dungeon" is the instance (not just the name)

import * as c from "../display/display_constants.js";

export function click_dungeon(level, solution, dungeon, tile, posx, posy){
	// level, solution , dungeon are INSTANCES
	// tile = nth tile of the dungeon is clicked.
	
	//toggle egg
	// returns object indicating changes
	
	var out = { changed_hatch : false,
		changed_path : false,
		to_hero : undefined,
	}
	
	if(dungeon.stuff[tile].is_egg != undefined){
		solution.hatches[dungeon.name + " " + tile] =!solution.hatches[dungeon.name + " " + tile]
		out.changed_hatch = true;
	}		
	//first in the dungeon:
	// in the solution , ALL predecessors should go to this.
	if(tile == 0){
		var before = level.dag.get_vertex_by_name(dungeon.name).prev;
		for(var vertex_ of before){
			var nexts = level.dungeon_table[vertex_.name].next;
			var index = nexts.indexOf(dungeon.name)
			solution.directions[vertex_.name] = index
		}
		out.changed_path = true;
	}
	// last in the dungeon
	if(tile == dungeon.stuff.length - 1){
		var lengthOf = dungeon.next.length;
		solution.directions[dungeon.name] += 1;
		if(solution.directions[dungeon.name] == lengthOf){
			solution.directions[dungeon.name] = 0;
		}
		out.changed_path = true;
	}
	if(tile == 0 && level.starts.indexOf(dungeon.name) != -1){
		out.to_hero = dungeon.name;
	}
	return out;
}

// get which "index" in the grid is (x, y) in 
function click_index(box_width, box_height, window_width, x, y){
	var x_size = Math.floor(x / box_width);
	var y_size = Math.floor(y / box_height);
	var window_size = Math.floor(window_width / box_width);
	return y_size * window_size + x_size;
}

export function click_item(level, solution, hero, posx, posy){
	// clicked at the item pool
	if(posx >= c.item_pool_top_left[0] && posx <= c.item_pool_top_left[0] + c.item_pool_size[0] && posy >= c.item_pool_top_left[1] && posy <= c.item_pool_top_left[0] + c.item_pool_size[1]){
		var index = click_index(c.item_size, c.item_size, c.item_pool_size[0], posx - c.item_pool_top_left[0], posy - c.item_pool_top_left[1]);
		// equip it for the hero, 
		// unequip if it's already equipped
		if(index < solution.starting_items.length){
			if(solution.starting_items[index] == hero){
				solution.starting_items[index] = undefined
			} else {
				solution.starting_items[index] = hero;
			}
		}
	}
	
	
	if(posx >= c.hero_equip_top_left[0] && posx <= c.hero_equip_top_left[0] + c.hero_pool_size[0] && posy >= c.hero_equip_top_left[1] && posy <= c.hero_equip_top_left[1] + c.hero_pool_size[1]){
		var index = click_index(c.item_size, c.item_size, c.hero_pool_size[0], posx - c.hero_equip_top_left[0], posy - c.hero_equip_top_left[1]);	
		var equip_index = solution.get_ith_equip(hero, index);
		if(equip_index != undefined){
			solution.starting_items[equip_index] = undefined;
		}
	}
	console.log("click item over");
}