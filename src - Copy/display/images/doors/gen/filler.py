from base import *
i=1
door = cv2.imread("door.png", cv2.IMREAD_UNCHANGED)
filler = cv2.imread("door2.png", cv2.IMREAD_UNCHANGED)
for color in ["blue","green","red","yellow","gray3","cyan", "purple"]:
    for pair in [["door.png", "door_filler.png"], ["door2.png", "door2_filler.png"], ["door3.png", "door3_filler.png"]]:
        door = cv2.imread(pair[0], cv2.IMREAD_UNCHANGED)
        filler = cv2.imread(pair[1], cv2.IMREAD_UNCHANGED)
        filler = toColorBrightness(filler, colors[color][0],colors[color][1],colors[color][2])
        #add door and filler
        addTransparent(door, filler)
        cv2.imwrite("./output/door_"+str(i)+".png",door)
        i+=1
