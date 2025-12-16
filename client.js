// 1. INITIALIZE SUPABASE
// Replace the strings below with your actual Project URL and Anon Key from Supabase Settings -> API
const SUPABASE_URL = 'https://your-project-url.supabase.co'; 
const SUPABASE_KEY = 'your-anon-public-key'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const taskInput = document.getElementById('new-task');
    const addButton = document.getElementById('add-button');
    const taskList = document.getElementById('task-list');

    // 2. LOAD DATA FROM CLOUD
    const loadTasks = async () => {
        // This asks the Supabase 'todos' table for every row
        const { data, error } = await _supabase
            .from('todos')
            .select('*');

        if (error) {
            console.error('Error loading tasks:', error.message);
            return;
        }

        if (data) {
            // Clear the list first to avoid duplicates, then render each task
            taskList.innerHTML = ''; 
            data.forEach(todo => renderTask(todo.task, todo.id));
        }
    };

    // 3. RENDER FUNCTION (Creates the HTML for each task)
    const renderTask = (taskText, id) => {
        const listItem = document.createElement('li');
        
        listItem.innerHTML = `
            <span>${taskText}</span>
            <button class="delete-btn">×</button>
        `;

        // Attach Delete Logic
        const deleteBtn = listItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async () => {
            // Delete from Cloud using the unique ID
            const { error } = await _supabase
                .from('todos')
                .delete()
                .eq('id', id);

            if (!error) {
                listItem.remove();
            } else {
                console.error('Error deleting:', error.message);
            }
        });

        taskList.appendChild(listItem);
    };

    // 4. ADD TASK LOGIC
    const addTask = async () => {
        const taskText = taskInput.value.trim();

        if (taskText === '') {
            alert('Please type something first!');
            return; 
        }

        // Insert the new task into the 'todos' table
        const { data, error } = await _supabase
            .from('todos')
            .insert([{ task: taskText }])
            .select(); // .select() returns the new ID we need for deleting

        if (!error && data) {
            renderTask(data[0].task, data[0].id);
            taskInput.value = ''; 
        } else {
            console.error('Error adding task:', error ? error.message : 'Unknown error');
        }
    };

    // 5. EVENT LISTENERS
    addButton.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Run the load function immediately when page opens
    loadTasks();
});