const taskTable = document.getElementsByClassName(
  "TODO__main__table--tasks"
)[0];
const taskTableBody = document.getElementById("TODO__main__table--tasks__body");

function AddTask() {
  var taskDescription = getTaskDescription();
  if (taskDescription === "") {
    return;
  }

  var newTask = taskTableBody.insertRow();

  newTask.classList.add("TODO--main--table--tasks--tr");
  var cell1 = newTask.insertCell(0);
  var cell2 = newTask.insertCell(1);
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
showTasks();

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
        }
      }
    }
    saveTasks();
  });
