// we are going to use indexedDB, it is a NoSQL database
//SQL is a language which uses platform like MySQL to perform RDBMS


// .open("database_name","database_version") -> it is a asynchronous function
// Not every asynchronous function use a promise

//database version signifies how many major changes my database has been through
let req = indexedDB.open("Notes",1);

//req is request, it has 3 event success, error and upgradeneeded

req.addEventListener("success",function()
{
    // if the request has been successful request gives result which is database
    let db = req.result;
    console.log(1);
})

req.addEventListener("upgradeneeded",function()
{
    // if the request has been successful request gives result which is database
    let db = req.result;
    console.log(db);
    console.log(2);
})

req.addEventListener("success",function()
{
    console.log(3);
})