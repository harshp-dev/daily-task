const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const resetTaskButton = document.getElementById("resetTask");

addTaskButton.addEventListener("click", function () {
  let taskText = taskInput.value;
  if (taskText === "") {
    alert("Please enter task");
    return;
  }
  const taskItem = document.createElement("li");
  taskItem.textContent = taskText;
  //delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "delete";
  deleteButton.classList.add("delete-btn");
  taskItem.appendChild(deleteButton);

  //Edit button
  const editButton = document.createElement("button");
  editButton.textContent = "edit";
  editButton.classList.add("edit-btn");
  taskItem.appendChild(editButton);
  //setting the input area blank after adding the task
  //Appending the task to the list
  taskList.appendChild(taskItem);
  taskInput.value = "";

  //Delete button functions
  deleteButton.addEventListener("click", function () {
    taskList.removeChild(taskItem);
  });
  editButton.addEventListener("click", function () {
    taskInput = taskItem.value;
    
  });
  resetTaskButton.addEventListener("click", function () {
    taskInput.value = " ";
  });
});
