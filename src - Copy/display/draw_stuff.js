
import * as d from "./canvasDrawing.js";
import monster from "../classes/monster.js";
import item from "../classes/item.js";
import * as c from "./display_constants.js";
import * as r from "../classes/random.js";


	// draw a specific dungeon square at posx and posy
	// dungeon : a dungeon instance, square : a number(index), posx and posy : location to draw at (top left corner)

export function monster_image(monster){ // monster instance, includes eggs!
	if(monster.is_egg){
		return "./images/eggs/"+r.choice(c.egg_table, monster.name);
	} else {
		return c.monster_table[monster.name];
	}
}

export function item_image(item){ // item instance
	if(c.item_table[item.name] != undefined){
		return c.item_table[item.name]
	}
	return "./item.png";
}

export function monster_weakness_image(weakness){ // string
	////console.log(weakness);
	if(c.item_table[weakness] != undefined){
		return c.item_table[weakness]
	}
	if(c.scroll_table[ weakness] != undefined){
		return c.scroll_table[weakness]
	}
	
	return "./item_wn.png";
}
// door, lever, scroll, hero INCLUDES the prefixes
export function hero_image(hero, table){ // string
	//console.log(hero)
	//console.log(table);
	return table[ hero.slice(5)];
}

export function scroll_image(scroll){ // string
	if(c.scroll_table[scroll] != undefined){
		return c.scroll_table[scroll]
	}
	////console.log(scroll)
	////console.log("warning: scroll image not found")
	return "./scroll.png";
}

export function lever_image(lever){ // string
	if(c.key_table[lever] != undefined){
		return c.key_table[lever]
	}
	////console.log(lever)
	////console.log("warning: lever image not found")
	return "./lever.png";
}


export function door_image(door){ // string
// remember: doors DO NOT have names, but MUST be consistent.
	
	return "./images/doors/" + r.choice(["door_1.png","door_10.png","door_11.png","door_12.png","door_13.png","door_14.png","door_15.png","door_16.png","door_17.png","door_18.png","door_19.png","door_2.png","door_20.png","door_21.png","door_3.png","door_4.png","door_5.png","door_6.png","door_7.png","door_8.png","door_9.png"], door)
}

export function draw_faded_circle(ctx, posx, posy, width, height ,color){
	ctx.beginPath();
	ctx.fillStyle=color
	ctx.ellipse(posx, posy, width, height,0, 0, 2 * Math.PI);
	ctx.fill();
}


export function draw_tile(ctx,posx, posy, thing="nothing", hero_map){
		// draw a single dungeon tile (along with the thing)
		// thing is the same as dungeon's stuff (the things in the dungeon's list).
		/*
		color code (these are borders)
		item : -
		scroll : red
		key : blue
		monster : yellow
		monster egg : green
		door : purple
		 
		 
		 monster size 60,60
		 hero size 70 140

		*/
		var colors = {
			scroll : "red",
			key : "blue",
			monster : "yellow",
			monster_egg : "green",
			door : "purple",
		}
		var lds = c.large_draw_start;
		var lds2 = c.large_draw_size;
		var bis = c.bottom_image_start;
		var hds = c.hero_draw_start;
		var hds2 = c.hero_draw_size;
		var rectangle_width = 1;
		if(thing != "nothing"){
			if(thing instanceof monster){
				//draw a monster
				d.drawImageStr(ctx,monster_image(thing), posx+10, posy+c.item_size+5,c.box_width-20 , c.tile_height - 2*c.item_size-10 );
				if(thing.is_egg){
					//console.log("monster size " + [c.box_width-20 , c.tile_height - 2*c.item_size-10])
					d.drawRectangle2(ctx, posx+10, posy+c.item_size+5,c.box_width-20 , c.tile_height - 2*c.item_size-10, colors.monster_egg, rectangle_width)
					
				} else {
					d.drawRectangle2(ctx, posx+10, posy+c.item_size+5,c.box_width-20 , c.tile_height - 2*c.item_size-10, colors.monster, rectangle_width)
					
				}
				// draw the weaknesses above the monster
				thing.weaknesses.forEach(function(weakness, index){
					d.drawImageStr(ctx,monster_weakness_image(weakness), posx + c.item_size*index, posy, c.item_size, c.item_size)
					// and the border if it's a scroll
					if(typeof(weakness) == "string" && weakness.indexOf("scroll_") != -1){
						d.drawRectangle2(ctx, posx + c.item_size*index, posy, c.item_size, c.item_size, colors.scroll, rectangle_width)
					} 
				})
				// draw the drops 
				var bottom_drop_start =c.tile_height - c.item_size;
				thing.drops.forEach(function(drop, index){
					if(drop instanceof item){
						d.drawImageStr(ctx,item_image(drop), posx + c.item_size*index, posy+bottom_drop_start, c.item_size, c.item_size)
					} else if (drop.substr(0, 7) == "scroll_"){
						d.drawImageStr(ctx,scroll_image(drop), posx + c.item_size*index, posy+bottom_drop_start, c.item_size, c.item_size)
						d.drawRectangle2(ctx, posx + c.item_size*index, posy+bottom_drop_start, c.item_size, c.item_size, colors["scroll"], rectangle_width)
					}else if (drop.substr(0, 6) == "lever_"){
						d.drawImageStr(ctx,lever_image(drop), posx + c.item_size*index, posy+bottom_drop_start, c.item_size, c.item_size)
						d.drawRectangle2(ctx, posx + c.item_size*index, posy+bottom_drop_start, c.item_size, c.item_size, colors["key"], rectangle_width)

					}
					
				})
				
			} else if(thing instanceof item){
				
				d.drawImageStr(ctx, item_image(thing), posx+lds[0], posy+lds[1], c.item_size, c.item_size);
			}
			else if(thing.substr(0, 5) == "door_"){
				// draw the item, 100x100, start at x=10, y=50
				d.drawImageStr(ctx, door_image(thing),posx+lds[0], posy+lds[1], lds2[0], lds2[0]);
				d.drawRectangle2(ctx,posx+lds[0], posy+lds[1], lds2[0], lds2[0], colors["door"], rectangle_width)
				// replace door_ with lever_ , and draw the corresponding image
				var leverName = thing.replace("door_", "lever_")
				////console.log("got here" + lever_image(leverName))
				d.drawImageStr(ctx, lever_image(leverName), posx+bis[0]+c.item_size/2, posy+bis[1], c.item_size, c.item_size)
				d.drawRectangle2(ctx,posx+bis[0]+c.item_size/2, posy+bis[1], c.item_size, c.item_size,colors["key"], rectangle_width)
				////console.log("A")
			}
			else if(thing.substr(0, 6) == "lever_"){
				// draw the item, normal size
				d.drawImageStr(ctx, lever_image(thing), posx+c.box_width/2 - c.item_size/2, posy+c.tile_height/2 - c.item_size/2, c.item_size, c.item_size);
				d.drawRectangle2(ctx, posx+c.box_width/2 - c.item_size/2, posy+c.tile_height/2 - c.item_size/2, c.item_size, c.item_size,colors["key"], rectangle_width)
			}
			else if(thing.substr(0, 7) == "scroll_"){
				// draw the item, normal size
				d.drawImageStr(ctx, scroll_image(thing), posx+c.item_size/2, posy+c.tile_height/2 - c.item_size/2, c.item_size, c.item_size);
				d.drawRectangle2(ctx,posx+c.item_size/2, posy+c.tile_height/2 - c.item_size/2, c.item_size, c.item_size,colors["scroll"], rectangle_width)
			}
			else if(thing.substr(0, 5) == "hero_"){
				// draw the item, 100x100, start at x=10, y=50
				//console.log("hero size " + hds2[0], hds2[1])
				d.drawImageStr(ctx, hero_image(thing, hero_map), posx+hds[0], posy+hds[1], hds2[0], hds2[1]);
			} else{ 
				throw new Error("invalid input to draw_tile: " + thing)
			}
			// 10, 50
			
		}
		
}

export function draw_grid(ctx, images, width, height, start_x, start_y, grid_width, grid_height = undefined){
	//draw items in a grid
	// images = list of strings
	//width and height : width and height of each image.
	var cursor_x = start_x;
	var cursor_y = start_y;
	var i=0;
	while(i < images.length){
		// draw the image
		d.drawImageStr(ctx, images[i], cursor_x, cursor_y);
		cursor_x += width;
		
		if(cursor_x + width >start_x + grid_width){
			cursor_x = start_x;
			cursor_y += height;
			if(grid_height != undefined && cursor_y + height > grid_height){
				break; // filled the screen already
			}
		}
		i+=1;		
	}
	
}
export function draw_equips(ctx, hero, item_pool, statuses, current_item=undefined, hero_map){
	
	//hero : string , item_pool : item instances, statuses : either the name of a hero, or "open", current_item : item instance or undefined
	// draw the hero
	d.drawImageStr(ctx, hero_image("hero_" + hero, hero_map), 20, 12);
	
	// we need our own custom-made function to draw the images in item pool since draw_grid won't work for us
	//draw the item pool
	var cursor_x = c.item_pool_top_left[0]
	var cursor_y = c.item_pool_top_left[1]
	var hero_equipped = [];
	for(var i=0; i<item_pool.length ; i++){
		var item = item_pool[i];
		var this_status = statuses[i];

		if(this_status != "open"){
			ctx.globalAlpha = 0.4
		}
		d.drawImageStr(ctx, item_image(item), cursor_x, cursor_y);
		ctx.globalAlpha = 1;
		if(this_status != "open"){
			if(this_status == hero){
				d.drawText(ctx, "E" , cursor_x + 10, cursor_y +30, undefined, "green", c.item_size/1.3) 
				hero_equipped.push(item)
			} else{
				d.drawText(ctx, "E" , cursor_x + 10, cursor_y +30, undefined, "red", c.item_size/1.3)
			}
		}

		cursor_x += c.item_size;
		
		if(cursor_x + c.item_size >c.item_pool_top_left[0]+c.item_pool_size[0]){ // pool start x + pool width
			cursor_x = c.item_pool_top_left[0];
			cursor_y += c.item_size;
			if(cursor_y + c.item_size > c.item_pool_size[1]){ // pool height
				break; // filled the screen already
			}
		}
	}
	// draw equipped items
	////console.log(hero_equipped)
	draw_grid(ctx,hero_equipped.map((x) => item_image(x)), c.item_size, c.item_size, c.hero_equip_top_left[0], c.hero_equip_top_left[1], c.hero_pool_size[0]);
	// draw item description
	if(current_item != undefined){
		d.drawImageStr(ctx, item_image(current_item), 51, 451)
		
		d.drawText(ctx, current_item.name, 141, 458, undefined,"white" );
		var index = item_pool.indexOf(current_item);
		var h = statuses[index];
		if(h != "open" && h != hero){
			d.drawText(ctx, "equipped by", 125, 520, undefined,"white");
			d.drawImageStr(ctx, hero_image("hero_" + h, hero_map), 255, 450);
		}
		
	}
}	
