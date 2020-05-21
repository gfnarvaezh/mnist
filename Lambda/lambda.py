import json
import numpy as np
import tflite_runtime.interpreter as tflite
import boto3
import os

def json_to_numpy_array(event):
    array = np.zeros((1,28,28), dtype = 'float32')
    pixel = 0
    for x in range(0,28):
        for y in range(0,28):
            try:
                array[0, x, y] = event['image']['data'][str(pixel)]
            except:
                array[0, x, y] = 0
            pixel += 1
    return array
    
    array = array / 255.0
def lambda_handler(event, context):
    
    array = json_to_numpy_array(event)
    
    model_path = os.path.join(os.sep, 'tmp', 'converted_model.tflite')
    s3 = boto3.client('s3')
    s3.download_file('narvaezfelipe-backend','converted_model.tflite', model_path)
    
    interpreter = tflite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()

    # Get input and output tensors.
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    # Run model on input
    interpreter.set_tensor(input_details[0]['index'], array)

    interpreter.invoke()

    # Get the output as a copy of the output tensor
    output_data = interpreter.get_tensor(output_details[0]['index'])

    # Return 1x10 np array
    return {
        'statusCode': 200,
        'response':{
            'result': output_data.flatten().tolist()
        }
    }