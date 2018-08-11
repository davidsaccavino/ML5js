let mobilenet;
let img;
let offset;
let p;
let capture;

function setup(){
    createCanvas(640, 480);
    background(0);


    capture = createCapture(VIDEO, imageReady);
    capture.size(320, 240);
    capture.hide();
    
    mobilenet = ml5.imageClassifier('MobileNet', capture, modelReady);
    mobilenet.predict(capture, function(err, results) {
        if(err){
            console.log(err);
        }

        offset = 70;
        for(let i in results){
            createElement('p', `${results[i].className} ${round(results[i].probability * 100)}%`).position(offset, 500);
            offset += 100
        }
      });
}


function imageReady(){
    image(capture, 0, 0, width, height);
}
function modelReady(){
    console.log("Model is ready");
}

