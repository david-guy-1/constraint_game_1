from base import *

s = input("enter name!")
dungeon_img_left = cv2.imread(s,cv2.IMREAD_UNCHANGED)
dungeon_img = cv2.imread(s,cv2.IMREAD_UNCHANGED)
dungeon_img_right = cv2.imread(s,cv2.IMREAD_UNCHANGED)

img_left = cv2.imread("fade_left.png",cv2.IMREAD_UNCHANGED)
img_plain = cv2.imread("fade.png",cv2.IMREAD_UNCHANGED)
img_right = cv2.imread("fade_right.png",cv2.IMREAD_UNCHANGED)

copyTransparency(dungeon_img_left,img_left)
copyTransparency(dungeon_img,img_plain)
copyTransparency(dungeon_img_right,img_right)

cv2.imwrite("./dungeon_start.png",dungeon_img_left)
cv2.imwrite("./dungeon.png",dungeon_img)
cv2.imwrite("./dungeon_end.png",dungeon_img_right)

#make exit manually!
