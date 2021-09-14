let req = indexedDB.open("gallery",1);
let database;


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
