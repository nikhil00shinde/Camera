let openBtn = document.querySelector("#open");
let addBtn = document.querySelector("#add");
let input = document.querySelector("input");
let db;


addBtn.addEventListener("click",function(e)
{
    if(!db)
    {
         alert("Database has not been opened yet");
         return ;
    }


    let value = input.value;
    input.value = "";



    //now when we have to do any task that is read,store,update,insert or delete we have to use TRANSACTION
    // Transaction is just a process of doing something with database
    //Transaction tell which type of task we have to do that is readonly or readwrite


    let tx = db.transaction("csNotes","readwrite");
    //this give transaction of csNotes that we want to perform some task. That task can be insert,update, delete.

    let csNotesObjectStore = tx.objectStore("csNotes");
    //this give the access of the csNotes
    

    let data = {
        cId:Date.now(),
        //this give current data time in second
        note:value
    }
    csNotesObjectStore.add(data);
    //to add data data in the csNotes Object storage 

})
openBtn.addEventListener("click",function()
{
    let req = indexedDB.open("Notes",1);

    req.addEventListener("success",function()
    {
        db = req.result;
        alert("Successfully Opened");
    })
    
    req.addEventListener("upgradeneeded",function()
    {
        db = req.result;
        db.createObjectStore("csNotes",{keyPath:"cId"});
    })
    
    req.addEventListener("error",function()
    {
        alert("Error in the opening database");
    })
})








