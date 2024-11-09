let cards_count = 6;

function addTask(listId) {
    let taskInput = document.getElementById(listId + '-task-input');
    console.log("taskInput is : " & taskInput)
    let taskText = taskInput.value.trim();
    if (taskText === '') return;

    let tasks = JSON.parse(localStorage.getItem(listId)) || [];
    tasks.push({ text: taskText, done: false });
    localStorage.setItem(listId, JSON.stringify(tasks));
    taskInput.value = '';
    displayTasks(listId);
}

function displayTasks(listId) {
    let taskList = document.getElementById(listId + '-tasks');
    console.log("taskList is : " & taskList)
    let tasks = JSON.parse(localStorage.getItem(listId)) || [];
    let doneTasks = tasks.filter(task => task.done);
    let pendingTasks = tasks.filter(task => !task.done);
    tasks = [...doneTasks, ...pendingTasks];
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        let li = document.createElement('li');
        li.textContent = task.text;
        if (task.done) li.classList.add('done');

        let buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        let editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            editTask(listId, index);
        };

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

        li.addEventListener('click', () => toggleTaskStatus(listId, index));
        taskList.appendChild(li);
    });

    localStorage.setItem(listId, JSON.stringify(tasks));
}

function toggleTaskStatus(listId, taskIndex) {
    let tasks = JSON.parse(localStorage.getItem(listId));
    tasks[taskIndex].done = !tasks[taskIndex].done;
    localStorage.setItem(listId, JSON.stringify(tasks));
    displayTasks(listId);
}

function editTask(listId, taskIndex) {
    let tasks = JSON.parse(localStorage.getItem(listId));
    let newText = prompt('Edit your task:', tasks[taskIndex].text);
    if (newText && newText.trim() !== '') {
        tasks[taskIndex].text = newText.trim();
        localStorage.setItem(listId, JSON.stringify(tasks));
        displayTasks(listId);
    }
}

function deleteTask(listId, taskIndex) {
    let tasks = JSON.parse(localStorage.getItem(listId));
    tasks.splice(taskIndex, 1);
    localStorage.setItem(listId, JSON.stringify(tasks));
    displayTasks(listId);
}

document.addEventListener('DOMContentLoaded', () => {
    for (let i = 1; i <= cards_count; i++) {
        displayTasks('list' + i);
        const taskInput = document.getElementById('list' + i + '-task-input');
        taskInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                addTask('list' + i);
            }
        });

        let titleElement = document.getElementById('list' + i).querySelector('.title-container h3');
        let savedTitle = localStorage.getItem('title_' + 'list' + i);
        let savedColor = localStorage.getItem('bgcolor_' + 'list' + i);

        if (savedTitle) titleElement.textContent = savedTitle;
        if (savedColor) document.getElementById('list' + i).style.backgroundColor = savedColor;

        titleElement.addEventListener('click', () => {
            let input = document.createElement('input');
            input.type = 'text';
            input.value = titleElement.textContent;
            titleElement.replaceWith(input);
            input.focus();

            input.addEventListener('blur', () => {
                titleElement.textContent = input.value;
                input.replaceWith(titleElement);
                localStorage.setItem('title_' + 'list' + i, titleElement.textContent);
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') input.blur();
            });
        });

        let colorPicker = document.getElementById('list' + i).querySelector('.color-picker');
        colorPicker.value = savedColor || '#ffffff';
        colorPicker.addEventListener('input', () => {
            document.getElementById('list' + i).style.backgroundColor = colorPicker.value;
            localStorage.setItem('bgcolor_' + 'list' + i, colorPicker.value);
        });
    }
});
