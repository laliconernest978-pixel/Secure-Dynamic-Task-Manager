// ==========================================
// SECURE DYNAMIC TASK MANAGER
// ==========================================


// ==========================================
// DOM SELECTORS
// ==========================================

const taskInput =
    document.querySelector("#taskInput");

const addTaskBtn =
    document.querySelector("#addTaskBtn");

const loadSamplesBtn =
    document.querySelector("#loadSamplesBtn");

const taskList =
    document.querySelector("#taskList");

const taskMessage =
    document.querySelector("#taskMessage");

const totalCount =
    document.querySelector("#totalCount");

const pendingCount =
    document.querySelector("#pendingCount");

const completedCount =
    document.querySelector("#completedCount");


// ==========================================
// UNIQUE TASK ID
// ==========================================

let nextTaskId = 1;


// ==========================================
// CREATE TASK ELEMENT
// ==========================================

function createTaskElement(taskText, taskId) {

    const taskItem =
        document.createElement("li");

    taskItem.classList.add("task-item");

    taskItem.dataset.taskId =
        taskId;

    taskItem.dataset.state =
        "pending";


    // Create task text
    const textSpan =
        document.createElement("span");

    textSpan.classList.add("task-text");

    // Secure text
    textSpan.textContent =
        taskText;


    // Create Complete button
    const completeButton =
        document.createElement("button");

    completeButton.type =
        "button";

    completeButton.classList.add(
        "complete-btn"
    );

    completeButton.textContent =
        "Complete";


    // Create Edit button
    const editButton =
        document.createElement("button");

    editButton.type =
        "button";

    editButton.classList.add(
        "edit-btn"
    );

    editButton.textContent =
        "Edit";


    // Create Remove button
    const removeButton =
        document.createElement("button");

    removeButton.type =
        "button";

    removeButton.classList.add(
        "remove-btn"
    );

    removeButton.textContent =
        "Remove";


    // Add elements to task
    taskItem.append(
        textSpan,
        completeButton,
        editButton,
        removeButton
    );


    return taskItem;
}


// ==========================================
// ADD TASK
// ==========================================

function addTask(taskText) {

    const trimmedText =
        taskText.trim();


    // Validate empty task
    if (!trimmedText) {

        taskMessage.textContent =
            "Task cannot be empty";

        return;
    }


    // Create unique ID
    const taskId =
        `task-${nextTaskId}`;

    nextTaskId += 1;


    // Create task
    const taskItem =
        createTaskElement(
            trimmedText,
            taskId
        );


    // Add task to DOM
    taskList.append(taskItem);


    // Clear input
    taskInput.value = "";


    // Clear message
    taskMessage.textContent = "";


    // Update counters
    updateTaskCounts();


    // Focus input
    taskInput.focus();
}


// ==========================================
// TOGGLE TASK COMPLETE
// ==========================================

function toggleTaskComplete(taskItem) {

    const isCompleted =
        taskItem.classList.toggle(
            "completed"
        );


    if (isCompleted) {

        taskItem.dataset.state =
            "completed";

    } else {

        taskItem.dataset.state =
            "pending";
    }


    updateTaskCounts();
}


// ==========================================
// BEGIN TASK EDIT
// ==========================================

function beginTaskEdit(taskItem) {

    const textSpan =
        taskItem.querySelector(
            ".task-text"
        );

    const editButton =
        taskItem.querySelector(
            ".edit-btn"
        );


    if (!textSpan || !editButton) {
        return;
    }


    // Create edit input
    const editInput =
        document.createElement("input");

    editInput.type =
        "text";

    editInput.classList.add(
        "edit-input"
    );


    // Put current text into input
    editInput.value =
        textSpan.textContent;


    // Replace text with input
    textSpan.replaceWith(
        editInput
    );


    // Change Edit to Save
    editButton.textContent =
        "Save";


    // Focus input
    editInput.focus();

    editInput.select();
}


// ==========================================
// SAVE TASK EDIT
// ==========================================

function saveTaskEdit(taskItem) {

    const editInput =
        taskItem.querySelector(
            ".edit-input"
        );

    const editButton =
        taskItem.querySelector(
            ".edit-btn"
        );


    if (!editInput || !editButton) {
        return;
    }


    // Get edited text
    const editedText =
        editInput.value.trim();


    // Validate
    if (!editedText) {

        taskMessage.textContent =
            "Task cannot be empty";

        editInput.focus();

        return;
    }


    // Create new text span
    const textSpan =
        document.createElement("span");

    textSpan.classList.add(
        "task-text"
    );


    // Secure edited text
    textSpan.textContent =
        editedText;


    // Replace input
    editInput.replaceWith(
        textSpan
    );


    // Change Save to Edit
    editButton.textContent =
        "Edit";


    // Clear message
    taskMessage.textContent =
        "";


    updateTaskCounts();
}


// ==========================================
// REMOVE TASK
// ==========================================

function removeTask(taskItem) {

    taskItem.remove();

    updateTaskCounts();
}


// ==========================================
// UPDATE TASK COUNTS
// ==========================================

function updateTaskCounts() {

    const taskItems =
        taskList.querySelectorAll(
            ".task-item"
        );


    // Total
    const total =
        taskItems.length;


    // Completed
    const completed =
        [...taskItems].filter(
            (taskItem) =>
                taskItem.dataset.state ===
                "completed"
        ).length;


    // Pending
    const pending =
        [...taskItems].filter(
            (taskItem) =>
                taskItem.dataset.state ===
                "pending"
        ).length;


    // Display counts
    totalCount.textContent =
        total;

    pendingCount.textContent =
        pending;

    completedCount.textContent =
        completed;
}


// ==========================================
// EVENT DELEGATION
// ==========================================

function handleTaskListClick(event) {

    const actionButton =
        event.target;


    // Make sure target is an element
    if (!(actionButton instanceof Element)) {
        return;
    }


    // Check action button
    if (
        !actionButton.matches(
            ".complete-btn, .edit-btn, .remove-btn"
        )
    ) {
        return;
    }


    // Find parent task
    const taskItem =
        actionButton.closest(
            ".task-item"
        );


    if (!taskItem) {
        return;
    }


    // COMPLETE
    if (
        actionButton.classList.contains(
            "complete-btn"
        )
    ) {

        toggleTaskComplete(
            taskItem
        );

        return;
    }


    // EDIT / SAVE
    if (
        actionButton.classList.contains(
            "edit-btn"
        )
    ) {

        const isEditing =
            Boolean(
                taskItem.querySelector(
                    ".edit-input"
                )
            );


        if (isEditing) {

            saveTaskEdit(
                taskItem
            );

        } else {

            beginTaskEdit(
                taskItem
            );
        }

        return;
    }


    // REMOVE
    if (
        actionButton.classList.contains(
            "remove-btn"
        )
    ) {

        removeTask(
            taskItem
        );
    }
}


// ==========================================
// LOAD SAMPLE TASKS
// ==========================================

function loadSampleTasks() {

    const sampleTasks = [
        "Review DOM selectors",
        "Practice createElement",
        "Study event delegation"
    ];


    // Create DocumentFragment
    const fragment =
        document.createDocumentFragment();


    // Create all sample tasks
    sampleTasks.forEach(
        (taskText) => {

            const taskId =
                `task-${nextTaskId}`;

            nextTaskId += 1;


            const taskItem =
                createTaskElement(
                    taskText,
                    taskId
                );


            fragment.append(
                taskItem
            );
        }
    );


    // Append fragment ONCE
    taskList.append(
        fragment
    );


    taskMessage.textContent =
        "";


    updateTaskCounts();
}


// ==========================================
// ADD TASK BUTTON
// ==========================================

addTaskBtn.addEventListener(
    "click",
    () => {

        addTask(
            taskInput.value
        );
    }
);


// ==========================================
// ENTER KEY
// ==========================================

taskInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            addTask(
                taskInput.value
            );
        }
    }
);


// ==========================================
// LOAD SAMPLE BUTTON
// ==========================================

loadSamplesBtn.addEventListener(
    "click",
    loadSampleTasks
);


// ==========================================
// ONE DELEGATED CLICK LISTENER
// ==========================================

taskList.addEventListener(
    "click",
    handleTaskListClick
);


// ==========================================
// INITIAL STATE
// ==========================================

updateTaskCounts();