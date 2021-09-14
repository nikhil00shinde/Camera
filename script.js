let videoPlayer = document.querySelector("video");
let recordBtn = document.querySelector("#record");
let captureBtn = document.querySelector("#capture");
let body = document.querySelector("body");
let mediaRecorder;
let chunks = [];
let isRecording = false;
let allFilters = document.querySelectorAll(".filter");
let zoomin = document.querySelector(".in");
let zoomout = document.querySelector(".out");
let galleryBtn  = document.querySelector("#gallery"); 

let currZoom = 1; //min 1 and max 3
let filter = "";

//now we are gallery funtionality
galleryBtn.addEventListener("click",function(e)
{
    location.assign("gallery.html");
    //it add path given in assign function infront of domain

    // 127.0.0.1 ->domain name
    // gallery.html -> path name
})

zoomin.addEventListener("click",function(e)
{
    currZoom = currZoom + 0.1;
    if(currZoom > 3) currZoom = 3;
     
    videoPlayer.style.transform = `scale(${currZoom})`;
})


zoomout.addEventListener("click",function(e)
{
    currZoom = currZoom - 0.1;
    if(currZoom < 1) currZoom = 1;
     
    videoPlayer.style.transform = `scale(${currZoom})`;
})


for(let i=0;i<allFilters.length;i++)
{
    allFilters[i].addEventListener("click",function(e)
    {
        let color  = e.currentTarget.style.backgroundColor;
        //to check if the previous any filter is present on the screen
        let previousDiv = document.querySelector(".filter-div");
        //if present remove previous filter
        if(previousDiv) previousDiv.remove();

        //to add filter we will add div in front of the screen with height and width same size of screnn
        let div = document.createElement("div");
        div.classList.add("filter-div");
        filter = color;
        div.style.backgroundColor = color;
        body.append(div);
    })
}

//now we added the filter on screen but now we have add filter on the photo that we going to capture

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
   

   //before drawing the image we have to shift the origin from top-left to center
   //so that we can scale wrt origin(center) and the image inside that is within canvas border is visible 

   //origin shift from top-left to center
   tool.translate(canvas.width/2,canvas.height/2);
   //zoom basically strech kra canvas ka paper
   tool.scale(currZoom,currZoom);
   //wapis top left pr le aye origin ko
   tool.translate(-canvas.width/2,-canvas.height/2);


   tool.drawImage(videoPlayer,0,0);
    //for adding filter in photo we will draw rectangle in canvas
    //first check if filter is present 
    if(filter != "")
    {
        tool.fillStyle = filter;
        tool.fillRect(0,0,canvas.width,canvas.height);
    }
   //draw image take dx,dy wrt to canvas only

   //now we have to create this canvas image to url
   //but the url will be data url
   //there are 2 types of url: 1) RESOURCE LOCATOR(address kisi cheej ka)
                           // 2) ACTUAL DATA(not address) data URL 
   //we have a function to convert to data url toDataURL() -> it is a actaul data url written in binary 
   let url = canvas.toDataURL();
   canvas.remove();
   
   //to save image url in indexedDb
   saveMedia(url);
   
//    let a = document.createElement("a");
//    a.href = url;
//    a.download = "image.png";
//    a.click();
//    //we are creating url and we download the image through anchor tag but problem ye hain ki jo anchor hain aur jo url bnyi hain voh kuch memory le rahi hain to humhe usey destroy bhi karna hain
//    a.remove();
})



recordBtn.addEventListener("click",function(e)
{
    //in video recording part we will not able to add filter
    let previousDiv = document.querySelector(".filter-div");
    // While recording if filter is present remove the filter 
    if(previousDiv) previousDiv.remove();
    filter = "";

    let innerSpan = recordBtn.querySelector("span");
    if(isRecording)
    {
        mediaRecorder.stop();
        isRecording = false;
        innerSpan.classList.remove("record-animation");
    }
    else
    {
        //zoom functionality is only applicable to image not for video
        currZoom = 1;
        videoPlayer.style.transform = `scale(${currZoom})`;
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
        
        saveMedia(blob);
        
        // let link = URL.createObjectURL(blob);

        // let a = document.createElement("a");
        // a.href = link;
        // a.download = "video.mp4"
        // a.click()
        // a.remove();
        chunks = [];
    })

})
.catch(function () {
    console.log("user has denied the access of camera");
});