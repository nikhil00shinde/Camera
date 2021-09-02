let videoPlayer = document.querySelector("video");
let recordBtn = document.querySelector("#record");
let captureBtn = document.querySelector("#capture");
let body = document.querySelector("body");
let mediaRecorder;
let chunks = [];
let isRecording = false;
let allFilters = document.querySelectorAll(".filter");
let filter = "";
//now we have to add filter ui on images and on screen


for(let i=0;i<allFilters.length;i++)
{
    allFilters[i].addEventListener("click",function(e)
    {
        let color  = e.currentTarget.style.backgroundColor;
        //to check if the previous any filter is present on the screen
        let previousDiv = document.querySelector(".filter-div");
        if(previousDiv) previousDiv.remove();


        //to add filter we will add div in front of the screen with height and width same size of screnn
        let div = document.createElement("div");
        div.classList.add("filter-div");
        div.style.backgroundColor = color;
        body.append(div);
    })
}











captureBtn.addEventListener("click",function()
{
   let innerSpan = captureBtn.querySelector("span");

   innerSpan.addEventListener("click",function(e)
   {
       innerSpan.classList.add("capture-animation");

       setTimeout(function(){
        innerSpan.classList.remove("capture-animation");
       },1000);
   })


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
   canvas.remove();
   a.remove();
})



recordBtn.addEventListener("click",function(e)
{
    let innerSpan = recordBtn.querySelector("span");
    if(isRecording)
    {
        mediaRecorder.stop();
        isRecording = false;
        innerSpan.classList.remove("record-animation");
    }
    else
    {
        mediaRecorder.start();
        isRecording = true;
        innerSpan.classList.add("record-animation");
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