const inputField = document.getElementById('input-text');
const editField = document.getElementById('edit-text');
const addItem = document.querySelector('.click-btn');
const saveItem = document.querySelector('.save-btn');
const ulAllTask = document.getElementById('all-task');
const editBtn = document.querySelectorAll('.edit');
const deleteBtn = document.querySelector('.del');
const overlay =document.querySelector('.overlay')
const modal =document.querySelector('.modal');
const para =document.querySelector('.para');
const crossBtn = document.querySelector('.close-modal-btn');
const downContainer = document.querySelector('.container-down');
const completedList = document.getElementById('completed-List');
const pendingList = document.getElementById('pending-List');


let Tasks;
let editLi;

function loadData() {
    const localStorageTasks = localStorage.getItem('tasks');
    if (localStorageTasks) {
        Tasks = JSON.parse(localStorageTasks);
        Tasks.length === 0 ? downContainer.classList.add('hide') : renderLi(Tasks)
    }else{
        Tasks=[];
    }

}
window.addEventListener('load', loadData);
const openModal = function(){
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
} 

function closeModal (){
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}

inputField.focus();

function handleAddItem(){
    const inputValue = inputField.value.trim();

    if (inputValue === "") {
        alert("Please enter any task");
    } else if (/^\s*[.]+\s*$/.test(inputValue)) {
        alert("Task cannot be just dots");
    }else{
        const date = new Date();
        const time = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        const formatDate = `${date.toLocaleDateString()}`;
        const newObj = {
            date:time,
            data:{
                inputVal: inputField.value,
                formatDate: formatDate,
                showCompleteness:''
            },
            status:0,
        };
        Tasks.push(newObj)
        saveChanges();
        inputField.value = "";
    }
}

if(completedList.innerHTML === ''){
    
}

function renderLi(taskArr){
    ulAllTask.innerHTML = '';
    completedList.innerHTML = '';
    pendingList.innerHTML = '';

    taskArr.forEach(el => {
        const html = `<li id="${el.date}">
        <div class="checkbox">
        <input type="checkbox" onchange="handleOnchange(event) " ${el.status === 1 ? 'checked' : ''}/>
        </div>
        <div class="item-cnt">
        <p class="para">${el.data.inputVal}</p>${el.data.showCompleteness}
        <span><em>${el.data.formatDate}</em></span> 
        </div>
        <button class="edit">Edit</button>
        <button class="del">Delete</button>
        </li>`;
        ulAllTask.insertAdjacentHTML("beforeend",html);
    });

    taskArr.forEach(el => {
        if(el.status === 1) {
            const html = `<li>✅ ${el.data.inputVal}</li>`;
            completedList.insertAdjacentHTML("beforeend",html);
        }
    });

    taskArr.forEach(el => {
        if(el.status === 0) {
            const html = `<li>⌚ ${el.data.inputVal}</li>`;
            pendingList.insertAdjacentHTML("beforeend",html);
        }
    });
}

function handleOnchange(e){
    if(e.target.checked){
        Tasks.map(el => {
        if(e.target.closest('li').id === el.date){
            el.status = 1;
            el.data.showCompleteness = `<em class="com">✅completed</em>`;
        }
    })
    }else{
        Tasks.map(el => {
        if(e.target.closest('li').id === el.date){
            el.status = 0;
            el.data.showCompleteness = '';
        }
    });
    }
    saveChanges();
}

let targetLi;
addItem.addEventListener('click',handleAddItem);
crossBtn.addEventListener('click',closeModal);
overlay.addEventListener('click',closeModal);

document.addEventListener('click',function(e){
    if(e.target.classList.contains('del')){
        Tasks = Tasks.filter(el => {
            return !(e.target.parentElement.id === el.date);
        });
        saveChanges();
    }

    if(e.target.classList.contains('edit')){
        editLi = e.target.closest('li').id;
        openModal();
        targetLi = e.target.closest('li').querySelector('p').firstChild;
        editField.focus();
        editField.value = targetLi.textContent;
    }

    if(e.target.classList.contains('para')){
        e.target.classList.toggle('completed');
        const emElement = e.target.nextElementSibling;
        
        if (emElement && emElement.classList.contains('com')) {
            Tasks.map(el => {
                if(e.target.closest('li').id === el.date){
                    el.status = 0;
                    el.data.showCompleteness = '';
                }
            });
            saveChanges();

        } else {
            Tasks.map(el => {
                if(e.target.closest('li').id === el.date){
                    el.status = 1;
                    el.data.showCompleteness = `<em class="com">✅completed</em>`;
                }
            });
            saveChanges();
        }
    }

});

saveItem.addEventListener('click', function(){
    if(editField.value === ""){
        alert('Enter changes!');
    }else{
            Tasks.map(el => {
            if(editLi === el.date){
                el.data.inputVal = editField.value;
                }
            });
    closeModal();
    saveChanges();
    }
});

function save() {
    localStorage.setItem('tasks', JSON.stringify(Tasks));
}

function saveChanges() {
    save();
    renderLi(Tasks);
    Tasks.length === 0 ? downContainer.classList.add('hide') : downContainer.classList.remove('hide');
}



