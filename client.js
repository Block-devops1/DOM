// The best practice: wait until the HTML is fully loaded before trying to grab elements
document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the three elements we need to interact with (based on their IDs)
    const taskInput = document.getElementById('new-task');
    const addButton = document.getElementById('add-button');
    const taskList = document.getElementById('task-list');

    // 2. Define the main function to create and add a new task
    const addTask = () => {
        // Get the text the user typed, and use .trim() to remove any extra spaces
        const taskText = taskInput.value.trim();

        // VALIDATION: If the input is empty, stop the function and do nothing
        if (taskText === '') {
            alert('Please enter a task!');
            return; 
        }

        // 3. CORE LOGIC: Create the new list item (<li>) and its contents
        
        // a. Create the <li> element itself
        const listItem = document.createElement('li');
        
        // b. Add the task text inside the <li>
        listItem.innerHTML = `
            <span>${taskText}</span>
            <button class="delete-btn">Delete</button>
        `;
        
        // c. Append the new <li> element to the main <ul> element
        taskList.appendChild(listItem);
        
        // d. Clear the input field for the next task
        taskInput.value = ''; 
        
        // 4. Attach the delete behavior to the new button we just created
        // We look for the delete button *inside* the listItem we created.
        const deleteButton = listItem.querySelector('.deletes-btn');
        deleteButton.addEventListener('click', () => {
            // The logic: Remove the parent element (the <li>) of the button.
            listItem.remove(); 
        });
    };

    // 5. Connect the function to the 'Add Task' button's click event
    addButton.addEventListener('click', addTask);
    
    // BONUS: Allow adding a task by pressing the 'Enter' key in the input field
    taskInput.addEventListener('keypress', (event) => {
        // KeyCode 13 is the Enter key
        if (event.key === 'Enter') {
            addTask();
        }
    });
});
