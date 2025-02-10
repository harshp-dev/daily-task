// Select elements
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const resetTaskButton = document.getElementById("resetTask");

// Add event listener to the button
addTaskButton.addEventListener("click", function () {
  // Get input value
  let taskText = taskInput.value;
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  // Create a new <li> element
  const taskItem = document.createElement("li");
  taskItem.textContent = taskText;

  // Create a delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "delete";
  deleteButton.classList.add("delete-btn");
  // Append button to taskItem
  taskItem.appendChild(deleteButton);
  // Append taskItem to taskList
  taskList.appendChild(taskItem);

  // Clear input field
  taskInput.value = "";

  // Add event listener to delete button
  deleteButton.addEventListener("click", function () {
    taskList.removeChild(taskItem);
  });
});

resetTaskButton.addEventListener("click", function () {
  taskInput.value = " ";
});
