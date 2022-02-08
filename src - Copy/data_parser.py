thing = open("data.txt", "r").readlines()
header = ""
images = []
for line1 in thing:
    if(line1[-1] == "\n"):
        line = line1[0:len(line1)-1]
    else:
        line = line1
    if(":" in line):
        header = line[0:len(line)-1]
    if(".png" in line):
        images.append(header + "/" + line)
print(images)
