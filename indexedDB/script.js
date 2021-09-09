let openBtn = document.querySelector("#open");
let addBtn = document.querySelector("#add");
let input = document.querySelector("input");
let table = document.querySelector("table");
let viewBtn = document.querySelector("#view");
let db;

let tempData = [
  { cId: 2423534534, note: "this is note 1" },
  { cId: 2426634534, note: "this is note2" },
  { cId: 2113534534, note: "this is note 3" },
]

viewBtn.addEventListener("click",function()
{
    let tx = db.transaction("csNotes","readonly");


    let csNotesObjectStore = tx.objectStore("csNotes");
    //get csNotes Object Store
    
    let req = csNotesObjectStore.openCursor();
    //now to get request to pointer of first JS Object, in object store

    let serialNumber = 1;
    
    
    table.innerHTML = ` <thead>
                            <tr>
                                <th>Sr No.</th>
                                <th>Note</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>`;

    let tbody = table.querySelector("tbody");


    req.addEventListener("success",function(e){
        let cursor = req.result;
        // now we will get pointer to first js object
        
        // if their is no js object in object store the cursor will be empty
        if(cursor)
        {
            let curObj = cursor.value;

            let tr = document.createElement("tr"); 
            tr.innerHTML = `<td>${serialNumber}</td>
            <td>${curObj.note}</td>
            <td><button>Delete</button></td>`;

            tbody.append(tr);
            serialNumber++;
             cursor.continue();
            //  it will make request to point to next object and it will assign request to req variable
        }
    })
});

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








