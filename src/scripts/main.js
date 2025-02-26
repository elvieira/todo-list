const tasksDisplay = document.querySelector("#tasks ul");
const addButton = document.querySelector("#add-task");
const removeButton = document.querySelector("#remove-task");
const cancelRemoveButton = document.querySelector("#cancel-remove-task");

let listTasks = JSON.parse(localStorage.getItem("listTasks")) || [];

function saveTasks() {
    localStorage.setItem("listTasks", JSON.stringify(listTasks));
};

function renderTasks() {
    tasksDisplay.innerHTML = listTasks.map(task => `
        <li>
            <input type="checkbox" id="${task.id}" ${task.check ? "checked" : ""} class="task-checkbox">
            <label for="${task.id}">${task.task}</label>
        </li>
    `).join('');

    document.querySelectorAll(".task-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            const taskId = parseInt(e.target.id);
            const taskIndex = listTasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                listTasks[taskIndex].check = e.target.checked;
                saveTasks();
            }
        });
    });
};

function toggleRemoveMode(remove) {
    const tasks = [...tasksDisplay.getElementsByTagName("li")];

    if (!remove) {
        removeButton.classList.remove("selected");
        cancelRemoveButton.classList.add("disabled");
        tasks.forEach(task => task.querySelector("#select")?.remove());
        return;
    }

    removeButton.classList.toggle("selected");
    cancelRemoveButton.classList.toggle("disabled");

    if (removeButton.classList.contains("selected")) {
        tasks.forEach(task => task.insertAdjacentHTML("beforeend", `<input type="checkbox" id="select">`));
    } else {
        tasks.forEach(task => {
            const checkbox = task.querySelector("#select");
            if (checkbox.checked) {
                const taskId = parseInt(task.querySelector("label").getAttribute("for"));
                listTasks = listTasks.filter(i => i.id !== taskId);
                saveTasks();
            }
            checkbox.remove();
        });
        renderTasks();
    }
};

function manageTask(action) {
    if (action === "open") {
        document.body.insertAdjacentHTML("beforeend", `
            <section class="add-task">
                <div class="container">
                    <h2>Adicionar tarefa</h2>
                    <input type="text" id="task">
                    <div class="add-buttons">
                        <button class="cancel" onclick="manageTask('cancel')">Cancelar</button>
                        <button class="add" onclick="manageTask('add')">Adicionar</button>
                    </div>
                </div>
            </section>
        `);
    } else if (action === "cancel") {
        document.querySelector("section.add-task")?.remove();
    } else if (action === "add") {
        const taskInput = document.querySelector(".container #task");
        if (taskInput.value.trim()) {
            listTasks.push({ id: Date.now(), check: false, task: taskInput.value });
            saveTasks();
            renderTasks();
        }
        document.querySelector("section.add-task")?.remove();
    }
};

addButton.addEventListener("click", () => manageTask("open"));
removeButton.addEventListener("click", () => toggleRemoveMode(true));
cancelRemoveButton.addEventListener("click", () => toggleRemoveMode(false));

renderTasks();
