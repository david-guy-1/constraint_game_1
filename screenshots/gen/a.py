import cv2
import os
import random
import numpy as np
base = cv2.imread("a.png", cv2.IMREAD_UNCHANGED)
path = "D:/Desktop/games/constraint game 1/src/display/images/items"

#im1 = background, im2 = foreground
def overlay_image(im1, im2, x, y):
    s = im2.shape
    thing = np.ones([s[0], s[1],1])
    thing = 255*thing - np.reshape(im2[:,:,3],[im2.shape[0], im2.shape[1],1])
    thing = thing / 255
    #thing = 1 - item's transparency
    baseAlpha = np.reshape(im2[:,:,3] / 255, [s[0], s[1], 1])
    #baseAlpha = item's transparency

    #get the part of the image that will be placed on
    for index in [0,1,2]:
        part = np.reshape(im1[y:y+s[0],x:x+s[1],index], [s[0], s[1], 1])
        res = np.multiply(part, thing) + np.multiply(np.reshape(im2[:,:,index] ,[s[0], s[1], 1]), baseAlpha)
        im1[y:y+s[0],x:x+s[1],index] = res[:,:,0]
    
for i in range(75):
    image = random.choice(os.listdir(path))
    item= cv2.imread(path + "/" + image, cv2.IMREAD_UNCHANGED)
    x = random.randint(0, 430)
    y = random.randint(120, 450)
    for index in [0,1,2]:
        overlay_image(base, item, x, y)

path = "D:/Desktop/games/constraint game 1/src/display/images/monsters"
for i in range(20):
    image = random.choice(os.listdir(path))
    item= cv2.imread(path + "/" + image, cv2.IMREAD_UNCHANGED)
    x = random.randint(430, 549)
    y = random.randint(0, 419)
    for index in [0,1,2]:
        overlay_image(base, item, x, y)

path = "D:/Desktop/games/constraint game 1/src/display/images/doors"
for i in range(5):
    image = "gen"
    while(image == "gen"):
        image = random.choice(os.listdir(path))
    item= cv2.imread(path + "/" + image, cv2.IMREAD_UNCHANGED)
    x = random.randint(0, 529)
    y = random.randint(120, 399)
    for index in [0,1,2]:
        overlay_image(base, item, x, y)

        
cv2.imwrite("out.png",base)
