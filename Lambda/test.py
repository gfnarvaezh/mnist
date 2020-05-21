import json
import numpy as np
import matplotlib.pyplot as plt

with open('filename.json') as json_file:
    data = json.load(json_file)

array = np.zeros((1,28,28))

pixel = 3
for x in range(0,28):
    for y in range(0,28):
        array[0, x, y] = data['image']['data'][str(pixel)]
        pixel += 4

plt.imshow(array[0, :, :])
plt.show()
