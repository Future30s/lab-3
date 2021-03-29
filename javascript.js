'use strict';

const privateIconSVG = `
<svg class="bi bi-person-square" width="1.2em" height="1.2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z" clip-rule="evenodd"/>
<path fill-rule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
</svg>
`;


function Task(id, description, deadline = null, isUrgent = true, isPrivate = false) {
    this.id = id;
    this.description = description;
    if (deadline === null || dayjs.isDayjs(deadline))
        this.deadline = deadline;
    this.isPrivate = isPrivate;
    this.isUrgent = isUrgent;

    this.toString = () => `Id: ${this.id}, Description: ${this.description}, IsUrgent: ${this.isUrgent}, IsPrivate: ${this.isPrivate}, Deadline: ${this.deadline?.toString()}`;
}

function TaskList() {
    this.tasks = [];
    this.activeFilter = "all_task";

    this.addTask = (t) => {
        this.tasks.push(t);
    };

    this.setFilter = (filter) => {
        switch(filter){
            case "important_task": 
            case "today_task": 
            case "next_task": 
            case "private_task" :
            case "all_task":
            this.activeFilter = filter;
            return;
            
            default: throw "invalid target id"};
        };

    this.getTasks = () =>  this.tasks
    .filter((t) => {switch(this.activeFilter){
        case "important_task": return t.isUrgent;
        case "today_task": return t.deadline.isSame(dayjs(), 'day');
        case "next_task": return t.deadline.isAfter(dayjs().subtract(7,'day'),'day');
        case "private_task" : return t.isPrivate;
        case "all_task":
        default: return true;
    }}).sort((a, b) => {
        if (b.deadline === null)
            return -1
        if (a.deadline === null)
            return 1
        return a.deadline.isAfter(b.deadline) ? 1 : -1;
    });
}


// Generare il template HTML per l'elemento "task singolo"
function generateTaskElement(t){
    const taskElement = document.createElement("li");
    taskElement.classList.add("list-group-item");
    taskElement.innerHTML = `
    <div class="d-flex w-100 justify-content-between">
      <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" id="check-t${t.id}">
        <label class="custom-control-label ${(t.isUrgent)?"important":""}" for="check-t${t.id}">${t.description}</label>
      </div>
      ${(t.isPrivate)? privateIconSVG : ""}
      <small>${t.deadline}</small>
    </div>
    `;

    /*if (t.isUrgent){
        const labelElement = taskElement.getElementsByTagName("label");
        labelElement.classList.add("important");
    }*/

    return taskElement;
}

let t1 = new Task(1, "Spesa", dayjs("2021-04-10T10:00:00.000Z"), false,);
let t2 = new Task(2, "Meccanico", dayjs("2021-04-11T13:00:00.000Z"), true, true);
let t3 = new Task(3, "Cavallo", dayjs("2021-04-12T16:00:00.000Z"), true, true);
let t4 = new Task(4, "Produzione di zebre selvatiche", dayjs("2021-05-12T18:30:00.000Z"), true, true);
let t5 = new Task(5, "Pettinare le galline", dayjs("2021-03-29T16:00:00.000Z"), true, true);
let t6 = new Task(6, "Preparare arancini", dayjs("2021-03-12T16:00:00.000Z"), true, true);
let t7 = new Task(7, "Tagliare l'ananas a quadratini", dayjs("2021-04-21T17:00:00.000Z"), false, true);
let t8 = new Task(8, "Mangiare insalata", dayjs("2021-03-21T17:00:00.000Z"), true, true);

let taskList = new TaskList();

taskList.addTask(t1);
taskList.addTask(t2);
taskList.addTask(t3);
taskList.addTask(t4);
taskList.addTask(t5);
taskList.addTask(t6);
taskList.addTask(t7);
taskList.addTask(t8);

// Otteniamo il riferimento all'elemento "lista tasks"
const taskListElement = document.getElementById('tasklist');
const filterListElement = document.getElementById('filterList');
const filterListTitle = document.getElementById("FILTER_LIST_TITLE");
generateTaskList();

function handleFilterClick(e) {
    let targetId = e.target.id;
   
    console.log(targetId);
    try {
        taskList.setFilter(targetId);
    } catch (e){
        console.log("invalid filter target id");
        return;
    }

    // rimuovere classe active dall'elemento che la ha
    filterListElement.getElementsByClassName('active')[0].classList.remove('active');
    // aggiungerla al nuovo
    e.target.classList.add('active');
    filterListTitle.innerText = e.target.innerText;
    // elimino tutti i contenuti del taskListElement
    taskListElement.innerHTML = "";
    // generiamo la lista
    generateTaskList();
   }

function generateTaskList(){
// Ottenere la lista di tasks sulla quale iterare
    let tasks = taskList.getTasks();
    tasks.forEach((t) => {
        // // Ogni iterazione popoliamo il template "task singolo" con i dati del Task iterato
        let taskElement = generateTaskElement(t);
        // // Aggiungiamo il "task singolo" come child dell'elemento "lista tasks"
        taskListElement.appendChild(taskElement);
    });
}

document.getElementById("filterList").addEventListener("click", handleFilterClick);