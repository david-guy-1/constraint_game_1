//canvas stuff

export const canvas_top = 10
export const canvas_left = 160
//dungeon stuff

export const box_width = 80;
export const box_height = 180;
export const right_gap = 150;
export const item_size = 40;
export const tile_height = 150 // does not include "filler" area at bottom
export const canvas_width = 990;
export const canvas_height = 600;

// for monsters, start at [0, item_size] and end at [box_with, tile_height - item_size]

// drawing doors and items 

export const large_draw_start = [5, 5];
export const large_draw_size = [box_width-10, tile_height - 10 - item_size];
export const bottom_image_start = [0, tile_height - item_size-10] 

export const hero_draw_start = [5,5];
export const hero_draw_size = [box_width - 10, tile_height - 10];

// equips page 

export const item_pool_top_left = [453,33];
export const item_pool_size = [441,416];

export const hero_equip_top_left = [28,248];
export const hero_pool_size = [301, 150];

export const exit_top_left = [649, 465];
export const exit_size = [100, 50];

export const legend_top_left =[ 471, 545];
// minimap and infobox

export const minimap_top_left = [1150,450];
export const minimap_size = [200, 150];

export const infobox_top_left = [1150,50];
export const infobox_size = [230, 370];

// buttons at the bottom

export const bottom_buttons_top_left = [200,620];
export const bottom_buttons_size = [50, 50];
export const bottom_buttons_gap = 3;

// buttons at the left

export const left_buttons_top_left = [10, 10];
export const left_buttons_size = [140, 90];
export const left_buttons_gap = 10;


// instructions

export const instructions_top_left = [1170, 620]
export const instructions_size = [100, 40]

export const instructions_back_top_left = [300, 500]
export const instructions_back_size = [100, 50]


export const instructions_left_top_left = [600, 500]
export const instructions_left_size = [100, 50]
export const instructions_right_top_left = [710, 500]
export const instructions_right_size = [100, 50]

// seed

export const seed_top_left = [650, 620]
export const seed_size = [300, 50]

// back button

export const back_top_left = [1170, 670]
export const back_size = [100, 40]

// 10 509

export const color_code_top_left = [10, 509]






export const hero_table = ["./images/heroes/hero.png", "./images/heroes/hero_2.png", "./images/heroes/hero_3.png", "./images/heroes/hero_4.png", "./images/heroes/hero_5.png"];

export const egg_table = ["egg_blue_m1.png","egg_blue_m2.png","egg_blue_m3.png","egg_blue_m4.png","egg_cyan_m1.png","egg_cyan_m2.png","egg_cyan_m3.png","egg_cyan_m4.png","egg_gray3_m1.png","egg_gray3_m2.png","egg_gray3_m3.png","egg_gray3_m4.png","egg_green_m1.png","egg_green_m2.png","egg_green_m3.png","egg_green_m4.png","egg_red_m1.png","egg_red_m2.png","egg_red_m3.png","egg_red_m4.png","egg_yellow_m1.png","egg_yellow_m2.png","egg_yellow_m3.png","egg_yellow_m4.png"]


export const item_table = {
	"blue orb with dagger":"./images/items/orb_blue_dagger.png",
	"blue orb with gem":"./images/items/orb_blue_gem.png",
	"blue orb with flame":"./images/items/orb_blue_flame.png",
	"blue orb with ghost":"./images/items/orb_blue_ghost.png",
	"blue orb with explosion":"./images/items/orb_blue_explosion.png",
	"blue orb with leaf":"./images/items/orb_blue_leaf.png",
	"blue orb with bomb":"./images/items/orb_blue_bomb.png",
	"green orb with dagger":"./images/items/orb_green_dagger.png",
	"green orb with gem":"./images/items/orb_green_gem.png",
	"green orb with flame":"./images/items/orb_green_flame.png",
	"green orb with ghost":"./images/items/orb_green_ghost.png",
	"green orb with explosion":"./images/items/orb_green_explosion.png",
	"green orb with bomb":"./images/items/orb_green_bomb.png",
	"red orb with dagger":"./images/items/orb_red_dagger.png",
	"red orb with gem":"./images/items/orb_red_gem.png",
	"red orb with ghost":"./images/items/orb_red_ghost.png",
	"red orb with leaf":"./images/items/orb_red_leaf.png",
	"red orb with bomb":"./images/items/orb_red_bomb.png",
	"purple orb with dagger":"./images/items/orb_purple_dagger.png",
	"purple orb with gem":"./images/items/orb_purple_gem.png",
	"purple orb with flame":"./images/items/orb_purple_flame.png",
	"purple orb with ghost":"./images/items/orb_purple_ghost.png",
	"purple orb with explosion":"./images/items/orb_purple_explosion.png",
	"purple orb with leaf":"./images/items/orb_purple_leaf.png",
	"purple orb with bomb":"./images/items/orb_purple_bomb.png",
	"cyan orb with dagger":"./images/items/orb_cyan_dagger.png",
	"cyan orb with gem":"./images/items/orb_cyan_gem.png",
	"cyan orb with flame":"./images/items/orb_cyan_flame.png",
	"cyan orb with ghost":"./images/items/orb_cyan_ghost.png",
	"cyan orb with explosion":"./images/items/orb_cyan_explosion.png",
	"cyan orb with leaf":"./images/items/orb_cyan_leaf.png",
	"cyan orb with bomb":"./images/items/orb_cyan_bomb.png",
	"yellow orb with dagger":"./images/items/orb_yellow_dagger.png",
	"yellow orb with gem":"./images/items/orb_yellow_gem.png",
	"yellow orb with flame":"./images/items/orb_yellow_flame.png",
	"yellow orb with ghost":"./images/items/orb_yellow_ghost.png",
	"yellow orb with explosion":"./images/items/orb_yellow_explosion.png",
	"yellow orb with leaf":"./images/items/orb_yellow_leaf.png",
	"yellow orb with bomb":"./images/items/orb_yellow_bomb.png",
	"silver orb with dagger":"./images/items/orb_silver_dagger.png",
	"silver orb with gem":"./images/items/orb_silver_gem.png",
	"silver orb with flame":"./images/items/orb_silver_flame.png",
	"silver orb with ghost":"./images/items/orb_silver_ghost.png",
	"silver orb with explosion":"./images/items/orb_silver_explosion.png",
	"silver orb with leaf":"./images/items/orb_silver_leaf.png",
	"silver orb with bomb":"./images/items/orb_silver_bomb.png",
	"red ring with blue gem":"./images/items/ring_blue_red.png",
	"silver ring with blue gem":"./images/items/ring_blue_silver.png",
	"yellow ring with blue gem":"./images/items/ring_blue_yellow.png",
	"cyan ring with blue gem":"./images/items/ring_blue_cyan.png",
	"red ring with green gem":"./images/items/ring_green_red.png",
	"silver ring with green gem":"./images/items/ring_green_silver.png",
	"yellow ring with green gem":"./images/items/ring_green_yellow.png",
	"cyan ring with green gem":"./images/items/ring_green_cyan.png",
	"silver ring with red gem":"./images/items/ring_red_silver.png",
	"yellow ring with red gem":"./images/items/ring_red_yellow.png",
	"cyan ring with red gem":"./images/items/ring_red_cyan.png",
	"red ring with purple gem":"./images/items/ring_purple_red.png",
	"silver ring with purple gem":"./images/items/ring_purple_silver.png",
	"yellow ring with purple gem":"./images/items/ring_purple_yellow.png",
	"cyan ring with purple gem":"./images/items/ring_purple_cyan.png",
	"red ring with black gem":"./images/items/ring_black_red.png",
	"silver ring with black gem":"./images/items/ring_black_silver.png",
	"yellow ring with black gem":"./images/items/ring_black_yellow.png",
	"cyan ring with black gem":"./images/items/ring_black_cyan.png",
	"red ring with cyan gem":"./images/items/ring_cyan_red.png",
	"silver ring with cyan gem":"./images/items/ring_cyan_silver.png",
	"yellow ring with cyan gem":"./images/items/ring_cyan_yellow.png",
	"blue amulet":"./images/items/amulet_blue.png",
	"green amulet":"./images/items/amulet_green.png",
	"red amulet":"./images/items/amulet_red.png",
	"yellow amulet":"./images/items/amulet_yellow.png",
	"blue star":"./images/items/star_blue.png",
	"green star":"./images/items/star_green.png",
	"red star":"./images/items/star_red.png",
	"yellow star":"./images/items/star_yellow.png",
	"purple star":"./images/items/star_purple.png",
	"silver star":"./images/items/star_silver.png",
	"blue flower":"./images/items/flower_blue.png",
	"green flower":"./images/items/flower_green.png",
	"red flower":"./images/items/flower_red.png",
	"yellow flower":"./images/items/flower_yellow.png",
	"purple flower":"./images/items/flower_purple.png",
	"silver flower":"./images/items/flower_silver.png",
	"blue potion":"./images/items/potion_blue.png",
	"green potion":"./images/items/potion_green.png",
	"red potion":"./images/items/potion_red.png",
	"yellow potion":"./images/items/potion_yellow.png",
	"purple potion":"./images/items/potion_purple.png",
	"silver potion":"./images/items/potion_silver.png",
	"blue coin":"./images/items/coin_blue.png",
	"green coin":"./images/items/coin_green.png",
	"red coin":"./images/items/coin_red.png",
	"yellow coin":"./images/items/coin_yellow.png",
	"purple coin":"./images/items/coin_purple.png",
	"silver coin":"./images/items/coin_silver.png",
	"blue wand":"./images/items/wand_blue.png",
	"green wand":"./images/items/wand_green.png",
	"red wand":"./images/items/wand_red.png",
	"yellow wand":"./images/items/wand_yellow.png",
	"purple wand":"./images/items/wand_purple.png",
	"silver wand":"./images/items/wand_silver.png",
	"blue leaf":"./images/items/leaf_blue.png",
	"green leaf":"./images/items/leaf_green.png",
	"red leaf":"./images/items/leaf_red.png",
	"yellow leaf":"./images/items/leaf_yellow.png",
	"purple leaf":"./images/items/leaf_purple.png",
	"silver leaf":"./images/items/leaf_silver.png",
	"blue gem":"./images/items/gem_blue.png",
	"green gem":"./images/items/gem_green.png",
	"red gem":"./images/items/gem_red.png",
	"yellow gem":"./images/items/gem_yellow.png",
	"purple gem":"./images/items/gem_purple.png",
	"silver gem":"./images/items/gem_silver.png"	
}


export const scroll_table = {
	"scroll_blue fire scroll":"./images/scrolls/scroll_blue_fire.png",
	"scroll_blue leaf scroll":"./images/scrolls/scroll_blue_leaf.png",
	"scroll_blue lightning scroll":"./images/scrolls/scroll_blue_lightning.png",
	"scroll_blue spiral scroll":"./images/scrolls/scroll_blue_spiral.png",
	"scroll_cyan fire scroll":"./images/scrolls/scroll_cyan_fire.png",
	"scroll_cyan leaf scroll":"./images/scrolls/scroll_cyan_leaf.png",
	"scroll_cyan lightning scroll":"./images/scrolls/scroll_cyan_lightning.png",
	"scroll_cyan spiral scroll":"./images/scrolls/scroll_cyan_spiral.png",
	"scroll_cyan water scroll":"./images/scrolls/scroll_cyan_water.png",
	"scroll_gray fire scroll":"./images/scrolls/scroll_gray_fire.png",
	"scroll_gray leaf scroll":"./images/scrolls/scroll_gray_leaf.png",
	"scroll_gray lightning scroll":"./images/scrolls/scroll_gray_lightning.png",
	"scroll_gray spiral scroll":"./images/scrolls/scroll_gray_spiral.png",
	"scroll_gray water scroll":"./images/scrolls/scroll_gray_water.png",
	"scroll_green fire scroll":"./images/scrolls/scroll_green_fire.png",
	"scroll_green lightning scroll":"./images/scrolls/scroll_green_lightning.png",
	"scroll_green spiral scroll":"./images/scrolls/scroll_green_spiral.png",
	"scroll_green water scroll":"./images/scrolls/scroll_green_water.png",
	"scroll_red leaf scroll":"./images/scrolls/scroll_red_leaf.png",
	"scroll_red lightning scroll":"./images/scrolls/scroll_red_lightning.png",
	"scroll_red spiral scroll":"./images/scrolls/scroll_red_spiral.png",
	"scroll_red water scroll":"./images/scrolls/scroll_red_water.png",
	"scroll_yellow fire scroll":"./images/scrolls/scroll_yellow_fire.png",
	"scroll_yellow leaf scroll":"./images/scrolls/scroll_yellow_leaf.png",
	"scroll_yellow spiral scroll":"./images/scrolls/scroll_yellow_spiral.png",
	"scroll_yellow water scroll":"./images/scrolls/scroll_yellow_water.png",
	"scroll_blue apple book":"./images/scrolls/book_blue_apple.png",
	"scroll_blue lemon book":"./images/scrolls/book_blue_lemon.png",
	"scroll_blue tree book":"./images/scrolls/book_blue_tree.png",
	"scroll_blue volcano book":"./images/scrolls/book_blue_volcano.png",
	"scroll_blue sparkle book":"./images/scrolls/book_blue_sparkle.png",
	"scroll_green apple book":"./images/scrolls/book_green_apple.png",
	"scroll_green lemon book":"./images/scrolls/book_green_lemon.png",
	"scroll_green volcano book":"./images/scrolls/book_green_volcano.png",
	"scroll_green sparkle book":"./images/scrolls/book_green_sparkle.png",
	"scroll_red lemon book":"./images/scrolls/book_red_lemon.png",
	"scroll_red tree book":"./images/scrolls/book_red_tree.png",
	"scroll_red sparkle book":"./images/scrolls/book_red_sparkle.png",
	"scroll_yellow apple book":"./images/scrolls/book_yellow_apple.png",
	"scroll_yellow tree book":"./images/scrolls/book_yellow_tree.png",
	"scroll_yellow volcano book":"./images/scrolls/book_yellow_volcano.png",
	"scroll_yellow sparkle book":"./images/scrolls/book_yellow_sparkle.png",
	"scroll_purple apple book":"./images/scrolls/book_purple_apple.png",
	"scroll_purple lemon book":"./images/scrolls/book_purple_lemon.png",
	"scroll_purple tree book":"./images/scrolls/book_purple_tree.png",
	"scroll_purple volcano book":"./images/scrolls/book_purple_volcano.png",
}

export const key_table = {
"lever_blue key":"./images/keys/key_blue_key.png",
"lever_blue magic key":"./images/keys/key_blue_magic key.png",
"lever_blue spiked key":"./images/keys/key_blue_spiked key.png",
"lever_blue triangle key":"./images/keys/key_blue_triangle key.png",
"lever_blue orbed key":"./images/keys/key_blue_orbed key.png",
"lever_blue curvy key":"./images/keys/key_blue_curvy key.png",
"lever_green key":"./images/keys/key_green_key.png",
"lever_green magic key":"./images/keys/key_green_magic key.png",
"lever_green spiked key":"./images/keys/key_green_spiked key.png",
"lever_green triangle key":"./images/keys/key_green_triangle key.png",
"lever_green orbed key":"./images/keys/key_green_orbed key.png",
"lever_green curvy key":"./images/keys/key_green_curvy key.png",
"lever_red key":"./images/keys/key_red_key.png",
"lever_red magic key":"./images/keys/key_red_magic key.png",
"lever_red spiked key":"./images/keys/key_red_spiked key.png",
"lever_red triangle key":"./images/keys/key_red_triangle key.png",
"lever_red orbed key":"./images/keys/key_red_orbed key.png",
"lever_red curvy key":"./images/keys/key_red_curvy key.png",
"lever_purple key":"./images/keys/key_purple_key.png",
"lever_purple magic key":"./images/keys/key_purple_magic key.png",
"lever_purple spiked key":"./images/keys/key_purple_spiked key.png",
"lever_purple triangle key":"./images/keys/key_purple_triangle key.png",
"lever_purple orbed key":"./images/keys/key_purple_orbed key.png",
"lever_purple curvy key":"./images/keys/key_purple_curvy key.png",
"lever_cyan key":"./images/keys/key_cyan_key.png",
"lever_cyan magic key":"./images/keys/key_cyan_magic key.png",
"lever_cyan spiked key":"./images/keys/key_cyan_spiked key.png",
"lever_cyan triangle key":"./images/keys/key_cyan_triangle key.png",
"lever_cyan orbed key":"./images/keys/key_cyan_orbed key.png",
"lever_cyan curvy key":"./images/keys/key_cyan_curvy key.png",
"lever_yellow key":"./images/keys/key_yellow_key.png",
"lever_yellow magic key":"./images/keys/key_yellow_magic key.png",
"lever_yellow spiked key":"./images/keys/key_yellow_spiked key.png",
"lever_yellow triangle key":"./images/keys/key_yellow_triangle key.png",
"lever_yellow orbed key":"./images/keys/key_yellow_orbed key.png",
"lever_yellow curvy key":"./images/keys/key_yellow_curvy key.png",
"lever_silver key":"./images/keys/key_silver_key.png",
"lever_silver magic key":"./images/keys/key_silver_magic key.png",
"lever_silver spiked key":"./images/keys/key_silver_spiked key.png",
"lever_silver triangle key":"./images/keys/key_silver_triangle key.png",
"lever_silver orbed key":"./images/keys/key_silver_orbed key.png",
"lever_silver curvy key":"./images/keys/key_silver_curvy key.png",
}

export var monster_table = {"blue goblin":"./images/monsters/goblin_blue.png","green goblin":"./images/monsters/goblin_green.png","red goblin":"./images/monsters/goblin_red.png","yellow goblin":"./images/monsters/goblin_yellow.png","blue fairy":"./images/monsters/fairy_blue.png","green fairy":"./images/monsters/fairy_green.png","red fairy":"./images/monsters/fairy_red.png","yellow fairy":"./images/monsters/fairy_yellow.png","purple fairy":"./images/monsters/fairy_purple.png","white fairy":"./images/monsters/fairy_white.png","blue wraith":"./images/monsters/wraith_blue.png","green wraith":"./images/monsters/wraith_green.png","red wraith":"./images/monsters/wraith_red.png","yellow wraith":"./images/monsters/wraith_yellow.png","purple wraith":"./images/monsters/wraith_purple.png","blue magic sword":"./images/monsters/magic_sword_blue.png","green magic sword":"./images/monsters/magic_sword_green.png","red magic sword":"./images/monsters/magic_sword_red.png","yellow magic sword":"./images/monsters/magic_sword_yellow.png","purple magic sword":"./images/monsters/magic_sword_purple.png","white magic sword":"./images/monsters/magic_sword_white.png","blue chicken":"./images/monsters/chicken_blue.png","green chicken":"./images/monsters/chicken_green.png","yellow chicken":"./images/monsters/chicken_yellow.png","purple chicken":"./images/monsters/chicken_purple.png","white chicken":"./images/monsters/chicken_white.png","blue blob":"./images/monsters/blob_blue.png","green blob":"./images/monsters/blob_green.png","yellow blob":"./images/monsters/blob_yellow.png","purple blob":"./images/monsters/blob_purple.png","white blob":"./images/monsters/blob_white.png","red blob":"./images/monsters/blob_red.png","blue living armor":"./images/monsters/living_armor_blue.png","green living armor":"./images/monsters/living_armor_green.png","red living armor":"./images/monsters/living_armor_red.png","yellow living armor":"./images/monsters/living_armor_yellow.png","white living armor":"./images/monsters/living_armor_white.png","purple living armor":"./images/monsters/living_armor_purple.png","blue wisp":"./images/monsters/wisp_blue.png","green wisp":"./images/monsters/wisp_green.png","red wisp":"./images/monsters/wisp_red.png","yellow wisp":"./images/monsters/wisp_yellow.png","white wisp":"./images/monsters/wisp_white.png","purple wisp":"./images/monsters/wisp_purple.png","blue dragon":"./images/monsters/dragon_blue.png","green dragon":"./images/monsters/dragon_green.png","red dragon":"./images/monsters/dragon_red.png","yellow dragon":"./images/monsters/dragon_yellow.png","white dragon":"./images/monsters/dragon_white.png","purple dragon":"./images/monsters/dragon_purple.png","blue insect":"./images/monsters/insect_blue.png","green insect":"./images/monsters/insect_green.png","red insect":"./images/monsters/insect_red.png","yellow insect":"./images/monsters/insect_yellow.png","white insect":"./images/monsters/insect_white.png","purple insect":"./images/monsters/insect_purple.png","blue tree":"./images/monsters/tree_blue.png","green tree":"./images/monsters/tree_green.png","red tree":"./images/monsters/tree_red.png","yellow tree":"./images/monsters/tree_yellow.png","white tree":"./images/monsters/tree_white.png","purple tree":"./images/monsters/tree_purple.png"}