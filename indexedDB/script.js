
//database version signifies how many major changes my database has been through
let req = indexedDB.open("Notes",1);


req.addEventListener("success",function()
{
    let db = req.result;
    console.log(1);
})

//kuch bhi creation ya fir update ka kaam ho to ye wala apka event chlta h
req.addEventListener("upgradeneeded",function()
{
    let db = req.result;
    console.log(db);
    console.log(2);

    // when we want to introduce a new object stores then we change the version of the database
    db.createObjectStore("csNotes",{keyPath:"cId"});
})

req.addEventListener("success",function()
{
    console.log(3);
})