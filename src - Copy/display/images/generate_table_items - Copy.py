names = """key_blue_key.png
key_blue_magic key.png
key_blue_spiked key.png
key_blue_triangle key.png
key_cyan_key.png
key_cyan_magic key.png
key_cyan_spiked key.png
key_cyan_triangle key.png
key_green_key.png
key_green_magic key.png
key_green_spiked key.png
key_green_triangle key.png
key_purple_key.png
key_purple_magic key.png
key_purple_spiked key.png
key_purple_triangle key.png
key_red_key.png
key_red_magic key.png
key_red_spiked key.png
key_red_triangle key.png
key_silver_key.png
key_silver_magic key.png
key_silver_spiked key.png
key_silver_triangle key.png
key_yellow_key.png
key_yellow_magic key.png
key_yellow_spiked key.png
key_yellow_triangle key.png""".splitlines()

#item table
for name in names:
    x = name.split(".")[0].split("_")
    color = x[1]
    type = x[2]
    print(f'"{color} {type} book":new item("{color} {type} book",["{color}","{type}"]),')
print("")
#display
for name in names:
    x = name.split(".")[0].split("_")
    color = x[1]
    type = x[2]
    print(f'"{color} {type} book":"./images/items/book_{color}_{type}.png",')
