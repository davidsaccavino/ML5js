let video;
let YOLO;


function setup(){
    createCanvas(640, 480);
    fill(0)
    video = createCapture(VIDEO);
    video.size(640, 480);

    
    YOLO = ml5.YOLO(video, modelLoaded);
    try
    {
        while(true){

            
            YOLO.detect(function(err, results){
                drawResults(results);
                
        
            });
        }
    }
    catch(error)
    {
        console.log(error);
    }

}

function modelLoaded() {
  console.log('Model Loaded!');
}


function drawResults(results){
    textSize(32);
    try
    {
        text(results[0].className, 300, 250);
    }
    catch(error){
        if(error === "TypeError")
        {
            console.log("Could not identify anything.")
        }
        else
        {
            console.log(error);
        }
        
    }
    fill(0);
}