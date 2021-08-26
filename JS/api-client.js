// JAVASCRIPT

// Universal

const header = new Headers();
header.append("Content-Type", "application/json");
const url = 'http://localhost:3000/';


// GET REQUEST HEADER

const get = {
    method: "GET",
    headers: header,
    redirect: "follow"
};

// DEL REQUEST HEADER

const del = {
    method: "DELETE"
};


// Onload Page .... 

document.addEventListener("DOMContentLoaded", () => {

    // GET Items

    async function getItems() {
        await fetch(url, get)
            .then(resp => resp.json())
            .then(data => Items(data))
            .catch(err => console.log(err));

    }


    function Items(data) {

        for (const item of data) {

            const newLi = document.createElement("li");
            const newTask = document.createElement("input");
            const checkTask = document.createElement("label");
            const deleteTask = document.createElement("button");
            newTask.classList.add("task");
            checkTask.classList.add("checktask");
            deleteTask.classList.add("deltask");
            newLi.dataset.id = item._id;
            newTask.value = item.description;


            function check() {
                if (item.done === true) {
                    checkTask.innerHTML = `<input type="checkbox" checked>`;
                    newTask.classList.add("taskdone");
                    newTask.classList.remove("tasknotdone");
                } else {
                    checkTask.innerHTML = `<input type="checkbox">`;
                    newTask.classList.remove("taskdone");
                    newTask.classList.add("tasknotdone");
                }
            }
            check()

            deleteTask.innerHTML = `<i class ="fas fa-trash"> </i>`;
            const todoList = document.getElementById("todo-list").getElementsByTagName("ul")[0];
            todoList.appendChild(newLi);
            newLi.appendChild(newTask);
            newLi.appendChild(checkTask);
            newLi.appendChild(deleteTask);

            // DELETE Items

            deleteTask.addEventListener("click", () => deleteItem());

            async function deleteItem() {
                await fetch(`http://localhost:3000/${item._id}`, del)
                    .then(newLi.remove())
                    .catch(err => console.log(err));
            }

            // UPDATE Items when checkbutton is activated / non activated

            checkTask.addEventListener("click", e => {
                if (e.target.checked) {
                    console.log("ToDo Item is done..");
                    newTask.classList.add("taskdone");
                    newTask.classList.remove("tasknotdone");
                    updateItemStatus(true);


                } else {
                    console.log("Todo Item is not yet done..");
                    newTask.classList.remove("taskdone");
                    newTask.classList.add("tasknotdone");
                    updateItemStatus(false);

                }
            });


            async function updateItemStatus(e) {

                const put = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "done": e
                    })

                }
                await fetch(`http://localhost:3000/${item._id}`, put)
                    .then(resp => resp.json())
                    .catch(err => console.log(err));
            }

            // UPDATE Items when task text has been changed


            newTask.addEventListener("change", e => {
                e.preventDefault();
                updateItemText(newTask.value);
            });

            async function updateItemText(e) {

                const put2 = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "description": e
                    })
                }
                await fetch(`http://localhost:3000/${item._id}`, put2)
                    .then(resp => resp.json())
                    .catch(err => console.log(err));

            }


        }

    }

    getItems();


    // POST Items

    const form = document.querySelector("#form");
    form.addEventListener("submit", (e) => postItem(e));

    async function postItem(e) {
        e.preventDefault();
        const newItem = document.querySelector("#input").value;
        const post = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "description": newItem,
                "done": false
            })
        }


        await fetch(url, post)
            .then(resp => resp.json())
            .then(newitem => Items([newitem]))
            .catch(err => console.log(err));
    }

});

