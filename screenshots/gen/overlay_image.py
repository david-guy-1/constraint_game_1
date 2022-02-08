import cv2
import os
import random
import numpy as np
base = cv2.imread("a.png", cv2.IMREAD_UNCHANGED)
path = "D:/Desktop/games/constraint game 1/src/display/images/items"
for i in range(75):
    image = random.choice(os.listdir(path))
    item= cv2.imread(path + "/" + image, cv2.IMREAD_UNCHANGED)
    x = random.randint(0, 430)
    y = random.randint(120, 450)
    #shape = y, x, 4
    s = item.shape
    thing = np.ones([s[0], s[1],1])
    thing = 255*thing - np.reshape(item[:,:,3],[item.shape[0], item.shape[1],1])
    thing = thing / 255
    #thing = 1 - item's transparency
    baseAlpha = np.reshape(item[:,:,3] / 255, [s[0], s[1], 1])
    #baseAlpha = item's transparency
    #want : part * thing + item * baseAlpha
    for index in [0,1,2]:
        part = np.reshape(base[y:y+s[0],x:x+s[1],index], [s[0], s[1], 1])
        #thing = np.ones([s[0], s[1],1])
        #baseAlpha = np.zeros([s[0], s[1],1])

        res = np.multiply(part, thing) + np.multiply(np.reshape(item[:,:,index] ,[s[0], s[1], 1]), baseAlpha)
        base[y:y+s[0],x:x+s[1],index] = res[:,:,0]

path = "D:/Desktop/games/constraint game 1/src/display/images/monsters"
cv2.imwrite("out.png",base)
cv2.imwrite("out2.png",baseAlpha)
