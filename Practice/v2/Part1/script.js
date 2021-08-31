let videoPlayer = document.querySelector("video");
let recordBtn = document.querySelector("#record");
let captureBtn = document.querySelector("#capture");
let body = document.querySelector("body");
let mediaRecorder;
let chunks = [];
let isRecording = false;
let isCapture = false;

recordBtn.addEventListener("click",function(e)
{
    if(isRecording)
    {
        mediaRecorder.stop();
        isRecording = false;
    }
    else
    {
        mediaRecorder.start();
        isRecording = true;
    }
})



let promiseToUseCamera = navigator.mediaDevices.getUserMedia({
video: true,
audio: true,
});

promiseToUseCamera
.then(function (mediaStream) {
    videoPlayer.srcObject = mediaStream;

    mediaRecorder = new MediaRecorder(mediaStream);


    mediaRecorder.addEventListener("dataavailable",function(e)
    {
        chunks.push(e.data);
    })

    mediaRecorder.addEventListener("stop",function(e)
    {
        let blob = new Blob(chunks,{type:"video/mp4"});

    
        let link = URL.createObjectURL(blob);
    
        let a = document.createElement("a");
        a.href = link;
        a.download = "video.mp4"
        a.click()
        chunks = [];
    })

})
.catch(function () {
    console.log("user has denied the access of camera");
});