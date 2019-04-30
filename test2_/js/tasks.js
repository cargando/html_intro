
var TASKS_NAME = 'tasks';
var STATE = {
  [TASKS_NAME]: [],
  formName: 'form1',
  calendar: 'calendar',
  showCalendar: false,
};

function updateLocalStorage(varName, objData) {
  // window.localStorage.setItem(varName, objData);
  var tmp = JSON.stringify(objData);
  localStorage.setItem(varName, tmp);
  return true;
}

function getDataFromLocalStorage(varName) {
  var tmp = JSON.parse(localStorage.getItem(varName));
  return tmp || [];
}

function initTaskContainer() {
  var data = STATE[TASKS_NAME] = getDataFromLocalStorage(TASKS_NAME); // загрузили данные из локал сторадж
  var keysCount = data.length || 0; // Object.keys(data).length || 0;
  clearFormList();

  if(!keysCount) {
    coreInsertLiToList({task: "На сегодня нет активных задач"});
  } else {
    for(var i = 0; i < keysCount; i++) {
      coreInsertLiToList(data[i], i, true);
    }
  }
}

function insertItemToList() {
  var task = document.getElementById('taskData').value;
  var errCounter = 0;
  task = task.trim();
  if( !task.length ) {
    printErrorHelper('taskData', "Это поле обязательно для ввода - введите название задачи", true);
    errCounter++;
  }
  var reminder = document.getElementById('reminderData').value;
  reminder = reminder.trim();
  if( !reminder.length ) {
    printErrorHelper('reminderData', "Дата задачи обязательна для ввода", true);
    errCounter++;
  }
  var check = document.getElementById('Check1').checked;
  if (errCounter) {
    return false;
  }
  console.log({ task, reminder, check });
  STATE[TASKS_NAME].push({ task, reminder, check });
  emptyAllList();
  return true;
}

function updateFormAndState() {
  updateLocalStorage(TASKS_NAME, STATE[TASKS_NAME]);
  clearForm();
  initTaskContainer();
}

function printErrorHelper(id, msg, err = false) {
  var errorHelper = document.getElementById( id + 'Help');
  errorHelper.innerHTML = msg;
  if (err) {
    errorHelper.classList.add('text-danger');
  } else {
    errorHelper.classList.remove('text-danger');
  }
}

function coreInsertLiToList(data, index, task = false) {

  var list = document.getElementById('task_list');
  var newListNode = document.createElement('li');
  newListNode.classList.add('list-group-item');
  if (task) {
    newListNode.innerHTML = (data.check ? '<i class="text-danger fa fa-exclamation-triangle"></i> &nbsp ' : '') +
      data.task + '<br /><span class="text-muted"><small>' +
      data.reminder + '</small></span> ' +
      '<span data-id="' + index + '" class="delete_ico" onclick="deleteNode(event)"><i class="fa fa-times"></i></span>';
      newListNode.setAttribute('data-type', 'task');
  }
  else {
    newListNode.innerHTML = data.task;
    newListNode.setAttribute('data-type', 'empty');
  }
  list.appendChild(newListNode);
}

function clearForm() {
    document.getElementById(STATE.formName).reset();
    printErrorHelper('taskData', "Введите название занятия на завтра.");
    printErrorHelper('reminderData', "Введите дату и время напоминания.");

}

function emptyAllList(){
  document.getElementById('task_list').innerHTML = '';
  updateFormAndState();
}

function deleteNode(event) {
  var tmp = event.target;
  var nodeToDelete = tmp.parentNode.getAttribute('data-id');
  if (nodeToDelete === undefined || nodeToDelete === null) {
    console.log('Shit on me: can\'t determine attribute data-id ', nodeToDelete);
    return false;
  }
  
  STATE[TASKS_NAME].splice(nodeToDelete, 1);
  updateFormAndState();

}

function handleClearList() {
  STATE[TASKS_NAME] = [];
  updateFormAndState();
}

function clearFormList() {
  var list = document.getElementById('task_list');
  list.innerHTML = '';
}

function showCalendar(event) {
  console.log('IN showCalendar ', STATE.showCalendar);
    event.stopPropagation();
    if( STATE.showCalendar) {
      return false;
    }

  var calendar = document.getElementById(STATE.calendar)
  var button = event.target.getBoundingClientRect(); 
  console.log(event.pageX, event.pageY, button);

  calendar.style.top = button.bottom;
  calendar.style.left = button.left;
  calendar.style.display = "block";
  STATE.showCalendar = true;
}

function hideCalendar(event) {
  event.stopPropagation();
  console.log('IN hideCalendar ', STATE.showCalendar);
    if( !STATE.showCalendar) {
      return false;
    }
    calendar.style.display = "none";
    STATE.showCalendar = false;
    return true;

}



