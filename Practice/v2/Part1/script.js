let videoPlayer = document.querySelector("video");
let recordBtn = document.querySelector("#record");
let captureBtn = document.querySelector("#capture");
let body = document.querySelector("body");
let mediaRecorder;
let chunks = [];
let isRecording = false;

captureBtn.addEventListener("click",function()
{
   let canvas = document.createElement("canvas");
   //we have to provide the videoHeight and Width to the canvas
   canvas.height = videoPlayer.videoHeight;
   canvas.width = videoPlayer.videoWidth;
   let tool = canvas.getContext("2d");
   
   tool.drawImage(videoPlayer,0,0);
   //draw image take dx,dy wrt to canvas only

   //now we have to create this canvas image to url
   //but the url will be data url
   //there are 2 types of url: 1) RESOURCE LOCATOR(address kisi cheej ka)
                           // 2) ACTUAL DATA(not address) data URL 
   //we have a function to convert to data url toDataURL() -> it is a actaul data url written in binary 
   let url = canvas.toDataURL();
   

   let a = document.createElement("a");
   a.href = url;
   a.download = "image.png";
   a.click();
   //we are creating url and we download the image through anchor tag but problem ye hain ki jo anchor hain aur jo url bnyi hain voh kuch memory le rahi hain to humhe usey destroy bhi karna hain
   a.remove();
})



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
        a.remove();
        chunks = [];
    })

})
.catch(function () {
    console.log("user has denied the access of camera");
});