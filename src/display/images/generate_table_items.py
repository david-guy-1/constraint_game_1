names = """scroll_blue_fire.png
scroll_blue_leaf.png
scroll_blue_lightning.png
scroll_blue_spiral.png
scroll_cyan_fire.png
scroll_cyan_leaf.png
scroll_cyan_lightning.png
scroll_cyan_spiral.png
scroll_cyan_water.png
scroll_gray_fire.png
scroll_gray_leaf.png
scroll_gray_lightning.png
scroll_gray_spiral.png
scroll_gray_water.png
scroll_green_fire.png
scroll_green_lightning.png
scroll_green_spiral.png
scroll_green_water.png
scroll_red_leaf.png
scroll_red_lightning.png
scroll_red_spiral.png
scroll_red_water.png
scroll_yellow_fire.png
scroll_yellow_leaf.png
scroll_yellow_spiral.png
scroll_yellow_water.png""".splitlines()

#item table
for name in names:
    x = name.split(".")[0].split("_")
    color = x[1]
    type_ =x[2]
    print(f'"scroll_{color} {type_} scroll":"./images/scrolls/scroll_{color}_{type_}.png",')
    
