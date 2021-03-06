let req = indexedDB.open("gallery",1);
let database;
let numberOfMedia = 0;

let backBtn = document.querySelector("#back");

backBtn.addEventListener("click",function(e)
{
    location.assign("index.html");
})


req.addEventListener("success",function(){
   database = req.result;
})
req.addEventListener("upgradeneeded",function(){
    
    let db = req.result;
    db.createObjectStore("media",{keyPath:"mId"});
})
req.addEventListener("error",function(){

})



function saveMedia(media)
{
    if(!database) return;

    let data = {
        mId: Date.now(),
        mediaData:media,
    }


    let tx = database.transaction("media","readwrite");
    let mediaObjectStore = tx.objectStore("media");
    mediaObjectStore.add(data);
}

function viewMedia()
{
    if(!database) return;


    let galleryContainer = document.querySelector(".gallery-container");

    
    
    let tx = database.transaction("media","readonly");
    let mediaObjectStore = tx.objectStore("media");
    let req = mediaObjectStore.openCursor();

    req.addEventListener("success",function(e)
    {
        let cursor = req.result;

        if(cursor)
        {
           numberOfMedia++;

            let mediaCard = document.createElement("div");
            mediaCard.classList.add("media-card");

            mediaCard.innerHTML = `
                            <div class="actual-media"></div>
                            <div class="media-buttons">
                                <button class="media-download">Download</button>
                                <button data-mid = ${cursor.value.mId} class="media-delete">Delete</button>
                            </div>`;

            let data = cursor.value.mediaData;
            
            //adding event listener to delete it from ui and databse
            let deleteBtn = mediaCard.querySelector(".media-delete");

            deleteBtn.addEventListener("click",function(e)
            {
                //removing from database
                let id = Number(e.currentTarget.getAttribute("data-mid"));
                deleteMedia(id);
                //removing from ui
                e.currentTarget.parentElement.parentElement.remove();
            })
            
            //we have to download the image and video 
            let downloadBtn = mediaCard.querySelector(".media-download");

            let actualMediaDiv = mediaCard.querySelector(".actual-media");

            let type = typeof data;

            if(type == "string")
            {
                //image

                let image = document.createElement("img");
                image.src = data;

                //when we want to download image or video we have to specify whether it's a image or video

                downloadBtn.addEventListener("click",function(e)
                {
                    downloadMedia(data,"image");
                })

                actualMediaDiv.append(image);
            }
            else if(type == "object")
            {
                //video

                let video = document.createElement("video");

                let url = URL.createObjectURL(data);
               
                //download video
                downloadBtn.addEventListener("click",function(e)
                {
                    downloadMedia(url,"video");
                })

                video.src = url;

                video.autoplay = true;
                video.loop = true;
                video.controls = true;
                video.muted = true;

                actualMediaDiv.append(video);
   
            }

            galleryContainer.append(mediaCard);

            cursor.continue();
        }
        else
        {
            if(numberOfMedia == 0)
            {
                galleryContainer.innerText = "No Media Found";
            }
        }
    })
};

function deleteMedia(mId)
{
    let tx = database.transaction("media","readwrite");
    let mediaObjectStore = tx.objectStore("media");

    mediaObjectStore.delete(mId);
}

function  downloadMedia(url,type)
{
    let anchor = document.createElement("a");

    anchor.href = url;
    
    if(type == "image")
    {
      anchor.download = "image.png";
    }
    else
    {
      anchor.download = "video.mp4";
    }

    anchor.click();
    anchor.remove();
}