document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addButton = document.getElementById('add-button');
    const taskList = document.getElementById('task-list');

    // 1. Load tasks from memory when the page starts
    const loadTasks = () => {
        const savedTasks = JSON.parse(localStorage.getItem('myToDoData')) || [];
        savedTasks.forEach(task => renderTask(task));
    };

    // 2. Save current list to memory
    const saveTasks = () => {
        const tasks = [];
        document.querySelectorAll('#task-list span').forEach(span => {
            tasks.push(span.innerText);
        });
        localStorage.setItem('myToDoData', JSON.stringify(tasks));
    };

    // 3. Put a task on the screen
    const renderTask = (taskText) => {
        const listItem = document.createElement('li');
        
        listItem.innerHTML = `
            <span>${taskText}</span>
            <button class="delete-btn">×</button>
        `;

        // Delete Logic
        listItem.querySelector('.delete-btn').addEventListener('click', () => {
            listItem.remove();
            saveTasks(); // Save the updated list after deleting
        });

        taskList.appendChild(listItem);
    };

    // 4. Handle Adding a task
    const addTask = () => {
        const taskText = taskInput.value.trim();

        if (taskText === '') {
            alert('Please type something first!');
            return; 
        }

        renderTask(taskText);
        saveTasks(); // Save the new task to memory
        taskInput.value = ''; 
    };

    // Listen for Button Click
    addButton.addEventListener('click', addTask);
    
    // Listen for Enter Key
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Run the load function on startup
    loadTasks();
});