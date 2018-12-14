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
    this.JSONName= params.JSONName;
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
    checkbox.onclick = function(){ 
        this.Remove(listItem);
        this.TaskClicked(listItem.text,this); 
    }.bind(this);
    deleteButton.addEventListener( "click" , ()=>{this.Remove(listItem);});
    editButton.addEventListener( "click" , ()=>{this.EditTask(listItem);});
    this.ul.appendChild(listItem.li); 
    this.Save();
};


TaskList.prototype.Remove = function(listItem){
    this.ul.removeChild(listItem.li);
    this.Save();
}

TaskList.prototype.EditTask = function(listItem){

    var label = listItem.li.querySelector('label');
    var input = listItem.li.querySelector('input[type=text]');
    var editButton = (listItem.li.querySelector('button.edit') || listItem.li.querySelector('button.save'));
    var editClass = listItem.li.classList.contains('editTask');
    if (editClass) {
        label.innerText = input.value;
        listItem.text=input.value;
        editButton.className = "material-icons edit";
        editButton.innerHTML = "<i class='material-icons'>edit</i>";
        this.Save();
    } else {
        input.value = label.innerText;
        editButton.className = "material-icons save";
        editButton.innerHTML = "<i class='material-icons'>save</i>";
    }
    listItem.li.classList.toggle('editTask');
}

TaskList.prototype.Save = function() {
    var TasksArr = [];
    for (var i = 0; i < this.ul.children.length; i++) {
        TasksArr.push(this.ul.children[i].getElementsByTagName('label')[0].innerText);
    }
    localStorage.setItem(this.JSONName, JSON.stringify({
        Tasks: TasksArr
    }));
}

function Vidget() {
    this.UnfinishedTasks = new TaskList({
        id: "unfinished-tasks",
        innerHTML: "<i class='material-icons'>check_box_outline_blank</i>",
        JSONName: "unfinishedTasks"
    });
    this.FinishedTasks = new TaskList({
        id: "finished-tasks",
        innerHTML: "<i class='material-icons'>check_box</i>",
        JSONName: "finishedTasks"
    });
    var TaskClickedList = function(text, taskList){
        if(taskList == this.UnfinishedTasks)
            this.FinishedTasks.addTask(text);
        else this.UnfinishedTasks.addTask(text);
    }.bind(this);
    this.UnfinishedTasks.TaskClicked = TaskClickedList;
    this.FinishedTasks.TaskClicked = TaskClickedList;

    var addButton = document.getElementById("add");
    var newTask = document.getElementById("new-task");
    addButton.addEventListener( "click" , ()=>{
        if (newTask.value.trim()) {
            this.UnfinishedTasks.addTask(newTask.value);
            newTask.value = "";
        }   
    });

    var data=JSON.parse(localStorage.getItem(this.UnfinishedTasks.JSONName));
    if(data)
    for(var i=0; i<data.Tasks.length;i++){
        this.UnfinishedTasks.addTask(data.Tasks[i]);
    }
    data=JSON.parse(localStorage.getItem(this.FinishedTasks.JSONName));
    if(data)
    for(var i=0; i<data.Tasks.length; i++){
        this.FinishedTasks.addTask(data.Tasks[i]);
    }
}

document.addEventListener('DOMContentLoaded', function() {
   new Vidget();
}, false);
