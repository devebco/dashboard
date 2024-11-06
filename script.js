let cards_count = 6;


// Function to add a task

function addTask(listId) {
    let taskInput = document.getElementById(listId + '-task-input');
    let taskText = taskInput.value.trim();

    if (taskText === '') return;

    // Retrieve existing tasks or initialize an empty array if none exist
    let tasks = JSON.parse(localStorage.getItem(listId)) || [];

    // Add the new task as an object with 'text' and 'done' status
    tasks.push({ text: taskText, done: false });
    localStorage.setItem(listId, JSON.stringify(tasks));

    taskInput.value = ''; // Clear input
    displayTasks(listId);
}

// Function to display tasks
function displayTasks(listId) {
    let taskList = document.getElementById(listId + '-tasks');
    let tasks = JSON.parse(localStorage.getItem(listId)) || [];

    // Separate tasks into completed and pending, then recombine for display
    let doneTasks = tasks.filter(task => task.done);
    let pendingTasks = tasks.filter(task => !task.done);
    tasks = [...doneTasks, ...pendingTasks];

    taskList.innerHTML = ''; // Clear existing list items

    // Render tasks in updated order
    tasks.forEach((task, index) => {
        let li = document.createElement('li');
        li.textContent = task.text;
        if (task.done) li.classList.add('done'); // Apply done class

        // Button container for edit/delete buttons
        let buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        // Edit button
        let editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            editTask(listId, index);
        };

        // Delete button
        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteTask(listId, index);
        };

        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(deleteBtn);
        li.appendChild(buttonContainer);

        // Toggle done status on click
        li.addEventListener('click', () => toggleTaskStatus(listId, index));
        taskList.appendChild(li);
    });

    // Save re-ordered list back to localStorage
    localStorage.setItem(listId, JSON.stringify(tasks));
}

// Function to toggle task status
function toggleTaskStatus(listId, taskIndex) {
    let tasks = JSON.parse(localStorage.getItem(listId));
    tasks[taskIndex].done = !tasks[taskIndex].done;
    localStorage.setItem(listId, JSON.stringify(tasks));
    displayTasks(listId);
}

// Function to edit a task
function editTask(listId, taskIndex) {
    let tasks = JSON.parse(localStorage.getItem(listId));
    let newText = prompt('Edit your task:', tasks[taskIndex].text);

    if (newText && newText.trim() !== '') {
        tasks[taskIndex].text = newText.trim();
        localStorage.setItem(listId, JSON.stringify(tasks));
        displayTasks(listId);
    }
}

// Function to delete a task
function deleteTask(listId, taskIndex) {
    let tasks = JSON.parse(localStorage.getItem(listId));
    tasks.splice(taskIndex, 1); // Remove the task at taskIndex
    localStorage.setItem(listId, JSON.stringify(tasks));
    displayTasks(listId);
}

// Load tasks on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    for (let i = 1; i <= cards_count; i++) {
        displayTasks('list' + i);
        const taskInput = document.getElementById('list' + i + '-task-input');
        taskInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                addTask('list' + i);
            }
        });
    }
});
