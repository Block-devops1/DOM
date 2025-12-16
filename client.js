// 1. INITIALIZE SUPABASE
// Replace these with your actual Project URL and Anon Key from Supabase Settings -> API
const SUPABASE_URL = 'https://qxuoupnjjwuoryatrizy.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_Y2TJOWkQS4QcPaFD8LlV1g_1NtyGlKw'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const taskInput = document.getElementById('new-task');
    const addButton = document.getElementById('add-button');
    const taskList = document.getElementById('task-list');

    // 2. LOAD DATA FROM CLOUD
    const loadTasks = async () => {
        const { data, error } = await _supabase
            .from('todos')
            .select('*');

        if (error) {
            console.error('Error loading tasks:', error.message);
            return;
        }

        if (data) {
            taskList.innerHTML = ''; 
            data.forEach(todo => renderTask(todo.task, todo.id));
        }
    };

    // 3. RENDER FUNCTION
    const renderTask = (taskText, id) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${taskText}</span>
            <button class="delete-btn">×</button>
        `;

        // FIXED: Using '.delete-btn' to match the HTML class
        const deleteBtn = listItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async () => {
            const { error } = await _supabase
                .from('todos')
                .delete()
                .eq('id', id);

            if (!error) {
                listItem.remove();
            }
        });

        taskList.appendChild(listItem);
    };

    // 4. ADD TASK LOGIC
    const addTask = async () => {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const { data, error } = await _supabase
            .from('todos')
            .insert([{ task: taskText }])
            .select(); 

        if (!error && data) {
            renderTask(data[0].task, data[0].id);
            taskInput.value = ''; 
        }
    };

    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });

    loadTasks();
});