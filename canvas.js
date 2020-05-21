window.addEventListener('load', () => {
    const canvas = document.querySelector("#canvas");
    const context = canvas.getContext('2d');


    context.lineWith = 10;
    context.lineCap = 'round';

    let isDrawing = false;
    let x = 0;
    let y = 0;

    canvas.addEventListener('mousedown', e => {
        x = e.offsetX/10;
        y = e.offsetY/10;
        isDrawing = true;
    });
    
    canvas.addEventListener('mousemove', e => {
        if (isDrawing === true) {
            drawLine(context, x, y, e.offsetX/10, e.offsetY/10);
            x = e.offsetX/10;
            y = e.offsetY/10;
        }
    });
    
    window.addEventListener('mouseup', e => {
        if (isDrawing === true) {
            drawLine(context, x, y, e.offsetX/10, e.offsetY/10);
            x = 0;
            y = 0;
            isDrawing = false;
            send_image();
        }
    });
    
    function drawLine(context, x1, y1, x2, y2) {
        context.beginPath();
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.closePath();
    }

    
    document.getElementById("clear").addEventListener("click", function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    function send_image(){
        let myImageData = context.getImageData(0, 0, 28, 28);
        let counter_slow = 0;
        let counter_fast = 3;
        let image = {};
        image['data'] = {}
        let size_image = Object.keys(myImageData['data']).length;
        console.log(size_image)

        while (counter_fast < size_image){
            image['data'][counter_slow] = myImageData['data'][counter_fast];
            counter_fast = counter_fast + 4;
            counter_slow = counter_slow + 1;
        }

        var data = {
            image: image,
            image_name : "test"
          }
        
        submit(JSON.stringify(data));
    };

    function submit(json_file) {
        result_div = document.getElementById("result")
        result_div.innerHTML = "...";
        percent_div = document.getElementById("percent")
        percent_div.innerHTML = "...";
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 400) { result_div.innerHTML = "<h2>Please input valid text</h2>"; } 
                else if (xhr.status === 200) { 
                    let result = JSON.parse(xhr.response);
                    result_div.innerHTML = String(result['response']['result']);
                    percent_div.innerHTML = String(Math.round(result['response']['percent']*100)) + '%';
                } 
                else { result_div.innerHTML = "<h2>Error</h2>"; }
            }
        }

        xhr.open("POST", 'https://kvvxdzouqk.execute-api.us-east-2.amazonaws.com/Production/testing', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(json_file);
    }

    submit();

});

