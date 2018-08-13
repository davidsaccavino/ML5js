let video;
let poseNet;
let poses = [];
let yolo;
let status;
let objects = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, poseNetReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  yolo = ml5.YOLO(video, startDetecting);


  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();

}

function startDetecting() {
  console.log('YOLO Model loaded!');
  detect();
}

function detect() {
  yolo.detect(function(err, results){
    objects = results;
    detect();
  });
}

function poseNetReady() {
  console.log('poseNet Model Loaded');
  
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
  for (let i = 0; i < objects.length; i++) {
    noStroke();
    // fill(0, 255, 0);
    text(objects[i].className, objects[i].x*width, objects[i].y*height - 5);
    noFill();
    // strokeWeight(4);
    stroke(255, 0, 0);
    rect(objects[i].x*width, objects[i].y*height, objects[i].w*width, objects[i].h*height);
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    if(i === 0){
        drawTriangle(pose);
    }
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
  
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

function drawTriangle(pose){
    let nose = pose.keypoints[0]['position'];
    let leftEye = pose.keypoints[1]['position'];
    let rightEye = pose.keypoints[2]['position'];

    line(leftEye.x, leftEye.y, rightEye.x, rightEye.y);
    line(leftEye.x, leftEye.y, nose.x, nose.y);
    line(nose.x, nose.y, rightEye.x, rightEye.y);

    averageX = (leftEye.x + rightEye.x) / 2
    averageY = (leftEye.y + rightEye.y) / 2

    stroke(255, 0, 0);
    noFill();
    ellipse(averageX, averageY, 100, 100);
}
