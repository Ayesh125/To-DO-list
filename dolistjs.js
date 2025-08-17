document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');
  const addBtn = document.getElementById('addBtn');
  const deleteAllBtn = document.getElementById('deleteAll');
  const clearCompletedBtn = document.getElementById('clearCompleted');
  const totalTasksSpan = document.getElementById('totalTasks');
  const completedTasksSpan = document.getElementById('completedTasks');

  // Load saved tasks from localStorage
  loadTasks();

  // Event listeners
  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  deleteAllBtn.addEventListener('click', deleteAllTasks);
  clearCompletedBtn.addEventListener('click', clearCompletedTasks);

  function addTask() {
    const taskText = taskInput.value.trim();

    if (!taskText) {
      showInputError();
      return;
    }

    const li = document.createElement('li');
    li.innerHTML = `
      <span>${taskText}</span>
      <div class="task-actions">
        <button class="complete-btn">✓</button>
        <button class="delete-btn">🗑</button>
      </div>
    `;

    // Add event listeners to new buttons
    li.querySelector('.complete-btn').addEventListener('click', () => toggleComplete(li));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(li));

    taskList.appendChild(li);
    taskInput.value = '';
    saveTasks();
    updateStats();
  }

  function toggleComplete(taskElement) {
    taskElement.classList.toggle('completed');
    saveTasks();
    updateStats();
  }

  function deleteTask(taskElement) {
    taskElement.remove();
    saveTasks();
    updateStats();
  }

  function deleteAllTasks() {
    if (taskList.children.length === 0) {
      alert('There are no tasks to delete.');
      return;
    }

    if (confirm('Are you sure you want to delete ALL tasks?')) {
      taskList.innerHTML = '';
      saveTasks();
      updateStats();
    }
  }

  function clearCompletedTasks() {
    const completedTasks = document.querySelectorAll('li.completed');
    if (completedTasks.length === 0) {
      alert('There are no completed tasks to clear.');
      return;
    }

    if (confirm('Are you sure you want to clear all completed tasks?')) {
      completedTasks.forEach(task => task.remove());
      saveTasks();
      updateStats();
    }
  }

  function saveTasks() {
    localStorage.setItem('tasks', taskList.innerHTML);
  }

  function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      taskList.innerHTML = savedTasks;
      
      // Attach event listeners to all existing tasks
      document.querySelectorAll('li').forEach(li => {
        li.querySelector('.complete-btn').addEventListener('click', () => toggleComplete(li));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(li));
      });
      
      updateStats();
    }
  }

  function updateStats() {
    const totalTasks = taskList.children.length;
    const completedTasks = document.querySelectorAll('li.completed').length;
    
    totalTasksSpan.textContent = totalTasks;
    completedTasksSpan.textContent = completedTasks;
  }

  function showInputError() {
    taskInput.classList.add('input-error');
    setTimeout(() => taskInput.classList.remove('input-error'), 1000);
    alert('Please enter a task before adding.');
  }
});