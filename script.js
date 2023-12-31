const taskTable = document.getElementsByClassName(
  "TODO__main__table--tasks"
)[0];
const taskTableBody = document.getElementById("TODO__main__table--tasks__body");
const url = new URL("https://dummyjson.com/todos");

async function fetchTasks() {
  if (localStorage.getItem("Tasks")) {
    return;
  }

  let response = await fetch(url);
  if (!response.ok) throw new Error("failed when trying to fetch data");

  const tasks = await response.json();
  console.log(tasks);

  tasks.todos.forEach((task) => {
    let newTask = taskTableBody.insertRow();

    newTask.classList.add("TODO--main--table--tasks--tr");
    let cell1 = newTask.insertCell(0);
    let cell2 = newTask.insertCell(1);
    cell2.classList.add("Description--Cell");
    let cell3 = newTask.insertCell(2);
    let cell4 = newTask.insertCell(3);
    let cell5 = newTask.insertCell(4);

    cell1.innerHTML = task.id;
    cell2.innerHTML = task.todo;
    cell3.innerHTML = task.userId;
    cell4.innerHTML = task.completed ? "Completed" : "Pending";

    if (task.completed) {
      cell2.classList.add("done-task");
      cell5.innerHTML =
        ' <button class="TODO__main__table--tasks__tr__button--delete"> Delete </button>';
    } else
      cell5.innerHTML =
        ' <button class="TODO__main__table--tasks__tr__button--delete"> Delete </button> <button class="TODO__main__table--tasks__tr__button--done"> Done</button>';
  });
  saveTasks();
  updateTotalTasks();
}

async function AddTask() {
  let taskDescription = getTaskDescription();
  if (taskDescription === "") {
    return;
  }

  let newTask = taskTableBody.insertRow();

  newTask.classList.add("TODO--main--table--tasks--tr");
  let cell1 = newTask.insertCell(0);
  let cell2 = newTask.insertCell(1);
  cell2.classList.add("Description--Cell");
  let cell3 = newTask.insertCell(2);
  let cell4 = newTask.insertCell(3);
  let cell5 = newTask.insertCell(4);

  cell1.innerHTML = getTasksCount();
  cell2.innerHTML = taskDescription;
  let randomUserId = Math.floor(Math.random() * 100) + 1;
  cell3.innerHTML = randomUserId.toString();
  cell4.innerHTML = "Pending";
  cell5.innerHTML =
    ' <button class="TODO__main__table--tasks__tr__button--delete"> Delete </button> <button class="TODO__main__table--tasks__tr__button--done"> Done</button>';

  let task = {
    id: getTasksCount(),
    todo: taskDescription,
    completed: false,
    userId: randomUserId,
  };
  console.log(task);

  let response = await fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    console.error("HTTP error:", response.status, response.statusText);
    throw new Error("HTTP error");
  } else {
    console.log("success");
    const responseData = await response.json();
    console.log(responseData);
  }

  deleteDescriptionInputValue();
  saveTasks();
  updateTotalTasks();
}

function getTaskDescription() {
  return document.getElementsByClassName(
    "TODO__header__section--AddTask__input--add"
  )[0].value;
}

function getTasksCount() {
  return taskTableBody.rows.length;
}

function deleteDescriptionInputValue() {
  document.getElementsByClassName(
    "TODO__header__section--AddTask__input--add"
  )[0].value = "";
}

function saveTasks() {
  localStorage.setItem("Tasks", taskTableBody.innerHTML);
}

function showTasks() {
  taskTableBody.innerHTML = localStorage.getItem("Tasks");
}

document
  .querySelector(".TODO__main__table--tasks")
  .addEventListener("click", function (event) {
    if (
      event.target.classList.contains(
        "TODO__main__table--tasks__tr__button--delete"
      )
    ) {
      let modal = document.querySelector(".modal-container");
      modal.classList.add("modal-active");
      deleteTask(event);
      cancelDeletion(modal);
    }
  });

function deleteTask(generalDeleteEvent) {
  document.querySelector(".delete-button").addEventListener("click", () => {
    const row = generalDeleteEvent.target.closest("tr");
    if (row) {
      row.remove();
      updateTaskIDs();
      saveTasks();
      updateTotalTasks();
    }
    let modal = document.querySelector(".modal-container");
    modal.classList.remove("modal-active");
  });
}

function cancelDeletion(modal) {
  document
    .querySelector(".cancel-button")
    .addEventListener("click", () => modal.classList.remove("modal-active"));
}

function updateTaskIDs() {
  const taskRows = document.querySelectorAll(
    ".TODO__main__table--tasks tbody tr"
  );

  taskRows.forEach((row, index) => {
    const idCell = row.cells[0];
    idCell.textContent = index + 1;
  });
}

function updateTotalTasks() {
  document.querySelector(".TODO__footer--tasksCounter").innerHTML =
    getTasksCount();
}

document
  .querySelector(".TODO__main__table--tasks")
  .addEventListener("click", function (event) {
    if (
      event.target.classList.contains(
        "TODO__main__table--tasks__tr__button--done"
      )
    ) {
      const row = event.target.closest("tr");
      row.cells[3].textContent = "Completed";
      row.cells[1].classList.add("done-task");
      row.querySelector(".TODO__main__table--tasks__tr__button--done").remove();
      saveTasks();
    }
  });

let searchInput = document.getElementsByClassName(
  "TODO__header__input--search"
)[0];

searchInput.addEventListener("input", () => {
  let searchText = searchInput.value.toLowerCase();

  let taskRows = document.querySelectorAll(
    ".TODO__main__table--tasks tbody tr"
  );
  taskRows.forEach((row) => {
    let taskDescriptionCell = row.cells[1];
    if (taskDescriptionCell) {
      let taskDescription = taskDescriptionCell.textContent.toLowerCase();
      if (taskDescription.includes(searchText)) row.style.display = "";
      else row.style.display = "none";
    }
  });
});

taskTable.addEventListener("click", function (event) {
  const targetCell = event.target;
  if (targetCell.classList.contains("Description--Cell")) {
    targetCell.contentEditable = true;
    targetCell.focus();
    targetCell.addEventListener("blur", function () {
      this.contentEditable = false;
    });
  }
});

fetchTasks();
showTasks();
updateTotalTasks();
