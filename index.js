function Task(params){
    this.text = params.text;
    this.innerHTML = params.innerHTML;

    this.li = document.createElement("li");
    this.checkbox = document.createElement("button");
    var labelTask = document.createElement("label");
    var input = document.createElement('input');
    var editButton = document.createElement('button');
    var deleteButton = document.createElement("button");

    this.checkbox.className = "material-icons checkbox";
    this.checkbox.innerHTML = this.innerHTML; 
    labelTask.innerHTML = this.text;
    input.type = "text";  
    editButton.className = "material-icons edit";
    editButton.innerHTML = "<i class='material-icons'>edit</i>";
    deleteButton.className = "material-icons delete";
    deleteButton.innerHTML = "<i class='material-icons'>delete</i>";

    this.li.appendChild(this.checkbox);
    this.li.appendChild(labelTask);
    this.li.appendChild(input);
    this.li.appendChild(deleteButton);
    this.li.appendChild(editButton);
};

function TaskList(params) {
    this.innerHTML = params.innerHTML;
    this.id = params.id;
    this.ul = document.getElementById(this.id);
    this.TaskClicked;
};

TaskList.prototype.addTask = function(textTask){
    var listItem = new Task({
        text: textTask,
        innerHTML: this.innerHTML
    });
    var checkbox = listItem.li.querySelector("button.checkbox");
    var deleteButton = listItem.li.querySelector("button.delete");
    var editButton = listItem.li.querySelector('button.edit');
    var taskList = this;
    checkbox.onclick = function(){ 
        taskList.Remove(listItem);
        taskList.TaskClicked(listItem.text,taskList); 
    };
    deleteButton.addEventListener( "click" , ()=>{taskList.Remove(listItem);});
    editButton.addEventListener( "click" , ()=>{taskList.EditTask(listItem);});
    this.ul.appendChild(listItem.li); 
    save();
};


TaskList.prototype.Remove = function(listItem){
    this.ul.removeChild(listItem.li);
    save();
}

TaskList.prototype.EditTask = function(listItem){

    var label = listItem.li.querySelector('label');
    var input = listItem.li.querySelector('input[type=text]');
    var editButton = (listItem.li.querySelector('button.edit') || listItem.li.querySelector('button.save'));
    var editClass = listItem.li.classList.contains('editTask');
    if (editClass) {
        label.innerText = input.value;
        editButton.className = "material-icons edit";
        editButton.innerHTML = "<i class='material-icons'>edit</i>";
        save();
    } else {
        input.value = label.innerText;
        editButton.className = "material-icons save";
        editButton.innerHTML = "<i class='material-icons'>save</i>";
    }
    listItem.li.classList.toggle('editTask');
}

var unfinishedTasks = document.getElementById('unfinished-tasks');
var finishedTasks = document.getElementById('finished-tasks');

function save() {
    var unfinishedTasksArr = [];
    for (var i = 0; i < unfinishedTasks.children.length; i++) {
        unfinishedTasksArr.push(unfinishedTasks.children[i].getElementsByTagName('label')[0].innerText);
    }
    var finishedTasksArr = [];
    for (var i = 0; i < finishedTasks.children.length; i++) {
        finishedTasksArr.push(finishedTasks.children[i].getElementsByTagName('label')[0].innerText);
    }
    // localStorage.removeItem('todo');
    localStorage.setItem('todo', JSON.stringify({
        unfinishedTasks: unfinishedTasksArr,
        finishedTasks: finishedTasksArr
    }));
}

function Vidget() {
    this.UnfinishedTasks = new TaskList({
        id: "unfinished-tasks",
        innerHTML: "<i class='material-icons'>check_box_outline_blank</i>"
    });
    this.FinishedTasks = new TaskList({
        id: "finished-tasks",
        innerHTML: "<i class='material-icons'>check_box</i>"
    });
    var vidget = this;
    var func=function(text, taskList){
        if(taskList == vidget.UnfinishedTasks)
            vidget.FinishedTasks.addTask(text);
        else vidget.UnfinishedTasks.addTask(text);
    }
    this.UnfinishedTasks.TaskClicked = func;
    this.FinishedTasks.TaskClicked=func;

    var addButton = document.getElementById("add");
    var newTask = document.getElementById("new-task");
    addButton.addEventListener( "click" , ()=>{
        if (newTask.value.trim()) {
            this.UnfinishedTasks.addTask(newTask.value);
            newTask.value = "";
        }   
    });

    var data=JSON.parse(localStorage.getItem('todo'));
    for(var i=0; i<data.unfinishedTasks.length;i++){
        this.UnfinishedTasks.addTask(data.unfinishedTasks[i]);
    }
    for(var i=0; i<data.finishedTasks.length; i++){
        this.FinishedTasks.addTask(data.finishedTasks[i]);
    }
}

document.addEventListener('DOMContentLoaded', function() {
   new Vidget();
}, false);
