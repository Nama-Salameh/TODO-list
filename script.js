const taskTable = document.getElementsByClassName(
  "TODO__main__table--tasks"
)[0];
const taskTableBody = document.getElementById("TODO__main__table--tasks__body");

  async function fetchTasks() {
    if (localStorage.getItem("Tasks")) {
        return;
      } 

    const url = new URL("https://dummyjson.com/todos");
    let response = await fetch(url);
    if (!response.ok) throw new Error("failed when trying to fetch data");

    const tasks = await response.json();
    console.log(tasks);

    tasks.todos.forEach((task) => {
      var newTask = taskTableBody.insertRow();

      newTask.classList.add("TODO--main--table--tasks--tr");
      var cell1 = newTask.insertCell(0);
      var cell2 = newTask.insertCell(1);
      cell2.classList.add("Description--Cell");
      var cell3 = newTask.insertCell(2);
      var cell4 = newTask.insertCell(3);
      var cell5 = newTask.insertCell(4);

      cell1.innerHTML = task.id;
      cell2.innerHTML = task.todo;
      cell3.innerHTML = task.userId;
      cell4.innerHTML = task.completed ? "Completed" : "Pending";
      cell5.innerHTML =
        ' <button class="TODO__main__table--tasks__tr__button--delete"> Delete </button> <button class="TODO__main__table--tasks__tr__button--done"> Done</button>';
    });
    saveTasks();
    updateTotalTasks();
  }

  function AddTask() {
  var taskDescription = getTaskDescription();
  if (taskDescription === "") {
    return;
  }

  var newTask = taskTableBody.insertRow();

  newTask.classList.add("TODO--main--table--tasks--tr");
  var cell1 = newTask.insertCell(0);
  var cell2 = newTask.insertCell(1);
  cell2.classList.add("Description--Cell");
  var cell3 = newTask.insertCell(2);
  var cell4 = newTask.insertCell(3);
  var cell5 = newTask.insertCell(4);

  cell1.innerHTML = getTasksCount();
  cell2.innerHTML = taskDescription;
  cell3.innerHTML = "43";
  cell4.innerHTML = "Pending";
  cell5.innerHTML =
    ' <button class="TODO__main__table--tasks__tr__button--delete"> Delete </button> <button class="TODO__main__table--tasks__tr__button--done"> Done</button>';

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
      const confirmed = window.confirm(
        "Do you really want to delete this task?"
      );
      if (confirmed) {
        const row = event.target.closest("tr");
        if (row) {
          row.remove();
          updateTaskIDs();
          saveTasks();
          updateTotalTasks();
        }
      }
    }
  });

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
      saveTasks();

      row.querySelector(".TODO__main__table--tasks__tr__button--done").remove();
    }
  });

var searchInput = document.getElementsByClassName(
  "TODO__header__input--search"
)[0];

searchInput.addEventListener("input", () => {
  var searchText = searchInput.value.toLowerCase();

  var taskRows = document.querySelectorAll(
    ".TODO__main__table--tasks tbody tr"
  );
  taskRows.forEach((row) => {
    var taskDescriptionCell = row.cells[1];
    if (taskDescriptionCell) {
      var taskDescription = taskDescriptionCell.textContent.toLowerCase();
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
