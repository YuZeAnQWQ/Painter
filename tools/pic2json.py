# Run: py tools/pic2json.py

from PIL import Image
import sys
import os

pic_name = sys.argv[1]
json_name = pic_name.split('.')[0]

img_path = os.getcwd() + '/pic/' + pic_name

output_file = open(os.getcwd() + '/pic-json/' + json_name + '.json',"w")

img = Image.open(img_path)
img_rgb = img.convert('RGB')

output_file.write("{")

tuple_value = (0,0,0)
hex_color = ""
r_hex = ""
g_hex = ""
b_hex = ""

for i in range(img_rgb.size[0]):
    for j in range(img_rgb.size[1]):
        tuple_value = img_rgb.getpixel((i,j))
        r_hex = hex(tuple_value[0])[2:]
        if len(r_hex) == 1 :
            r_hex = "0" + r_hex
        g_hex = hex(tuple_value[1])[2:]
        if len(g_hex) == 1 :
            g_hex = "0" + g_hex
        b_hex = hex(tuple_value[2])[2:]
        if len(b_hex) == 1 :
            b_hex = "0" + b_hex
        hex_color = r_hex + g_hex + b_hex
        if((i == img_rgb.size[0] - 1) and (j == img_rgb.size[1] - 1)):
            output_file.write('{"x":' + str(i) + ',"y":' + str(j) + ',"hex":"' + hex_color + '"}')
        else:
            output_file.write('{"x":' + str(i) + ',"y":' + str(j) + ',"hex":"' + hex_color + '"},')

output_file.close()